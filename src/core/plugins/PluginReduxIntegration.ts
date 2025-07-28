import {
    Dispatch,
    Middleware,
    MiddlewareAPI,
    Reducer,
    Store,
    UnknownAction,
} from "@reduxjs/toolkit";
import { addDynamicReducer, removeDynamicReducer } from "@/store";

interface PluginReducerRegistry {
    [key: string]: {
        reducer: Reducer<any, any>;
        pluginId: string;
    };
}

interface PluginMiddlewareRegistry {
    middleware: Middleware;
    pluginId: string;
    id: string;
}

class PluginReduxManager {
    private store: Store | null = null;
    private pluginReducers: PluginReducerRegistry = {};
    private pluginMiddleware: PluginMiddlewareRegistry[] = [];

    setStore(store: Store) {
        this.store = store;
        console.log("PluginReduxManager: Store set");
    }

    registerReducer(
        name: string,
        reducer: Reducer<any, any>,
        pluginId: string,
    ): void {
        if (this.pluginReducers[name]) {
            throw new Error(
                `Reducer ${name} already registered by plugin ${
                    this.pluginReducers[name].pluginId
                }`,
            );
        }

        this.pluginReducers[name] = { reducer, pluginId };

        try {
            addDynamicReducer(name, reducer);
            console.log(
                `Successfully registered reducer ${name} for plugin ${pluginId}`,
            );
        } catch (error) {
            console.error(`Failed to register reducer ${name}:`, error);
            delete this.pluginReducers[name];
            throw error;
        }
    }

    unregisterReducer(name: string): void {
        if (!this.pluginReducers[name]) return;

        const pluginId = this.pluginReducers[name].pluginId;
        delete this.pluginReducers[name];

        try {
            removeDynamicReducer(name);
            console.log(`Unregistered reducer ${name} for plugin ${pluginId}`);
        } catch (error) {
            console.error(`Failed to unregister reducer ${name}:`, error);
        }
    }

    unregisterReducersByPlugin(pluginId: string): void {
        const toRemove = Object.keys(this.pluginReducers).filter(
            (name) => this.pluginReducers[name].pluginId === pluginId,
        );

        toRemove.forEach((name) => this.unregisterReducer(name));

        if (toRemove.length > 0) {
            console.log(
                `Unregistered ${toRemove.length} reducers for plugin ${pluginId}`,
            );
        }
    }

    registerMiddleware(
        middleware: Middleware,
        pluginId: string,
        id?: string,
    ): string {
        const middlewareId = id || `${pluginId}-${Date.now()}`;

        this.pluginMiddleware.push({
            middleware,
            pluginId,
            id: middlewareId,
        });

        console.log(
            `Registered middleware ${middlewareId} for plugin ${pluginId}`,
        );
        return middlewareId;
    }

    unregisterMiddleware(id: string): void {
        const index = this.pluginMiddleware.findIndex((m) => m.id === id);
        if (index !== -1) {
            const pluginId = this.pluginMiddleware[index].pluginId;
            this.pluginMiddleware.splice(index, 1);
            console.log(`Unregistered middleware ${id} for plugin ${pluginId}`);
        }
    }

    unregisterMiddlewareByPlugin(pluginId: string): void {
        const removed = this.pluginMiddleware.filter((m) =>
            m.pluginId === pluginId
        );
        this.pluginMiddleware = this.pluginMiddleware.filter(
            (m) => m.pluginId !== pluginId,
        );

        if (removed.length > 0) {
            console.log(
                `Unregistered ${removed.length} middleware for plugin ${pluginId}`,
            );
        }
    }

    getPluginReducers(): Record<string, string> {
        return Object.keys(this.pluginReducers).reduce((acc, name) => {
            acc[name] = this.pluginReducers[name].pluginId;
            return acc;
        }, {} as Record<string, string>);
    }

    getPluginMiddleware(): Array<{ id: string; pluginId: string }> {
        return this.pluginMiddleware.map((m) => ({
            id: m.id,
            pluginId: m.pluginId,
        }));
    }

    createPluginSliceSelector<T>(sliceName: string) {
        return (state: any): T | undefined => {
            return state[sliceName];
        };
    }

    createPluginAction(type: string, pluginId: string) {
        return (payload?: any): UnknownAction => ({
            type: `${pluginId}/${type}`,
            payload,
        });
    }

    hasSlice(sliceName: string): boolean {
        return sliceName in this.pluginReducers;
    }

    getSliceState<T>(sliceName: string): T | undefined {
        if (!this.store) return undefined;
        const state = this.store.getState();
        return state[sliceName];
    }

    dispatch(action: UnknownAction): void {
        if (!this.store) throw new Error("Store not available");
        this.store.dispatch(action);
    }

    subscribe(listener: () => void): () => void {
        if (!this.store) throw new Error("Store not available");
        return this.store.subscribe(listener);
    }
}

export const pluginReduxManager = new PluginReduxManager();

export const createPluginMiddleware = (pluginId: string) => {
    return (store: MiddlewareAPI) =>
    (next: Dispatch) =>
    (action: UnknownAction) => {
        const result = next(action);

        if (action.type.startsWith(`${pluginId}/`)) {
            console.debug(`Plugin ${pluginId} action:`, action);
        }

        return result;
    };
};

export const createAsyncPluginMiddleware = (pluginId: string) => {
    return (store: MiddlewareAPI) =>
    (next: Dispatch) =>
    (action: UnknownAction | Function) => {
        if (typeof action === "function") {
            return (action as any)(store.dispatch, store.getState);
        }

        return next(action as UnknownAction);
    };
};

export { PluginReduxManager };
