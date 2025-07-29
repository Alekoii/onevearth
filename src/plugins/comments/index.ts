import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { EnhancedPlugin } from "@/core/plugins/PluginManager";
import { Icon } from "@/components/ui/Icon";
import { CommentService } from "./services/CommentService";
import commentsReducer from "./store/commentsSlice";
import { CommentItem } from "./components/CommentItem";
import { CommentList } from "./components/CommentList";
import { CommentCreator } from "./components/CommentCreator";
import { clearCommentsForPost } from "./store/commentsSlice";

export const CommentsPlugin: EnhancedPlugin = {
    id: "comments",
    name: "Comments",
    version: "1.0.0",
    description: "Comprehensive commenting system with nested replies and moderation",
    author: "OneVEarth Team",

    dependencies: [],
    peerDependencies: ["posts"], // Comments work well with posts
    conflicts: [],

    components: {
        CommentItem: CommentItem,
        CommentList: CommentList,
        CommentCreator: CommentCreator,
    },

    reducers: {
        comments: commentsReducer,
    },

    services: {
        CommentService: CommentService,
    },

    configSchema: {
        type: "object",
        properties: {
            allowNested: { type: "boolean" },
            maxDepth: { type: "number", minimum: 1, maximum: 10 },
            requireApproval: { type: "boolean" },
            allowEditing: { type: "boolean" },
            allowReactions: { type: "boolean" },
            autoRefresh: { type: "boolean" },
            maxLength: { type: "number", minimum: 1, maximum: 1000 },
            enableMentions: { type: "boolean" },
            showTimestamps: { type: "boolean" },
            collapseLongThreads: { type: "boolean" },
        },
    },

    defaultConfig: {
        allowNested: true,
        maxDepth: 3,
        requireApproval: false,
        allowEditing: true,
        allowReactions: true,
        autoRefresh: false,
        maxLength: 500,
        enableMentions: false,
        showTimestamps: true,
        collapseLongThreads: true,
    },

    async install(api) {
        console.log("Installing Comments plugin...");

        // Register services
        api.registerService("CommentService", CommentService);

        // Register Redux reducer
        api.registerReducer("comments", commentsReducer);

        // Register React components
        api.registerComponent("CommentItem", CommentItem);
        api.registerComponent("CommentList", CommentList);
        api.registerComponent("CommentCreator", CommentCreator);

        console.log("Comments plugin installed successfully");
    },

    async activate(api) {
        console.log("Activating Comments plugin...");

        // Register at the main extension point for post details
        api.registerExtension("post.detail.comments", CommentList, 100);

        // Add comment button to post actions
        api.registerExtension("post.actions", CommentActionButton, 80);

        // Register comment creator in post detail if needed
        api.registerExtension("post.detail.actions", CommentCreator, 50);

        // Subscribe to relevant events
        api.subscribeToEvent("user:login", (userData: { id: string }) => {
            console.log("Comments plugin: User logged in", userData.id);
            // Could initialize user-specific comment settings here
        });

        api.subscribeToEvent("user:logout", () => {
            console.log("Comments plugin: User logged out, clearing comment cache");
            // Could clear sensitive comment data here
        });

        api.subscribeToEvent("post:created", (data: { postId: number }) => {
            console.log("Comments plugin: New post created", data.postId);
            // Could initialize comment tracking for new posts
        });

        api.subscribeToEvent("post:deleted", (data: { postId: number }) => {
            console.log("Comments plugin: Post deleted, cleaning up comments", data.postId);
            // Clean up comments for deleted posts
            const store = api.getStore();
            store.dispatch(clearCommentsForPost(data.postId));
        });

        // Emit plugin ready event
        api.emitEvent("comments:ready", {
            pluginId: "comments",
            timestamp: Date.now(),
            features: {
                nestedComments: true,
                realTimeUpdates: false,
                moderation: false,
            },
        });

        console.log("Comments plugin activated successfully");
    },

    async deactivate(api) {
        console.log("Deactivating Comments plugin...");

        // Emit deactivation event
        api.emitEvent("comments:deactivated", {
            pluginId: "comments",
            timestamp: Date.now(),
        });

        console.log("Comments plugin deactivated");
    },

    async uninstall(api) {
        console.log("Uninstalling Comments plugin...");

        // Clean up any persistent data if needed
        // Note: Redux state will be cleaned up automatically by the plugin manager

        console.log("Comments plugin uninstalled");
    },
};

// Simple comment action button component for post cards
const CommentActionButton: React.FC<{ post: any }> = ({ post }) => {
    const handleCommentPress = () => {
        console.log("Navigate to comments for post:", post.id);
        // This would typically navigate to the post detail screen
        // or open a comments modal
    };

    return (
        <TouchableOpacity 
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 24,
            }}
            onPress={handleCommentPress}
        >
            <Icon name="comment" size={20} color="#6D6D6D" />
            <Text style={{
                fontSize: 14,
                color: "#6D6D6D",
                marginLeft: 4,
                fontWeight: "500",
            }}>
                {post._count?.comments || 0}
            </Text>
        </TouchableOpacity>
    );
};

// Re-export types and components for external use
export * from "./types";
export * from "./components/CommentItem";
export * from "./components/CommentList";
export * from "./components/CommentCreator";
export * from "./hooks/useComments";
export * from "./services/CommentService";