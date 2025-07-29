import { AppConfig } from "./types";

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
            editTimeLimit: 15,
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
            enabled: false,
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
                primary: "#DB00FF",
                secondary: "#6D6D6D",
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
            "notifications",
            
        ],
        config: {
            emotions: {
                allowCustomEmotions: false,
                maxEmotionsPerPost: 1,
            },
            reactions: {
                enableAnimations: true,
                showReactionCounts: true,
            },
            posts: {
                maxLength: 280,
                allowMedia: true,
                allowEditing: true,
                editTimeLimit: 15,
                requireModeration: false,
                showTimestamps: true,
                allowHashtags: true,
                enableRealTimeUpdates: false,
                maxLines: 4,
            },
            comments: {
                allowNested: true,
                maxDepth: 3,
                requireApproval: false,
                allowEditing: true,
                allowReactions: true,
                autoRefresh: false,
                maxLength: 500,
                enableMentions: false,
                showTimestamps: true,
                collapseLongThreads: true,
            },
            notifications: {
                maxNotifications: 1000,
                groupSimilar: true,
                autoMarkRead: false,
                showAvatars: true,
                notificationTypes: {
                    new_reaction: true,
                    new_comment: true,
                    new_mention: true,
                    new_follower: true,
                },
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
        dataRetention: 365,
        allowDataExport: true,
        allowAccountDeletion: true,
    },

    security: {
        twoFactorAuth: false,
        sessionTimeout: 1440,
        passwordComplexity: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: false,
        },
    },
};

const developmentConfig: Partial<AppConfig> = {
    app: {
        ...defaultAppConfig.app,
        environment: "development",
    },
    features: {
        ...defaultAppConfig.features,
        comments: {
            ...defaultAppConfig.features.comments,
            requireApproval: false, // No approval needed in dev
            allowEditing: true, // Allow editing in dev
        },
    },
    moderation: {
        ...defaultAppConfig.moderation,
        autoModeration: false,
    },
};

const productionConfig: Partial<AppConfig> = {
    app: {
        ...defaultAppConfig.app,
        environment: "production",
    },
    features: {
        ...defaultAppConfig.features,
        comments: {
            ...defaultAppConfig.features.comments,
            requireApproval: false, // Can be set to true for production moderation
            allowEditing: true, // Allow editing in production
        },
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

export const getEnvironmentConfig = (): AppConfig => {
    const baseConfig = { ...defaultAppConfig };

    if (__DEV__) {
        return deepMerge(baseConfig, developmentConfig);
    } else {
        return deepMerge(baseConfig, productionConfig);
    }
};

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
