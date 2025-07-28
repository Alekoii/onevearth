import { Fragment, useMemo } from "react";
import { useEnhancedPlugins } from "./PluginProvider";

interface ExtensionPointProps {
    name: string;
    fallback?: React.ComponentType<any>;
    maxExtensions?: number;
    filterBy?: {
        pluginId?: string;
        tags?: string[];
        minPriority?: number;
    };
    [key: string]: any;
}

interface ExtensionWrapperProps {
    extension: any;
    props: any;
    onError?: (error: Error, extensionId: string) => void;
}

const ExtensionWrapper = (
    { extension, props, onError }: ExtensionWrapperProps,
) => {
    try {
        const Component = extension.component;
        return <Component key={extension.id} {...props} />;
    } catch (error) {
        console.error(`Extension ${extension.id} failed to render:`, error);
        onError?.(error as Error, extension.id);
        return null;
    }
};

export const ExtensionPoint = ({
    name,
    fallback: Fallback,
    maxExtensions,
    filterBy,
    ...props
}: ExtensionPointProps) => {
    const { getExtensions } = useEnhancedPlugins();

    const extensions = useMemo(() => {
        let availableExtensions = getExtensions(name);

        if (filterBy) {
            availableExtensions = availableExtensions.filter((ext) => {
                if (filterBy.pluginId && ext.pluginId !== filterBy.pluginId) {
                    return false;
                }

                if (
                    filterBy.minPriority && ext.priority < filterBy.minPriority
                ) {
                    return false;
                }

                if (filterBy.tags?.length) {
                    const extTags = ext.metadata?.tags || [];
                    const hasMatchingTag = filterBy.tags.some((tag) =>
                        extTags.includes(tag)
                    );
                    if (!hasMatchingTag) return false;
                }

                return true;
            });
        }

        if (maxExtensions && maxExtensions > 0) {
            availableExtensions = availableExtensions.slice(0, maxExtensions);
        }

        return availableExtensions;
    }, [name, getExtensions, filterBy, maxExtensions]);

    const handleExtensionError = (error: Error, extensionId: string) => {
        console.error(
            `Extension point "${name}" - Extension "${extensionId}" error:`,
            error,
        );
    };

    if (extensions.length === 0) {
        return Fallback ? <Fallback {...props} /> : null;
    }

    return (
        <Fragment>
            {extensions.map((extension) => (
                <ExtensionWrapper
                    key={extension.id}
                    extension={extension}
                    props={props}
                    onError={handleExtensionError}
                />
            ))}
        </Fragment>
    );
};

export const useExtensions = (name: string) => {
    const { getExtensions } = useEnhancedPlugins();
    return useMemo(() => getExtensions(name), [name, getExtensions]);
};

export const useExtensionCount = (name: string) => {
    const extensions = useExtensions(name);
    return extensions.length;
};

export const useHasExtensions = (name: string) => {
    const count = useExtensionCount(name);
    return count > 0;
};

interface ConditionalExtensionPointProps extends ExtensionPointProps {
    condition: boolean;
    fallbackWhenHidden?: React.ComponentType<any>;
}

export const ConditionalExtensionPoint = ({
    condition,
    fallbackWhenHidden: FallbackWhenHidden,
    ...props
}: ConditionalExtensionPointProps) => {
    if (!condition) {
        return FallbackWhenHidden ? <FallbackWhenHidden {...props} /> : null;
    }

    return <ExtensionPoint {...props} />;
};

interface MultiExtensionPointProps {
    points: Array<{
        name: string;
        props?: Record<string, any>;
        condition?: boolean;
    }>;
    separator?: React.ComponentType | string;
    [key: string]: any;
}

export const MultiExtensionPoint = ({
    points,
    separator: Separator,
    ...commonProps
}: MultiExtensionPointProps) => {
    const activePoints = points.filter((point) => point.condition !== false);

    return (
        <Fragment>
            {activePoints.map((point, index) => (
                <Fragment key={point.name}>
                    <ExtensionPoint
                        name={point.name}
                        {...commonProps}
                        {...point.props}
                    />
                    {Separator && index < activePoints.length - 1 && (
                        typeof Separator === "string"
                            ? <span>{Separator}</span>
                            : <Separator />
                    )}
                </Fragment>
            ))}
        </Fragment>
    );
};
