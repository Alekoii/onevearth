import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import authSlice from "@/store/slices/authSlice";
import configSlice from "@/store/slices/configSlice";
import usersSlice from "@/store/slices/usersSlice";

const coreReducers = {
    auth: authSlice,
    config: configSlice,
    users: usersSlice,
};

let dynamicReducers: Record<string, Reducer<any, any>> = {};

const createRootReducer = () => {
    return combineReducers({
        ...coreReducers,
        ...dynamicReducers,
    });
};

export const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const addDynamicReducer = (name: string, reducer: Reducer<any, any>) => {
    if (dynamicReducers[name]) {
        console.warn(`Reducer ${name} already exists, replacing...`);
    }

    dynamicReducers[name] = reducer;
    const newRootReducer = createRootReducer();
    store.replaceReducer(newRootReducer);

    console.log(
        `Added dynamic reducer: ${name}. Store now has:`,
        Object.keys({
            ...coreReducers,
            ...dynamicReducers,
        }),
    );
};

export const removeDynamicReducer = (name: string) => {
    if (!dynamicReducers[name]) return;

    delete dynamicReducers[name];
    const newRootReducer = createRootReducer();
    store.replaceReducer(newRootReducer);

    console.log(`Removed dynamic reducer: ${name}`);
};

export const getDynamicReducers = () => ({ ...dynamicReducers });

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export type AppDispatch = typeof store.dispatch;
