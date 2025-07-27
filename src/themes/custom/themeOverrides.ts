import { styleRegistry } from "@/core/theming/StyleRegistry";

export const applyCustomFeedStyles = () => {
    styleRegistry.setOverride("FeedLayout", "container", {
        paddingTop: 20,
    });

    styleRegistry.setOverride("FeedHeader", "tab", {
        borderRadius: 8,
        paddingHorizontal: 20,
    });

    styleRegistry.setOverride("AppNavigator", "tabBar", {
        backgroundColor: "#000000",
        height: 90,
    });
};
