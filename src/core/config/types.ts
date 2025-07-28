export interface AppConfig {
    app: {
        name: string;
        version: string;
        environment: "development" | "staging" | "production";
        supportEmail: string;
    };

    features: {
        posts: {
            enabled: boolean;
            allowPhotos: boolean;
            allowVideos: boolean;
            maxLength: number;
            requireModeration: boolean;
            allowEditing: boolean;
            editTimeLimit: number; // minutes
        };

        comments: {
            enabled: boolean;
            allowNested: boolean;
            maxDepth: number;
            requireApproval: boolean;
            allowEditing: boolean;
            allowReactions: boolean;
        };

        reactions: {
            enabled: boolean;
            types: ReactionType[];
            allowCustom: boolean;
            maxPerPost: number;
            showCounts: boolean;
        };

        groups: {
            enabled: boolean;
            allowPrivate: boolean;
            maxMembers: number;
            requireApproval: boolean;
        };

        notifications: {
            push: boolean;
            email: boolean;
            inApp: boolean;
            digestFrequency: "none" | "daily" | "weekly";
        };

        premium: {
            enabled: boolean;
            features: string[];
            trialPeriod: number;
        };
    };

    ui: {
        navigation: {
            type: "tabs" | "drawer" | "stack";
            showLabels: boolean;
            badgeEnabled: boolean;
        };

        layout: {
            feedStyle: "list" | "grid" | "cards";
            infiniteScroll: boolean;
            pullToRefresh: boolean;
        };

        theme: {
            name: string;
            allowUserThemes: boolean;
            darkModeDefault: boolean;
            customColors?: Record<string, string>;
        };

        accessibility: {
            screenReader: boolean;
            highContrast: boolean;
            largeText: boolean;
            reducedMotion: boolean;
        };
    };

    plugins: {
        enabled: string[];
        config: Record<string, any>;
    };

    moderation: {
        autoModeration: boolean;
        humanReview: boolean;
        toxicityFiltering: {
            enabled: boolean;
            threshold: number;
        };
        spamDetection: {
            enabled: boolean;
            rateLimiting: boolean;
        };
    };

    privacy: {
        dataRetention: number; // days
        allowDataExport: boolean;
        allowAccountDeletion: boolean;
    };

    security: {
        twoFactorAuth: boolean;
        sessionTimeout: number; // minutes
        passwordComplexity: {
            minLength: number;
            requireUppercase: boolean;
            requireLowercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        };
    };
}

export interface ReactionType {
    id: string;
    name: string;
    emoji: string;
    description?: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface ConfigContextType {
    config: AppConfig;
    loading: boolean;
    error: Error | null;
    updateConfig: (updates: Partial<AppConfig>) => void;
    isFeatureEnabled: (feature: string) => boolean;
    getPluginConfig: (pluginId: string) => any;
    validateConfig: (config: Partial<AppConfig>) => ValidationResult;
}
