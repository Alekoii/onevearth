import { ComponentType, ReactNode } from "react";

export interface Plugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;

    components?: Record<string, ComponentType<any>>;
    extensionPoints?: ExtensionPoint[];
    hooks?: Record<string, () => any>;

    install?: (api: PluginAPI) => Promise<void>;
    uninstall?: (api: PluginAPI) => Promise<void>;
    activate?: (api: PluginAPI) => Promise<void>;
    deactivate?: (api: PluginAPI) => Promise<void>;
}

export interface ExtensionPoint {
    name: string;
    component: ComponentType<any>;
    priority?: number;
}

export interface PluginAPI {
    registerExtension: (name: string, component: ComponentType<any>) => void;
    unregisterExtension: (name: string, componentId: string) => void;
    emitEvent: (event: string, data: any) => void;
    subscribeToEvent: (event: string, handler: (data: any) => void) => void;
}

export interface ExtensionRegistration {
    id: string;
    name: string;
    component: ComponentType<any>;
    pluginId: string;
    priority: number;
}
