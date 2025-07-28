import { AppConfig } from "./types";

// This is your main configuration file - modify this to customize your app
export const defaultAppConfig: AppConfig = {
    app: {
        name: "OneVearth",
        version: "1.0.0",
        environment: "development",
        supportEmail: "support@onevearth.com",
    },

    features: {
        posts: {
            enabled: true,
            allowPhotos: true,
            allowVideos: true,
            maxLength: 280,
            requireModeration: false,
            allowEditing: true,
            editTimeLimit: 15, // 15 minutes
        },

        comments: {
            enabled: true,
            allowNested: true,
            maxDepth: 3,
            requireApproval: false,
            allowEditing: true,
            allowReactions: true,
        },

        reactions: {
            enabled: true,
            types: [
                { id: "like", name: "Like", emoji: "❤️" },
                { id: "love", name: "Love", emoji: "🥰" },
                { id: "laugh", name: "Laugh", emoji: "😂" },
                { id: "wow", name: "Wow", emoji: "😮" },
                { id: "sad", name: "Sad", emoji: "😢" },
                { id: "angry", name: "Angry", emoji: "😠" },
            ],
            allowCustom: false,
            maxPerPost: 1,
            showCounts: true,
        },

        groups: {
            enabled: true,
            allowPrivate: true,
            maxMembers: 1000,
            requireApproval: false,
        },

        notifications: {
            push: true,
            email: true,
            inApp: true,
            digestFrequency: "daily",
        },

        premium: {
            enabled: false, // Set to true to enable premium features
            features: [
                "unlimited-posts",
                "custom-themes",
                "analytics",
                "priority-support",
            ],
            trialPeriod: 7,
        },
    },

    ui: {
        navigation: {
            type: "tabs",
            showLabels: true,
            badgeEnabled: true,
        },

        layout: {
            feedStyle: "cards",
            infiniteScroll: true,
            pullToRefresh: true,
        },

        theme: {
            name: "default",
            allowUserThemes: true,
            darkModeDefault: false,
            customColors: {
                // Add custom brand colors here
                primary: '#DB00FF',
                secondary: '#6D6D6D'
            },
        },

        accessibility: {
            screenReader: true,
            highContrast: false,
            largeText: false,
            reducedMotion: false,
        },
    },

    plugins: {
        enabled: [
            "posts",
            "comments",
            "reactions",
            "emotions",
            // 'groups',     // Uncomment to enable
            // 'premium',    // Uncomment to enable
            // 'analytics'   // Uncomment to enable
        ],
        config: {
            // Plugin-specific configuration
            emotions: {
                allowCustomEmotions: false,
                maxEmotionsPerPost: 1,
            },
            reactions: {
                enableAnimations: true,
                showReactionCounts: true,
            },
            posts: {
                showTimestamps: true,
                allowHashtags: true,
            },
        },
    },

    moderation: {
        autoModeration: false,
        humanReview: true,
        toxicityFiltering: {
            enabled: false,
            threshold: 0.7,
        },
        spamDetection: {
            enabled: true,
            rateLimiting: true,
        },
    },

    privacy: {
        dataRetention: 365, // days
        allowDataExport: true,
        allowAccountDeletion: true,
    },

    security: {
        twoFactorAuth: false,
        sessionTimeout: 1440, // 24 hours in minutes
        passwordComplexity: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: false,
        },
    },
};

// Environment-specific overrides
const developmentConfig: Partial<AppConfig> = {
    app: {
        ...defaultAppConfig.app,
        environment: "development",
    },
    moderation: {
        ...defaultAppConfig.moderation,
        autoModeration: false, // Disable for easier development
    },
};

const productionConfig: Partial<AppConfig> = {
    app: {
        ...defaultAppConfig.app,
        environment: "production",
    },
    moderation: {
        ...defaultAppConfig.moderation,
        autoModeration: true,
        toxicityFiltering: {
            enabled: true,
            threshold: 0.8,
        },
    },
    security: {
        ...defaultAppConfig.security,
        twoFactorAuth: true,
    },
};

// Get config based on environment
export const getEnvironmentConfig = (): AppConfig => {
    const baseConfig = { ...defaultAppConfig };

    // Apply environment-specific overrides
    if (__DEV__) {
        return deepMerge(baseConfig, developmentConfig);
    } else {
        return deepMerge(baseConfig, productionConfig);
    }
};

// Helper function for deep merging
function deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
        if (
            source[key] && typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}
