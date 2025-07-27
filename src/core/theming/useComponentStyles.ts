import { useTheme } from "./ThemeProvider";
import { styleRegistry } from "./StyleRegistry";

export const useComponentStyles = <T = any>(
    componentName: string,
    styleFunction: (theme: any, props?: T) => any,
    props?: T,
) => {
    const { theme } = useTheme();
    const baseStyles = styleFunction(theme, props || {} as T);

    const mergedStyles: any = {};

    Object.keys(baseStyles).forEach((styleName) => {
        mergedStyles[styleName] = styleRegistry.mergeStyles(
            componentName,
            styleName,
            baseStyles[styleName],
        );
    });

    return mergedStyles;
};
