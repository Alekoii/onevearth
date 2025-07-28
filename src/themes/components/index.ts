import { ComponentStyles, Theme } from "@/core/theming/types";
import { createLayoutStyles } from "./layout";
import { createFormStyles } from "./forms";
import { createNavigationStyles } from "./navigation";
import { createContentStyles } from "./content";

export const createComponentStyles = (theme: Theme): ComponentStyles => ({
    // Layout components
    ...createLayoutStyles(theme),

    // Form components
    ...createFormStyles(theme),

    // Navigation components
    ...createNavigationStyles(theme),

    // Content components
    ...createContentStyles(theme),
});

export * from "./layout";
export * from "./forms";
export * from "./navigation";
export * from "./content";
