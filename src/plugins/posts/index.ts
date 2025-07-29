import { EnhancedPlugin } from "@/core/plugins/PluginManager";
import { PostService } from "./services/PostService";
import postsReducer from "./store/postsSlice";
import { PostCard } from "./components/PostCard";
import { PostList } from "./components/PostList";
import { PostCreator } from "./components/PostCreator";

export const PostsPlugin: EnhancedPlugin = {
    id: "posts",
    name: "Posts",
    version: "1.0.0",
    description:
        "Core posting functionality with create, read, and display features",
    author: "OneVEarth Team",

    dependencies: [],
    peerDependencies: [],
    conflicts: [],

    components: {
        PostCard: PostCard,
        PostList: PostList,
        PostCreator: PostCreator,
    },

    reducers: {
        posts: postsReducer,
    },

    services: {
        PostService: PostService,
    },

    configSchema: {
        type: "object",
        properties: {
            maxLength: { type: "number", minimum: 1, maximum: 10000 },
            allowMedia: { type: "boolean" },
            allowEditing: { type: "boolean" },
            editTimeLimit: { type: "number", minimum: 1 },
            requireModeration: { type: "boolean" },
            showTimestamps: { type: "boolean" },
            allowHashtags: { type: "boolean" },
            enableRealTimeUpdates: { type: "boolean" },
            maxLines: { type: "number", minimum: 0, maximum: 20 },
        },
    },

    defaultConfig: {
        maxLength: 5000, // ✅ Updated to 5000 to match app config
        allowMedia: true,
        allowEditing: true,
        editTimeLimit: 15,
        requireModeration: false,
        showTimestamps: true,
        allowHashtags: true,
        enableRealTimeUpdates: false,
        maxLines: 4,
    },

    async install(api) {
        console.log("Installing Posts plugin...");

        api.registerService("PostService", PostService);
        api.registerReducer("posts", postsReducer);
        api.registerComponent("PostCard", PostCard);
        api.registerComponent("PostList", PostList);
        api.registerComponent("PostCreator", PostCreator);

        console.log("Posts plugin installed successfully");
    },

    async activate(api) {
        console.log("Activating Posts plugin...");

        api.registerExtension("home.content", PostList, 100);
        api.registerExtension("create.content", PostCreator, 100);

        api.subscribeToEvent(
            "user:login",
            (userData: { id: string; email?: string }) => {
                console.log("Posts plugin: User logged in", userData.id);
                // Could initialize user-specific post settings here
            },
        );

        api.subscribeToEvent("user:logout", () => {
            console.log("Posts plugin: User logged out, clearing post cache");
            // Could clear sensitive post data here
        });

        console.log("Posts plugin activated successfully");
    },

    async deactivate(api) {
        console.log("Deactivating Posts plugin...");
        // Cleanup logic here
    },

    async uninstall(api) {
        console.log("Uninstalling Posts plugin...");
        // Cleanup logic here
    },
};
