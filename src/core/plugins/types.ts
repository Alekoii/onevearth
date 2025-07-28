import { ComponentType } from "react";
import { Middleware, Reducer } from "@reduxjs/toolkit";

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

export interface EnhancedPlugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;

    dependencies?: string[];
    peerDependencies?: string[];
    conflicts?: string[];

    components?: Record<string, ComponentType<any>>;
    screens?: Record<string, ComponentType<any>>;

    reducers?: Record<string, Reducer<any, any>>;
    middleware?: Middleware[];
    selectors?: Record<string, Function>;

    services?: Record<string, any>;

    configSchema?: any;
    defaultConfig?: any;

    install?: (api: EnhancedPluginAPI) => Promise<void>;
    uninstall?: (api: EnhancedPluginAPI) => Promise<void>;
    activate?: (api: EnhancedPluginAPI) => Promise<void>;
    deactivate?: (api: EnhancedPluginAPI) => Promise<void>;
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

export interface EnhancedPluginAPI {
    registerComponent: (name: string, component: ComponentType<any>) => void;
    registerScreen: (name: string, screen: ComponentType<any>) => void;
    registerExtension: (
        point: string,
        component: ComponentType<any>,
        priority?: number,
    ) => void;

    registerReducer: (name: string, reducer: Reducer<any, any>) => void;
    registerMiddleware: (middleware: Middleware) => void;
    registerSelector: (name: string, selector: Function) => void;

    registerService: (name: string, service: any) => void;
    getService: <T = any>(name: string) => T | null;

    getPluginConfig: (pluginId?: string) => any;
    updatePluginConfig: (config: any) => Promise<void>;

    subscribeToEvent: (event: string, handler: Function) => void;
    emitEvent: (event: string, data?: any) => void;

    getStore: () => any;
}

export interface ExtensionRegistration {
    id: string;
    name: string;
    component: ComponentType<any>;
    pluginId: string;
    priority: number;
}

export interface EnhancedExtensionRegistration {
    id: string;
    pluginId: string;
    extensionPoint: string;
    component: ComponentType<any>;
    priority: number;
    metadata?: any;
}

export interface ServiceRegistration {
    id: string;
    pluginId: string;
    service: any;
    interface?: string;
}

export type PluginState = "unloaded" | "installed" | "activated" | "error";

export interface PluginInfo {
    id: string;
    state: PluginState;
    plugin: EnhancedPlugin;
    error?: Error;
}

export interface TabConfig {
    id: string;
    name: string;
    component: ComponentType<any>;
    icon?: string;
    badge?: number;
    order?: number;
}

export interface APIRoute {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    handler: Function;
    middleware?: Function[];
}

export interface JSONSchema {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
    [key: string]: any;
}
