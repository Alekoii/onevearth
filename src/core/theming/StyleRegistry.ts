interface StyleOverrides {
    [componentName: string]: {
        [styleName: string]: any;
    };
}

class StyleRegistry {
    private overrides: StyleOverrides = {};

    setOverride(componentName: string, styleName: string, styles: any) {
        if (!this.overrides[componentName]) {
            this.overrides[componentName] = {};
        }
        this.overrides[componentName][styleName] = styles;
    }

    getOverride(componentName: string, styleName: string) {
        return this.overrides[componentName]?.[styleName];
    }

    mergeStyles(componentName: string, styleName: string, baseStyles: any) {
        const override = this.getOverride(componentName, styleName);
        return override ? { ...baseStyles, ...override } : baseStyles;
    }
}

export const styleRegistry = new StyleRegistry();
