import {
    combineReducers,
    Dispatch,
    Middleware,
    MiddlewareAPI,
    Reducer,
    Store,
    UnknownAction,
} from "@reduxjs/toolkit";

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
    private baseReducers: Record<string, Reducer<any, any>> = {};
    private pluginReducers: PluginReducerRegistry = {};
    private pluginMiddleware: PluginMiddlewareRegistry[] = [];
    private currentRootReducer: Reducer<any, any> | null = null;

    setStore(store: Store) {
        this.store = store;
        this.extractBaseReducers();
    }

    private extractBaseReducers() {
        if (!this.store) return;

        const state = this.store.getState();
        this.baseReducers = {
            auth: (state: any = null) => state,
            config: (state: any = null) => state,
            users: (state: any = null) => state,
        };
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
        this.updateRootReducer();
    }

    unregisterReducer(name: string): void {
        if (!this.pluginReducers[name]) return;

        delete this.pluginReducers[name];
        this.updateRootReducer();
    }

    unregisterReducersByPlugin(pluginId: string): void {
        const toRemove = Object.keys(this.pluginReducers).filter(
            (name) => this.pluginReducers[name].pluginId === pluginId,
        );

        toRemove.forEach((name) => delete this.pluginReducers[name]);

        if (toRemove.length > 0) {
            this.updateRootReducer();
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

        return middlewareId;
    }

    unregisterMiddleware(id: string): void {
        const index = this.pluginMiddleware.findIndex((m) => m.id === id);
        if (index !== -1) {
            this.pluginMiddleware.splice(index, 1);
        }
    }

    unregisterMiddlewareByPlugin(pluginId: string): void {
        this.pluginMiddleware = this.pluginMiddleware.filter(
            (m) => m.pluginId !== pluginId,
        );
    }

    private updateRootReducer(): void {
        if (!this.store) return;

        const allReducers = {
            ...this.baseReducers,
            ...Object.keys(this.pluginReducers).reduce((acc, name) => {
                acc[name] = this.pluginReducers[name].reducer;
                return acc;
            }, {} as Record<string, Reducer<any, any>>),
        };

        const newRootReducer = combineReducers(allReducers);

        if (this.store.replaceReducer) {
            this.store.replaceReducer(newRootReducer);
            this.currentRootReducer = newRootReducer;
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
        return sliceName in this.pluginReducers ||
            sliceName in this.baseReducers;
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
