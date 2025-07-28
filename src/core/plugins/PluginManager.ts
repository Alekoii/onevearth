import { Middleware, Reducer, Store } from "@reduxjs/toolkit";
import { ComponentType } from "react";
import { EventEmitter } from "./EventEmitter";
import { pluginReduxManager } from "./PluginReduxIntegration";
import { serviceRegistry } from "./ServiceRegistry";

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

export interface ExtensionRegistration {
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

    getStore: () => Store;
}

export type PluginState = "unloaded" | "installed" | "activated" | "error";

interface PluginEntry {
    plugin: EnhancedPlugin;
    state: PluginState;
    error?: Error;
    registrations: {
        components: Set<string>;
        screens: Set<string>;
        extensions: Set<string>;
        reducers: Set<string>;
        services: Set<string>;
    };
}

export class PluginManager {
    private plugins = new Map<string, PluginEntry>();
    private extensions = new Map<string, ExtensionRegistration[]>();
    private eventEmitter = new EventEmitter();
    private store: Store | null = null;
    private config: any = {};

    setStore(store: Store) {
        this.store = store;
        pluginReduxManager.setStore(store);
    }

    setConfig(config: any) {
        this.config = config;
    }

    async loadPlugin(plugin: EnhancedPlugin): Promise<void> {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin ${plugin.id} already loaded`);
        }

        this.validateDependencies(plugin);

        const entry: PluginEntry = {
            plugin,
            state: "unloaded",
            registrations: {
                components: new Set(),
                screens: new Set(),
                extensions: new Set(),
                reducers: new Set(),
                services: new Set(),
            },
        };

        this.plugins.set(plugin.id, entry);

        try {
            await this.installPlugin(plugin.id);
            await this.activatePlugin(plugin.id);
        } catch (error) {
            entry.state = "error";
            entry.error = error as Error;
            throw error;
        }
    }

    async unloadPlugin(pluginId: string): Promise<void> {
        const entry = this.plugins.get(pluginId);
        if (!entry) return;

        try {
            if (entry.state === "activated") {
                await this.deactivatePlugin(pluginId);
            }
            if (entry.state === "installed") {
                await this.uninstallPlugin(pluginId);
            }
        } finally {
            this.plugins.delete(pluginId);
        }
    }

    private async installPlugin(pluginId: string): Promise<void> {
        const entry = this.plugins.get(pluginId)!;
        const api = this.createPluginAPI(pluginId);

        if (entry.plugin.install) {
            await entry.plugin.install(api);
        }

        entry.state = "installed";
        this.eventEmitter.emit("plugin:installed", { pluginId });
    }

    private async activatePlugin(pluginId: string): Promise<void> {
        const entry = this.plugins.get(pluginId)!;
        const api = this.createPluginAPI(pluginId);

        this.registerPluginAssets(entry.plugin, entry.registrations);

        if (entry.plugin.activate) {
            await entry.plugin.activate(api);
        }

        entry.state = "activated";
        this.eventEmitter.emit("plugin:activated", { pluginId });
    }

    private async deactivatePlugin(pluginId: string): Promise<void> {
        const entry = this.plugins.get(pluginId)!;
        const api = this.createPluginAPI(pluginId);

        if (entry.plugin.deactivate) {
            await entry.plugin.deactivate(api);
        }

        this.unregisterPluginAssets(pluginId, entry.registrations);
        entry.state = "installed";
        this.eventEmitter.emit("plugin:deactivated", { pluginId });
    }

    private async uninstallPlugin(pluginId: string): Promise<void> {
        const entry = this.plugins.get(pluginId)!;
        const api = this.createPluginAPI(pluginId);

        if (entry.plugin.uninstall) {
            await entry.plugin.uninstall(api);
        }

        entry.state = "unloaded";
        this.eventEmitter.emit("plugin:uninstalled", { pluginId });
    }

    private createPluginAPI(pluginId: string): EnhancedPluginAPI {
        const entry = this.plugins.get(pluginId)!;

        return {
            registerComponent: (name, component) => {
                entry.registrations.components.add(name);
            },

            registerScreen: (name, screen) => {
                entry.registrations.screens.add(name);
            },

            registerExtension: (point, component, priority = 0) => {
                const id = `${pluginId}-${Date.now()}`;
                const registration: ExtensionRegistration = {
                    id,
                    pluginId,
                    extensionPoint: point,
                    component,
                    priority,
                };

                if (!this.extensions.has(point)) {
                    this.extensions.set(point, []);
                }
                this.extensions.get(point)!.push(registration);
                entry.registrations.extensions.add(id);
            },

            registerReducer: (name, reducer) => {
                if (!this.store) throw new Error("Store not available");

                pluginReduxManager.registerReducer(name, reducer, pluginId);
                entry.registrations.reducers.add(name);
            },

            registerMiddleware: (middleware) => {
                if (!this.store) throw new Error("Store not available");

                pluginReduxManager.registerMiddleware(middleware, pluginId);
            },

            registerSelector: (name, selector) => {
                // Store selectors for potential future use
            },

            registerService: (name, service) => {
                serviceRegistry.register(name, service, pluginId, {
                    singleton: true,
                });
                entry.registrations.services.add(name);
            },

            getService: <T = any>(name: string): T | null => {
                return serviceRegistry.get<T>(name);
            },

            getPluginConfig: (targetPluginId = pluginId) => {
                return this.config.plugins?.config?.[targetPluginId] || {};
            },

            updatePluginConfig: async (config) => {
                this.eventEmitter.emit("config:update", { pluginId, config });
            },

            subscribeToEvent: (event, handler) => {
                this.eventEmitter.on(event, handler);
            },

            emitEvent: (event, data) => {
                this.eventEmitter.emit(event, data);
            },

            getStore: () => {
                if (!this.store) throw new Error("Store not available");
                return this.store;
            },
        };
    }

    private registerPluginAssets(
        plugin: EnhancedPlugin,
        registrations: PluginEntry["registrations"],
    ) {
        // Assets are registered through the API calls during install/activate
    }

    private unregisterPluginAssets(
        pluginId: string,
        registrations: PluginEntry["registrations"],
    ) {
        registrations.extensions.forEach((id) => {
            for (const [point, extensions] of this.extensions.entries()) {
                const index = extensions.findIndex((ext) => ext.id === id);
                if (index !== -1) {
                    extensions.splice(index, 1);
                    if (extensions.length === 0) {
                        this.extensions.delete(point);
                    }
                    break;
                }
            }
        });

        registrations.services.forEach((name) => {
            serviceRegistry.unregister(name);
        });

        registrations.reducers.forEach((name) => {
            pluginReduxManager.unregisterReducer(name);
        });

        pluginReduxManager.unregisterMiddlewareByPlugin(pluginId);
    }

    private validateDependencies(plugin: EnhancedPlugin) {
        if (plugin.dependencies) {
            for (const dep of plugin.dependencies) {
                const depEntry = this.plugins.get(dep);
                if (!depEntry || depEntry.state !== "activated") {
                    throw new Error(`Missing dependency: ${dep}`);
                }
            }
        }

        if (plugin.conflicts) {
            for (const conflict of plugin.conflicts) {
                if (this.plugins.has(conflict)) {
                    throw new Error(`Conflicting plugin: ${conflict}`);
                }
            }
        }
    }

    getPlugin(pluginId: string): EnhancedPlugin | null {
        return this.plugins.get(pluginId)?.plugin || null;
    }

    getPluginState(pluginId: string): PluginState | null {
        return this.plugins.get(pluginId)?.state || null;
    }

    getLoadedPlugins(): { id: string; state: PluginState }[] {
        return Array.from(this.plugins.entries()).map(([id, entry]) => ({
            id,
            state: entry.state,
        }));
    }

    getExtensions(extensionPoint: string): ExtensionRegistration[] {
        const extensions = this.extensions.get(extensionPoint) || [];
        return extensions.sort((a, b) => b.priority - a.priority);
    }

    getService<T = any>(name: string): T | null {
        return serviceRegistry.get<T>(name);
    }

    getAllServices(): Record<string, any> {
        return serviceRegistry.getAll();
    }

    getStore(): Store {
        if (!this.store) throw new Error("Store not available");
        return this.store;
    }
}
