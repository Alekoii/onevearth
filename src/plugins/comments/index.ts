import { EnhancedPlugin } from "@/core/plugins/PluginManager";
import { CommentService } from "./services/CommentService";
import commentsReducer from "./store/commentsSlice";
import { CommentItem } from "./components/CommentItem";
import { CommentList } from "./components/CommentList";
import { CommentCreator } from "./components/CommentCreator";
import { StickyCommentCreator } from "./components/StickyCommentCreator";
import { CommentActionButton } from "./components/CommentActionButton";

export const CommentsPlugin: EnhancedPlugin = {
    id: "comments",
    name: "Comments",
    version: "1.0.0",
    description:
        "Comprehensive commenting system with threaded replies, reactions, and moderation",
    author: "OneVEarth Team",

    dependencies: [],
    peerDependencies: ["posts"],
    conflicts: [],

    components: {
        CommentItem: CommentItem,
        CommentList: CommentList,
        CommentCreator: CommentCreator,
        StickyCommentCreator: StickyCommentCreator,
        CommentActionButton: CommentActionButton,
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
            maxLength: { type: "number", minimum: 1, maximum: 2000 },
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
        api.registerComponent("StickyCommentCreator", StickyCommentCreator);
        api.registerComponent("CommentActionButton", CommentActionButton);

        console.log("Comments plugin installed successfully");
    },

    async activate(api) {
        console.log("Activating Comments plugin...");

        // Register at the main extension point for post details - this shows the comments list
        api.registerExtension("post.detail.comments", CommentList, 100);

        // ✅ NEW: Register at the sticky footer extension point - this shows the comment creator
        api.registerExtension(
            "post.detail.comment-creator",
            StickyCommentCreator,
            100,
        );

        // Add comment button to post actions (for post cards)
        api.registerExtension("post.actions", CommentActionButton, 80);

        // Subscribe to relevant events
        api.subscribeToEvent("user:login", (userData: { id: string }) => {
            console.log("Comments plugin: User logged in", userData.id);
            // Could initialize user-specific comment settings here
        });

        api.subscribeToEvent("user:logout", () => {
            console.log(
                "Comments plugin: User logged out, clearing comment cache",
            );
            // Could clear sensitive comment data here
        });

        api.subscribeToEvent("post:created", (postData: { postId: number }) => {
            console.log(
                "Comments plugin: New post created, preparing comment system",
                postData.postId,
            );
            // Could pre-initialize comment state for new posts
        });

        api.subscribeToEvent("comment:created", (commentData: any) => {
            console.log("Comments plugin: New comment created", commentData);
            // Could trigger notifications or other side effects
        });

        console.log("Comments plugin activated successfully");
    },

    async deactivate(api) {
        console.log("Deactivating Comments plugin...");
        // Cleanup logic here
    },

    async uninstall(api) {
        console.log("Uninstalling Comments plugin...");
        // Cleanup logic here
    },
};
