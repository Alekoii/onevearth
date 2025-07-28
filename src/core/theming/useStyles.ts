import { useTheme } from "./ThemeProvider";
import { styleRegistry } from "./StyleRegistry";
import { createComponentStyles } from "@/themes/components";

export const useStyles = (componentName: string, props?: any) => {
    const { theme } = useTheme();
    const allStyles = createComponentStyles(theme) as Record<string, any>;
    const componentStyles = allStyles[componentName];

    if (!componentStyles) return {};

    if (componentName === "PostList" || componentName === "PostCreator") {
        return componentStyles;
    }

    const result: any = {};

    Object.keys(componentStyles).forEach((key) => {
        if (key === "base") {
            result.container = { ...componentStyles.base };

            if (props?.variant && componentStyles.variants?.[props.variant]) {
                Object.assign(
                    result.container,
                    componentStyles.variants[props.variant],
                );
            }

            if (props?.size && componentStyles.sizes?.[props.size]) {
                Object.assign(
                    result.container,
                    componentStyles.sizes[props.size],
                );
            }

            if (props?.padding && componentStyles.padding?.[props.padding]) {
                Object.assign(
                    result.container,
                    componentStyles.padding[props.padding],
                );
            }

            if (props?.hasError && componentStyles.states?.error) {
                Object.assign(result.container, componentStyles.states.error);
            }

            if (props?.disabled && componentStyles.states?.disabled) {
                Object.assign(
                    result.container,
                    componentStyles.states.disabled,
                );
            }

            result.container = styleRegistry.mergeStyles(
                componentName,
                "container",
                result.container,
            );
        } else if (key === "text") {
            const textVariant = props?.variant || "primary";
            result.text = componentStyles.text[textVariant] ||
                componentStyles.text;
        } else if (!["variants", "sizes", "states", "padding"].includes(key)) {
            result[key] = componentStyles[key];
        }
    });

    if (componentName === "Input") {
        result.input = result.container;
    } else if (componentName === "Button") {
        result.button = result.container;
    } else if (componentName === "Card") {
        result.card = result.container;
    }

    return result;
};
