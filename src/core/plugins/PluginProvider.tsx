import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { ExtensionRegistration, Plugin, PluginAPI } from "@/core/plugins/types";
import { EventEmitter } from "@/core/plugins/EventEmitter";

interface PluginContextType {
    plugins: Plugin[];
    enabledPlugins: Plugin[];
    loadPlugin: (plugin: Plugin) => Promise<void>;
    unloadPlugin: (pluginId: string) => Promise<void>;
    getExtensions: (pointName: string) => ExtensionRegistration[];
    api: PluginAPI;
}

const PluginContext = createContext<PluginContextType | null>(null);

export const usePlugins = () => {
    const context = useContext(PluginContext);
    if (!context) {
        throw new Error("usePlugins must be used within PluginProvider");
    }
    return context;
};

export const PluginProvider = ({ children }: { children: ReactNode }) => {
    const [plugins, setPlugins] = useState<Plugin[]>([]);
    const [extensions, setExtensions] = useState<
        Map<string, ExtensionRegistration[]>
    >(new Map());
    const eventEmitter = new EventEmitter();

    const api: PluginAPI = {
        registerExtension: (name: string, component: any) => {
            const registration: ExtensionRegistration = {
                id: Math.random().toString(36),
                name,
                component,
                pluginId: "current",
                priority: 0,
            };

            setExtensions((prev) => {
                const newMap = new Map(prev);
                const existing = newMap.get(name) || [];
                newMap.set(name, [...existing, registration]);
                return newMap;
            });
        },

        unregisterExtension: (name: string, componentId: string) => {
            setExtensions((prev) => {
                const newMap = new Map(prev);
                const existing = newMap.get(name) || [];
                newMap.set(
                    name,
                    existing.filter((ext) => ext.id !== componentId),
                );
                return newMap;
            });
        },

        emitEvent: (event: string, data: any) => {
            eventEmitter.emit(event, data);
        },

        subscribeToEvent: (event: string, handler: (data: any) => void) => {
            eventEmitter.on(event, handler);
        },
    };

    const loadPlugin = async (plugin: Plugin) => {
        if (plugins.find((p) => p.id === plugin.id)) return;

        try {
            await plugin.install?.(api);
            await plugin.activate?.(api);

            setPlugins((prev) => [...prev, plugin]);

            api.emitEvent("plugin:loaded", { plugin });
        } catch (error) {
            console.error(`Failed to load plugin ${plugin.id}:`, error);
        }
    };

    const unloadPlugin = async (pluginId: string) => {
        const plugin = plugins.find((p) => p.id === pluginId);
        if (!plugin) return;

        try {
            await plugin.deactivate?.(api);
            await plugin.uninstall?.(api);

            setPlugins((prev) => prev.filter((p) => p.id !== pluginId));

            api.emitEvent("plugin:unloaded", { pluginId });
        } catch (error) {
            console.error(`Failed to unload plugin ${pluginId}:`, error);
        }
    };

    const getExtensions = (pointName: string): ExtensionRegistration[] => {
        return extensions.get(pointName) || [];
    };

    return (
        <PluginContext.Provider
            value={{
                plugins,
                enabledPlugins: plugins,
                loadPlugin,
                unloadPlugin,
                getExtensions,
                api,
            }}
        >
            {children}
        </PluginContext.Provider>
    );
};
