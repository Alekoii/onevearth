import { Plugin } from "@/core/plugins/types";
import { PostCreator } from "./components/PostCreator";
import { PostList } from "./components/PostList";
import { PostCard } from "./components/PostCard";

export const PostsPlugin: Plugin = {
    id: "posts",
    name: "Posts",
    version: "1.0.0",
    description: "Core posting functionality",
    author: "Social Network Team",

    components: {
        PostCreator,
        PostList,
        PostCard,
    },

    async install(api) {
        api.registerExtension("home.content", PostList);
        api.registerExtension("home.creator", PostCreator);

        api.subscribeToEvent("post:created", (data) => {
            console.log("New post created:", data);
        });
    },

    async uninstall(api) {
        api.unregisterExtension("home.content", "PostList");
        api.unregisterExtension("home.creator", "PostCreator");
    },
};
