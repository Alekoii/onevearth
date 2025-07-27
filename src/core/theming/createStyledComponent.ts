import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Theme } from "./types";

type StyleFunction<T = any> = (
    theme: Theme,
    props: T,
) => Record<string, ViewStyle | TextStyle>;

export const createStyles = <T = any>(styleFunction: StyleFunction<T>) => {
    return (theme: Theme, props?: T) =>
        StyleSheet.create(styleFunction(theme, props || {} as T));
};
