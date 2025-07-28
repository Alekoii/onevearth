import { createElement, forwardRef } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTheme } from "./ThemeProvider";
import { useConfig } from "@/core/config/ConfigProvider";

type StyleFunction<T = any> = (
    theme: any,
    props: T,
) => StyleProp<ViewStyle | TextStyle>;

export const useStyled = <T extends object>(
    Component: React.ComponentType<any>,
    styleFunction: StyleFunction<T>,
) => {
    return forwardRef<any, T>((props, ref) => {
        const { theme } = useTheme();
        const { config } = useConfig();

        const styles = styleFunction(theme, props as T);

        const accessibilityStyles =
            config.ui.accessibility.largeText && styles &&
                typeof styles === "object"
                ? { ...styles, fontSize: (styles as any).fontSize * 1.2 }
                : styles;

        return createElement(Component, {
            ...(props as any),
            ref,
            style: [accessibilityStyles, (props as any).style],
        });
    });
};
