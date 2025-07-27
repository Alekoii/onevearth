export interface AppConfig {
    app: {
        name: string;
        version: string;
        environment: "development" | "staging" | "production";
    };
    features: {
        posts: {
            enabled: boolean;
            allowPhotos: boolean;
            maxLength: number;
        };
        reactions: {
            enabled: boolean;
            types: string[];
        };
        premium: {
            enabled: boolean;
        };
    };
    plugins: {
        enabled: string[];
    };
}
