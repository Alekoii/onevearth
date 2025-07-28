

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."emotion_type" AS ENUM (
    'positive',
    'negative',
    'neutral'
);


ALTER TYPE "public"."emotion_type" OWNER TO "postgres";


CREATE TYPE "public"."group_role" AS ENUM (
    'admin',
    'member'
);


ALTER TYPE "public"."group_role" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'new_reaction',
    'new_comment',
    'new_mention',
    'new_follower'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."post_visibility" AS ENUM (
    'public',
    'private',
    'group'
);


ALTER TYPE "public"."post_visibility" OWNER TO "postgres";


CREATE TYPE "public"."report_status" AS ENUM (
    'pending',
    'reviewed',
    'resolved',
    'dismissed'
);


ALTER TYPE "public"."report_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_sessions"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  DELETE FROM user_sessions 
  WHERE last_active < NOW() - INTERVAL '30 days'
    OR (is_active = FALSE AND last_active < NOW() - INTERVAL '7 days');
END;
$$;


ALTER FUNCTION "public"."cleanup_old_sessions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_notification_on_event"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  notification_recipient_id uuid;
  notification_type notification_type;
  notification_post_id bigint;
  notification_comment_id bigint;
BEGIN
  -- Determine the recipient and type based on the table that triggered the function
  IF TG_TABLE_NAME = 'post_reactions' THEN
    SELECT user_id INTO notification_recipient_id FROM posts WHERE id = NEW.post_id;
    notification_type := 'new_reaction';
    notification_post_id := NEW.post_id;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    SELECT user_id INTO notification_recipient_id FROM posts WHERE id = NEW.post_id;
    notification_type := 'new_comment';
    notification_post_id := NEW.post_id;
    notification_comment_id := NEW.id;
  ELSIF TG_TABLE_NAME = 'followers' THEN
    notification_recipient_id := NEW.following_id;
    notification_type := 'new_follower';
  ELSIF TG_TABLE_NAME = 'mentions' THEN
    notification_recipient_id := NEW.mentioned_user_id;
    notification_type := 'new_mention';
    notification_post_id := NEW.post_id;
    notification_comment_id := NEW.comment_id;
  END IF;

  -- Create the notification if the actor is not the recipient
  IF notification_recipient_id <> NEW.user_id OR TG_TABLE_NAME = 'followers' AND NEW.follower_id <> NEW.following_id THEN
    INSERT INTO public.notifications(recipient_id, actor_id, notification_type, post_id, comment_id)
    VALUES (
        notification_recipient_id,
        CASE WHEN TG_TABLE_NAME = 'followers' THEN NEW.follower_id ELSE NEW.user_id END,
        notification_type,
        notification_post_id,
        notification_comment_id
    );
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_notification_on_event"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_blocked"("p_user_id_1" "uuid", "p_user_id_2" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM blocks WHERE (blocker_id = p_user_id_1 AND blocked_id = p_user_id_2) OR (blocker_id = p_user_id_2 AND blocked_id = p_user_id_1));
END;
$$;


ALTER FUNCTION "public"."is_blocked"("p_user_id_1" "uuid", "p_user_id_2" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_group_member"("p_group_id" bigint, "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM group_members WHERE group_id = p_group_id AND user_id = p_user_id);
END;
$$;


ALTER FUNCTION "public"."is_group_member"("p_group_id" bigint, "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_follower_counts"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following count for follower
    UPDATE profiles SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    -- Increment follower count for followed user
    UPDATE profiles SET follower_count = follower_count + 1 
    WHERE id = NEW.following_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following count for follower
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0)
    WHERE id = OLD.follower_id;
    
    -- Decrement follower count for followed user
    UPDATE profiles SET follower_count = GREATEST(follower_count - 1, 0)
    WHERE id = OLD.following_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_follower_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_hashtag_counts"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE hashtags SET 
      usage_count = usage_count + 1,
      updated_at = NOW()
    WHERE id = NEW.hashtag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE hashtags SET 
      usage_count = GREATEST(usage_count - 1, 0),
      updated_at = NOW()
    WHERE id = OLD.hashtag_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_hashtag_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_last_active"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  UPDATE profiles SET last_active = NOW() 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_last_active"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_post_counts"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET post_count = post_count + 1 
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET post_count = GREATEST(post_count - 1, 0)
    WHERE id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_post_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_preferences_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_preferences_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_premium_status"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Assuming webhook payload includes user_id and event_type
  IF (NEW.event_type = 'INITIAL_PURCHASE' OR NEW.event_type = 'RENEWAL') THEN
    UPDATE profiles 
    SET has_premium = TRUE 
    WHERE id = NEW.user_id;
  ELSIF (NEW.event_type = 'CANCELLATION' OR NEW.event_type = 'EXPIRATION') THEN
    UPDATE profiles 
    SET has_premium = FALSE 
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_premium_status"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."app_configuration" (
    "id" bigint NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb",
    "description" "text",
    "is_public" boolean DEFAULT false,
    "environment" "text" DEFAULT 'production'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."app_configuration" OWNER TO "postgres";


ALTER TABLE "public"."app_configuration" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."app_configuration_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."blocks" (
    "id" bigint NOT NULL,
    "blocker_id" "uuid" NOT NULL,
    "blocked_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "cannot_block_self" CHECK (("blocker_id" <> "blocked_id"))
);


ALTER TABLE "public"."blocks" OWNER TO "postgres";


COMMENT ON TABLE "public"."blocks" IS 'Stores user block relationships to filter content and interactions.';



ALTER TABLE "public"."blocks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."blocks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "post_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text",
    "parent_comment_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."emotions" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "emoji" "text",
    "type" "public"."emotion_type" NOT NULL,
    "emotion_group" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."emotions" OWNER TO "postgres";


ALTER TABLE "public"."emotions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."emotions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."followers" (
    "id" bigint NOT NULL,
    "follower_id" "uuid" NOT NULL,
    "following_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."followers" OWNER TO "postgres";


ALTER TABLE "public"."followers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."followers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" bigint NOT NULL,
    "group_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."group_role" DEFAULT 'member'::"public"."group_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


ALTER TABLE "public"."group_members" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."group_members_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" bigint NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_private" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


ALTER TABLE "public"."groups" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."hashtags" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "usage_count" bigint DEFAULT 0,
    "trending_score" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."hashtags" OWNER TO "postgres";


ALTER TABLE "public"."hashtags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."hashtags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."media_attachments" (
    "id" bigint NOT NULL,
    "post_id" bigint,
    "type" "text" NOT NULL,
    "url" "text" NOT NULL,
    "thumbnail_url" "text",
    "filename" "text",
    "file_size" bigint,
    "mime_type" "text",
    "width" integer,
    "height" integer,
    "duration" integer,
    "alt_text" "text",
    "storage_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "media_attachments_type_check" CHECK (("type" = ANY (ARRAY['image'::"text", 'video'::"text", 'audio'::"text", 'document'::"text"])))
);


ALTER TABLE "public"."media_attachments" OWNER TO "postgres";


ALTER TABLE "public"."media_attachments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."media_attachments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mentions" (
    "id" bigint NOT NULL,
    "mentioned_user_id" "uuid" NOT NULL,
    "post_id" bigint,
    "comment_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "check_mention_source" CHECK ((("post_id" IS NOT NULL) OR ("comment_id" IS NOT NULL)))
);


ALTER TABLE "public"."mentions" OWNER TO "postgres";


ALTER TABLE "public"."mentions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mentions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."moderation_queue" (
    "id" bigint NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" bigint NOT NULL,
    "flagged_by" "text" NOT NULL,
    "reason" "text",
    "severity" "text" DEFAULT 'medium'::"text",
    "status" "text" DEFAULT 'pending'::"text",
    "moderator_id" "uuid",
    "ai_confidence" numeric,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "reviewed_at" timestamp with time zone,
    CONSTRAINT "moderation_queue_content_type_check" CHECK (("content_type" = ANY (ARRAY['post'::"text", 'comment'::"text", 'profile'::"text", 'media'::"text"]))),
    CONSTRAINT "moderation_queue_flagged_by_check" CHECK (("flagged_by" = ANY (ARRAY['ai'::"text", 'user'::"text", 'admin'::"text"]))),
    CONSTRAINT "moderation_queue_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"]))),
    CONSTRAINT "moderation_queue_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'reviewing'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."moderation_queue" OWNER TO "postgres";


ALTER TABLE "public"."moderation_queue" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."moderation_queue_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "notification_type" "public"."notification_type" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "post_id" bigint,
    "comment_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


ALTER TABLE "public"."notifications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."plugin_data" (
    "id" bigint NOT NULL,
    "plugin_id" "text" NOT NULL,
    "user_id" "uuid",
    "key" "text" NOT NULL,
    "value" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."plugin_data" OWNER TO "postgres";


ALTER TABLE "public"."plugin_data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."plugin_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."post_hashtags" (
    "id" bigint NOT NULL,
    "post_id" bigint,
    "hashtag_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."post_hashtags" OWNER TO "postgres";


ALTER TABLE "public"."post_hashtags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."post_hashtags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."post_reactions" (
    "id" bigint NOT NULL,
    "post_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "action_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post_reactions" OWNER TO "postgres";


ALTER TABLE "public"."post_reactions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."post_reactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text",
    "emotion_id" bigint,
    "available_actions" bigint[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "visibility" "public"."post_visibility" DEFAULT 'public'::"public"."post_visibility" NOT NULL,
    "group_id" bigint,
    CONSTRAINT "group_post_must_have_group_id" CHECK ((("visibility" <> 'group'::"public"."post_visibility") OR ("group_id" IS NOT NULL)))
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


ALTER TABLE "public"."posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."posts_with_media" WITH ("security_invoker"='true') AS
 SELECT "p"."id",
    "p"."user_id",
    "p"."content",
    "p"."emotion_id",
    "p"."available_actions",
    "p"."created_at",
    "p"."visibility",
    "p"."group_id",
    COALESCE("media_count"."count", (0)::bigint) AS "media_count"
   FROM ("public"."posts" "p"
     LEFT JOIN ( SELECT "media_attachments"."post_id",
            "count"(*) AS "count"
           FROM "public"."media_attachments"
          GROUP BY "media_attachments"."post_id") "media_count" ON (("p"."id" = "media_count"."post_id")));


ALTER VIEW "public"."posts_with_media" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bio" "text",
    "location" "text",
    "website" "text",
    "birth_date" "date",
    "follower_count" integer DEFAULT 0,
    "following_count" integer DEFAULT 0,
    "post_count" integer DEFAULT 0,
    "last_active" timestamp with time zone DEFAULT "now"(),
    "is_verified" boolean DEFAULT false,
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'Public profile information for each user.';



CREATE TABLE IF NOT EXISTS "public"."quick_action_options" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "emoji" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quick_action_options" OWNER TO "postgres";


ALTER TABLE "public"."quick_action_options" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quick_action_options_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" bigint NOT NULL,
    "reporter_id" "uuid" NOT NULL,
    "post_id" bigint,
    "comment_id" bigint,
    "reason" "text",
    "status" "public"."report_status" DEFAULT 'pending'::"public"."report_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "check_report_source" CHECK ((("post_id" IS NOT NULL) OR ("comment_id" IS NOT NULL)))
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


COMMENT ON TABLE "public"."reports" IS 'Content reports submitted by users for moderation.';



ALTER TABLE "public"."reports" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."revenuecat_webhooks" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "event_type" "text",
    "payload" "jsonb"
);


ALTER TABLE "public"."revenuecat_webhooks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."revenuecat_webhooks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."revenuecat_webhooks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."revenuecat_webhooks_id_seq" OWNED BY "public"."revenuecat_webhooks"."id";



CREATE OR REPLACE VIEW "public"."trending_hashtags" WITH ("security_invoker"='true') AS
 SELECT "id",
    "name",
    "usage_count",
    "trending_score",
    "created_at",
    "updated_at",
    ((("usage_count")::numeric * 0.7) + ((EXTRACT(epoch FROM ("now"() - "updated_at")) / (3600)::numeric) * 0.3)) AS "trending_score_calculated"
   FROM "public"."hashtags" "h"
  WHERE ("usage_count" > 0)
  ORDER BY ((("usage_count")::numeric * 0.7) + ((EXTRACT(epoch FROM ("now"() - "updated_at")) / (3600)::numeric) * 0.3)) DESC
 LIMIT 50;


ALTER VIEW "public"."trending_hashtags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_activities" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "activity_type" "text" NOT NULL,
    "target_type" "text",
    "target_id" bigint,
    "metadata" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_activities" OWNER TO "postgres";


ALTER TABLE "public"."user_activities" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_activities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "id" "uuid" NOT NULL,
    "theme" "text" DEFAULT 'default'::"text",
    "language" "text" DEFAULT 'en'::"text",
    "timezone" "text" DEFAULT 'UTC'::"text",
    "notifications" "jsonb" DEFAULT '{"push": true, "email": true, "inApp": true, "newComment": true, "newMention": true, "newFollower": true, "newReaction": true}'::"jsonb",
    "privacy" "jsonb" DEFAULT '{"allowMentions": "everyone", "allowMessages": "followers", "showOnlineStatus": true, "profileVisibility": "public"}'::"jsonb",
    "accessibility" "jsonb" DEFAULT '{"largeText": false, "highContrast": false, "reducedMotion": false}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "device_id" "text",
    "device_type" "text",
    "device_name" "text",
    "ip_address" "inet",
    "user_agent" "text",
    "last_active" timestamp with time zone DEFAULT "now"(),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."user_stats" WITH ("security_invoker"='true') AS
 SELECT "p"."id",
    "p"."username",
    "p"."follower_count",
    "p"."following_count",
    "p"."post_count",
    COALESCE("reaction_count"."count", (0)::bigint) AS "total_reactions_received"
   FROM ("public"."profiles" "p"
     LEFT JOIN ( SELECT "posts"."user_id",
            "count"("post_reactions"."id") AS "count"
           FROM ("public"."posts"
             LEFT JOIN "public"."post_reactions" ON (("posts"."id" = "post_reactions"."post_id")))
          GROUP BY "posts"."user_id") "reaction_count" ON (("p"."id" = "reaction_count"."user_id")));


ALTER VIEW "public"."user_stats" OWNER TO "postgres";


ALTER TABLE ONLY "public"."revenuecat_webhooks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."revenuecat_webhooks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."app_configuration"
    ADD CONSTRAINT "app_configuration_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."app_configuration"
    ADD CONSTRAINT "app_configuration_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_blocker_id_blocked_id_key" UNIQUE ("blocker_id", "blocked_id");



ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."emotions"
    ADD CONSTRAINT "emotions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."emotions"
    ADD CONSTRAINT "emotions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_follower_id_following_id_key" UNIQUE ("follower_id", "following_id");



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_user_id_key" UNIQUE ("group_id", "user_id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hashtags"
    ADD CONSTRAINT "hashtags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."hashtags"
    ADD CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media_attachments"
    ADD CONSTRAINT "media_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentions"
    ADD CONSTRAINT "mentions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moderation_queue"
    ADD CONSTRAINT "moderation_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plugin_data"
    ADD CONSTRAINT "plugin_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plugin_data"
    ADD CONSTRAINT "plugin_data_plugin_id_user_id_key_key" UNIQUE ("plugin_id", "user_id", "key");



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_post_id_hashtag_id_key" UNIQUE ("post_id", "hashtag_id");



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_post_id_user_id_key" UNIQUE ("post_id", "user_id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."quick_action_options"
    ADD CONSTRAINT "quick_action_options_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."quick_action_options"
    ADD CONSTRAINT "quick_action_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_id_comment_id_key" UNIQUE ("reporter_id", "comment_id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_id_post_id_key" UNIQUE ("reporter_id", "post_id");



ALTER TABLE ONLY "public"."revenuecat_webhooks"
    ADD CONSTRAINT "revenuecat_webhooks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_activities"
    ADD CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_app_config_key" ON "public"."app_configuration" USING "btree" ("key");



CREATE INDEX "idx_comments_parent_id" ON "public"."comments" USING "btree" ("parent_comment_id") WHERE ("parent_comment_id" IS NOT NULL);



CREATE INDEX "idx_comments_post_id" ON "public"."comments" USING "btree" ("post_id");



CREATE INDEX "idx_comments_user_id" ON "public"."comments" USING "btree" ("user_id");



CREATE INDEX "idx_followers_follower_id" ON "public"."followers" USING "btree" ("follower_id");



CREATE INDEX "idx_followers_following_id" ON "public"."followers" USING "btree" ("following_id");



CREATE INDEX "idx_hashtags_name" ON "public"."hashtags" USING "btree" ("name");



CREATE INDEX "idx_hashtags_trending_score" ON "public"."hashtags" USING "btree" ("trending_score" DESC);



CREATE INDEX "idx_media_attachments_post_id" ON "public"."media_attachments" USING "btree" ("post_id");



CREATE INDEX "idx_media_attachments_type" ON "public"."media_attachments" USING "btree" ("type");



CREATE INDEX "idx_moderation_queue_content" ON "public"."moderation_queue" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_moderation_queue_status" ON "public"."moderation_queue" USING "btree" ("status");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_notifications_read" ON "public"."notifications" USING "btree" ("read");



CREATE INDEX "idx_notifications_recipient_id" ON "public"."notifications" USING "btree" ("recipient_id");



CREATE INDEX "idx_plugin_data_plugin_user" ON "public"."plugin_data" USING "btree" ("plugin_id", "user_id");



CREATE INDEX "idx_post_hashtags_hashtag_id" ON "public"."post_hashtags" USING "btree" ("hashtag_id");



CREATE INDEX "idx_post_hashtags_post_id" ON "public"."post_hashtags" USING "btree" ("post_id");



CREATE INDEX "idx_posts_created_at" ON "public"."posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_posts_group_id" ON "public"."posts" USING "btree" ("group_id") WHERE ("group_id" IS NOT NULL);



CREATE INDEX "idx_posts_user_id" ON "public"."posts" USING "btree" ("user_id");



CREATE INDEX "idx_posts_visibility" ON "public"."posts" USING "btree" ("visibility");



CREATE INDEX "idx_user_activities_created_at" ON "public"."user_activities" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_user_activities_type" ON "public"."user_activities" USING "btree" ("activity_type");



CREATE INDEX "idx_user_activities_user_id" ON "public"."user_activities" USING "btree" ("user_id");



CREATE INDEX "idx_user_sessions_active" ON "public"."user_sessions" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_user_sessions_user_id" ON "public"."user_sessions" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "on_follow_change" AFTER INSERT OR DELETE ON "public"."followers" FOR EACH ROW EXECUTE FUNCTION "public"."update_follower_counts"();



CREATE OR REPLACE TRIGGER "on_hashtag_usage_change" AFTER INSERT OR DELETE ON "public"."post_hashtags" FOR EACH ROW EXECUTE FUNCTION "public"."update_hashtag_counts"();



CREATE OR REPLACE TRIGGER "on_new_comment" AFTER INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."create_notification_on_event"();



CREATE OR REPLACE TRIGGER "on_new_follower" AFTER INSERT ON "public"."followers" FOR EACH ROW EXECUTE FUNCTION "public"."create_notification_on_event"();



CREATE OR REPLACE TRIGGER "on_new_mention" AFTER INSERT ON "public"."mentions" FOR EACH ROW EXECUTE FUNCTION "public"."create_notification_on_event"();



CREATE OR REPLACE TRIGGER "on_new_reaction" AFTER INSERT ON "public"."post_reactions" FOR EACH ROW EXECUTE FUNCTION "public"."create_notification_on_event"();



CREATE OR REPLACE TRIGGER "on_post_change" AFTER INSERT OR DELETE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_post_counts"();



CREATE OR REPLACE TRIGGER "on_preferences_update" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_preferences_timestamp"();



CREATE OR REPLACE TRIGGER "on_user_activity" AFTER INSERT ON "public"."user_activities" FOR EACH ROW EXECUTE FUNCTION "public"."update_last_active"();



CREATE OR REPLACE TRIGGER "on_webhook_received" AFTER INSERT ON "public"."revenuecat_webhooks" FOR EACH ROW EXECUTE FUNCTION "public"."update_premium_status"();



ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media_attachments"
    ADD CONSTRAINT "media_attachments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentions"
    ADD CONSTRAINT "mentions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentions"
    ADD CONSTRAINT "mentions_mentioned_user_id_fkey" FOREIGN KEY ("mentioned_user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentions"
    ADD CONSTRAINT "mentions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moderation_queue"
    ADD CONSTRAINT "moderation_queue_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."plugin_data"
    ADD CONSTRAINT "plugin_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "public"."quick_action_options"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "public"."emotions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_activities"
    ADD CONSTRAINT "user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage all configuration" ON "public"."app_configuration" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."username" = 'admin'::"text")))));



CREATE POLICY "Allow access to authenticated users" ON "public"."revenuecat_webhooks" TO "authenticated" USING (true);



CREATE POLICY "Allow read access to authenticated users" ON "public"."emotions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow read access to authenticated users" ON "public"."quick_action_options" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can create hashtags" ON "public"."hashtags" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can see public groups and private groups th" ON "public"."groups" FOR SELECT TO "authenticated" USING ((("is_private" = false) OR (EXISTS ( SELECT 1
   FROM "public"."group_members"
  WHERE (("group_members"."group_id" = "groups"."id") AND ("group_members"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Authenticated users can view all comments." ON "public"."comments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all follow relationships." ON "public"."followers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all mentions." ON "public"."mentions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all reactions." ON "public"."post_reactions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can read hashtags" ON "public"."hashtags" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can read post hashtags" ON "public"."post_hashtags" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can read public configuration" ON "public"."app_configuration" FOR SELECT TO "authenticated" USING (("is_public" = true));



CREATE POLICY "Group admins can add new members." ON "public"."group_members" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."group_members" "group_members_1"
  WHERE (("group_members_1"."group_id" = "group_members_1"."group_id") AND ("group_members_1"."user_id" = "auth"."uid"()) AND ("group_members_1"."role" = 'admin'::"public"."group_role")))));



CREATE POLICY "Group admins can manage members." ON "public"."group_members" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."group_members" "group_members_1"
  WHERE (("group_members_1"."group_id" = "group_members_1"."group_id") AND ("group_members_1"."user_id" = "auth"."uid"()) AND ("group_members_1"."role" = 'admin'::"public"."group_role")))));



CREATE POLICY "Group owners can delete their own groups." ON "public"."groups" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Group owners can update their own groups." ON "public"."groups" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Moderators can view moderation queue" ON "public"."moderation_queue" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."username" = ANY (ARRAY['admin'::"text", 'moderator'::"text"]))))));



CREATE POLICY "Public profiles are viewable by authenticated users." ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Reports are not publicly visible." ON "public"."reports" FOR SELECT TO "authenticated" USING (false);



CREATE POLICY "Reports cannot be changed by users." ON "public"."reports" FOR UPDATE TO "authenticated" USING (false);



CREATE POLICY "Reports cannot be deleted by users." ON "public"."reports" FOR DELETE TO "authenticated" USING (false);



CREATE POLICY "System can insert user activities" ON "public"."user_activities" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "System can manage user sessions" ON "public"."user_sessions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can block other users." ON "public"."blocks" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "blocker_id"));



CREATE POLICY "Users can create groups." ON "public"."groups" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can create reports." ON "public"."reports" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "reporter_id"));



CREATE POLICY "Users can create their own comments." ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own follow relationships." ON "public"."followers" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "follower_id"));



CREATE POLICY "Users can create their own posts." ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own reactions." ON "public"."post_reactions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own blocks." ON "public"."blocks" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "blocker_id"));



CREATE POLICY "Users can delete their own comments." ON "public"."comments" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own follow relationships." ON "public"."followers" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "follower_id"));



CREATE POLICY "Users can delete their own notifications." ON "public"."notifications" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "recipient_id"));



CREATE POLICY "Users can delete their own posts." ON "public"."posts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own reactions." ON "public"."post_reactions" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can leave groups, and admins can remove members." ON "public"."group_members" FOR DELETE TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."group_members" "group_members_1"
  WHERE (("group_members_1"."group_id" = "group_members_1"."group_id") AND ("group_members_1"."user_id" = "auth"."uid"()) AND ("group_members_1"."role" = 'admin'::"public"."group_role"))))));



CREATE POLICY "Users can manage hashtags for their posts" ON "public"."post_hashtags" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_hashtags"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage their own plugin data" ON "public"."plugin_data" TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own post media" ON "public"."media_attachments" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "media_attachments"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage their own preferences" ON "public"."user_preferences" TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update the 'read' status of their own notifications." ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "recipient_id"));



CREATE POLICY "Users can update their own comments." ON "public"."comments" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own posts." ON "public"."posts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own reactions." ON "public"."post_reactions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own sessions" ON "public"."user_sessions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view media for posts they can see" ON "public"."media_attachments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "media_attachments"."post_id") AND (("posts"."visibility" = 'public'::"public"."post_visibility") OR ("posts"."user_id" = "auth"."uid"()) OR (("posts"."visibility" = 'group'::"public"."post_visibility") AND "public"."is_group_member"("posts"."group_id", "auth"."uid"())))))));



CREATE POLICY "Users can view memberships of groups they belong to." ON "public"."group_members" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."group_members" "group_members_1"
  WHERE (("group_members_1"."group_id" = "group_members_1"."group_id") AND ("group_members_1"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view posts based on visibility, group membership, and" ON "public"."posts" FOR SELECT TO "authenticated" USING (((NOT "public"."is_blocked"("auth"."uid"(), "user_id")) AND (("visibility" = 'public'::"public"."post_visibility") OR (("visibility" = 'private'::"public"."post_visibility") AND ("user_id" = "auth"."uid"())) OR (("visibility" = 'group'::"public"."post_visibility") AND "public"."is_group_member"("group_id", "auth"."uid"())))));



CREATE POLICY "Users can view their own activities" ON "public"."user_activities" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own blocks." ON "public"."blocks" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "blocker_id"));



CREATE POLICY "Users can view their own notifications." ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "recipient_id"));



CREATE POLICY "Users can view their own sessions" ON "public"."user_sessions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."app_configuration" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blocks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."emotions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."followers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hashtags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media_attachments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mentions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."moderation_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plugin_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_hashtags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_reactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quick_action_options" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."revenuecat_webhooks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sessions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."cleanup_old_sessions"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_sessions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_sessions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_notification_on_event"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_notification_on_event"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_notification_on_event"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_blocked"("p_user_id_1" "uuid", "p_user_id_2" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_blocked"("p_user_id_1" "uuid", "p_user_id_2" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_blocked"("p_user_id_1" "uuid", "p_user_id_2" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_group_member"("p_group_id" bigint, "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_group_member"("p_group_id" bigint, "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_group_member"("p_group_id" bigint, "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_follower_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_follower_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_follower_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_hashtag_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_hashtag_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_hashtag_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_last_active"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_last_active"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_last_active"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_post_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_post_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_post_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_preferences_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_preferences_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_preferences_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_premium_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_premium_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_premium_status"() TO "service_role";


















GRANT ALL ON TABLE "public"."app_configuration" TO "anon";
GRANT ALL ON TABLE "public"."app_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."app_configuration" TO "service_role";



GRANT ALL ON SEQUENCE "public"."app_configuration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."app_configuration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."app_configuration_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."blocks" TO "anon";
GRANT ALL ON TABLE "public"."blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."blocks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."blocks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."blocks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."blocks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."emotions" TO "anon";
GRANT ALL ON TABLE "public"."emotions" TO "authenticated";
GRANT ALL ON TABLE "public"."emotions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."emotions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."emotions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."emotions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."followers" TO "anon";
GRANT ALL ON TABLE "public"."followers" TO "authenticated";
GRANT ALL ON TABLE "public"."followers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON SEQUENCE "public"."group_members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."group_members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."group_members_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hashtags" TO "anon";
GRANT ALL ON TABLE "public"."hashtags" TO "authenticated";
GRANT ALL ON TABLE "public"."hashtags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hashtags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hashtags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hashtags_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."media_attachments" TO "anon";
GRANT ALL ON TABLE "public"."media_attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."media_attachments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."media_attachments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."media_attachments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."media_attachments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mentions" TO "anon";
GRANT ALL ON TABLE "public"."mentions" TO "authenticated";
GRANT ALL ON TABLE "public"."mentions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mentions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mentions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mentions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."moderation_queue" TO "anon";
GRANT ALL ON TABLE "public"."moderation_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."moderation_queue" TO "service_role";



GRANT ALL ON SEQUENCE "public"."moderation_queue_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."moderation_queue_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."moderation_queue_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."plugin_data" TO "anon";
GRANT ALL ON TABLE "public"."plugin_data" TO "authenticated";
GRANT ALL ON TABLE "public"."plugin_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."plugin_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."plugin_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."plugin_data_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."post_hashtags" TO "anon";
GRANT ALL ON TABLE "public"."post_hashtags" TO "authenticated";
GRANT ALL ON TABLE "public"."post_hashtags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."post_hashtags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."post_hashtags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."post_hashtags_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."post_reactions" TO "anon";
GRANT ALL ON TABLE "public"."post_reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."post_reactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."post_reactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."post_reactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."post_reactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."posts_with_media" TO "anon";
GRANT ALL ON TABLE "public"."posts_with_media" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_with_media" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quick_action_options" TO "anon";
GRANT ALL ON TABLE "public"."quick_action_options" TO "authenticated";
GRANT ALL ON TABLE "public"."quick_action_options" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quick_action_options_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quick_action_options_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quick_action_options_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."revenuecat_webhooks" TO "anon";
GRANT ALL ON TABLE "public"."revenuecat_webhooks" TO "authenticated";
GRANT ALL ON TABLE "public"."revenuecat_webhooks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."revenuecat_webhooks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."revenuecat_webhooks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."revenuecat_webhooks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trending_hashtags" TO "anon";
GRANT ALL ON TABLE "public"."trending_hashtags" TO "authenticated";
GRANT ALL ON TABLE "public"."trending_hashtags" TO "service_role";



GRANT ALL ON TABLE "public"."user_activities" TO "anon";
GRANT ALL ON TABLE "public"."user_activities" TO "authenticated";
GRANT ALL ON TABLE "public"."user_activities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_activities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_activities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_activities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."user_stats" TO "anon";
GRANT ALL ON TABLE "public"."user_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."user_stats" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
