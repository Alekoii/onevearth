export type RootStackParamList = {
    MainTabs: undefined;
    PostDetail: { postId: number };
};

export type TabParamList = {
    Home: undefined;
    Search: undefined;
    Create: undefined;
    Notifications: undefined;
    Settings: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
