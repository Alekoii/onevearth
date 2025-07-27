import { styleRegistry } from "@/core/theming/StyleRegistry";

export const applyCustomPostStyles = () => {
    styleRegistry.setOverride("PostCard", "container", {
        backgroundColor: "#f5f5f5",
        borderRadius: 16,
    });

    styleRegistry.setOverride("PostCard", "actions", {
        justifyContent: "flex-start",
        gap: 16,
    });

    styleRegistry.setOverride("PostCreator", "input", {
        backgroundColor: "#fafafa",
        borderStyle: "dashed",
    });
};
