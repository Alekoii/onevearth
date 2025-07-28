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

    // Dependencies - requires users/auth system
    dependencies: [],
    peerDependencies: [],
    conflicts: [],

    // UI Components
    components: {
        PostCard: PostCard,
        PostList: PostList,
        PostCreator: PostCreator,
    },

    // State Management
    reducers: {
        posts: postsReducer,
    },

    // Services
    services: {
        PostService: PostService,
    },

    // Configuration schema
    configSchema: {
        type: "object",
        properties: {
            maxLength: { type: "number", minimum: 1, maximum: 10000 },
            allowMedia: { type: "boolean" },
            allowEditing: { type: "boolean" },
            editTimeLimit: { type: "number", minimum: 1 },
            requireModeration: { type: "boolean" },
        },
    },

    defaultConfig: {
        maxLength: 280,
        allowMedia: true,
        allowEditing: true,
        editTimeLimit: 15,
        requireModeration: false,
    },

    // Plugin lifecycle methods
    async install(api) {
        console.log("Installing Posts plugin...");

        // Register services
        api.registerService("PostService", PostService);

        // Register Redux state management
        api.registerReducer("posts", postsReducer);

        // Register UI components
        api.registerComponent("PostCard", PostCard);
        api.registerComponent("PostList", PostList);
        api.registerComponent("PostCreator", PostCreator);

        console.log("Posts plugin installed successfully");
    },

    async activate(api) {
        console.log("Activating Posts plugin...");

        // Register extension points for UI integration
        api.registerExtension("home.content", PostList, 100);
        api.registerExtension("create.content", PostCreator, 100);

        // Subscribe to relevant events
        api.subscribeToEvent(
            "user:login",
            (userData: { id: string; email?: string }) => {
                console.log("Posts plugin: User logged in", userData.id);
                // Could trigger post refresh here
            },
        );

        api.subscribeToEvent("user:logout", () => {
            console.log("Posts plugin: User logged out, clearing posts");
            // Could clear user-specific posts here
        });

        // Emit plugin ready event
        api.emitEvent("posts:ready", {
            pluginId: "posts",
            timestamp: Date.now(),
        });

        console.log("Posts plugin activated successfully");
    },

    async deactivate(api) {
        console.log("Deactivating Posts plugin...");

        // Plugin cleanup would happen here if needed
        api.emitEvent("posts:deactivated", {
            pluginId: "posts",
            timestamp: Date.now(),
        });

        console.log("Posts plugin deactivated");
    },

    async uninstall(api) {
        console.log("Uninstalling Posts plugin...");

        // Final cleanup would happen here
        console.log("Posts plugin uninstalled");
    },
};
