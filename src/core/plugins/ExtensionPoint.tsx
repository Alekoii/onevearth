import { Fragment } from "react";
import { usePlugins } from "@/core/plugins/PluginProvider";

interface ExtensionPointProps {
    name: string;
    [key: string]: any;
}

export const ExtensionPoint = ({ name, ...props }: ExtensionPointProps) => {
    const { getExtensions } = usePlugins();
    const extensions = getExtensions(name);

    if (extensions.length === 0) return null;

    return (
        <Fragment>
            {extensions
                .sort((a, b) => b.priority - a.priority)
                .map((extension) => {
                    const Component = extension.component;
                    return (
                        <Component
                            key={extension.id}
                            {...props}
                        />
                    );
                })}
        </Fragment>
    );
};
