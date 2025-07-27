import { AppConfig } from "./types";
import { supabase } from "@/core/api/SupabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultConfig: AppConfig = {
    app: {
        name: "Social Network",
        version: "1.0.0",
        environment: "development",
        supportEmail: "support@socialnetwork.com",
    },
    features: {
        posts: {
            enabled: true,
            allowPhotos: true,
            allowVideos: true,
            allowEmbeds: false,
            maxLength: 280,
            requireModeration: false,
            allowScheduling: false,
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
            allowSubGroups: false,
        },
        messaging: {
            enabled: true,
            allowGroupMessages: true,
            maxParticipants: 50,
            fileSharing: true,
            readReceipts: true,
        },
        premium: {
            enabled: false,
            features: [],
            trialPeriod: 7,
            gracePeriod: 3,
        },
        notifications: {
            push: true,
            email: true,
            inApp: true,
            digestFrequency: "daily",
        },
    },
    plugins: {
        enabled: ["posts", "comments", "reactions"],
        config: {},
        marketplace: {
            enabled: false,
            allowThirdParty: false,
            requireApproval: true,
        },
    },
    theme: {
        name: "default",
        customizations: {},
        allowUserThemes: true,
        darkModeDefault: false,
    },
    moderation: {
        autoModeration: false,
        humanReview: true,
        appealProcess: true,
        content: {
            textFiltering: false,
            imageModeration: false,
            videoModeration: false,
            audioModeration: false,
        },
        awsRekognition: {
            enabled: false,
            confidence: 85,
            labels: ["Violence", "Explicit Content", "Hate Symbols"],
            customLabels: false,
        },
        toxicityFiltering: {
            enabled: false,
            threshold: 0.7,
            provider: "perspective",
        },
        spamDetection: {
            enabled: true,
            aiPowered: false,
            rateLimiting: true,
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
        animations: {
            enabled: true,
            reducedMotion: false,
            duration: 200,
        },
        accessibility: {
            screenReader: true,
            highContrast: false,
            largeText: false,
            voiceNavigation: false,
        },
    },
    privacy: {
        dataRetention: 365,
        allowDataExport: true,
        allowAccountDeletion: true,
        cookieConsent: true,
        gdprCompliant: true,
    },
    analytics: {
        enabled: false,
        trackingLevel: "basic",
        shareWithPlugins: false,
        userConsent: false,
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
        rateLimiting: {
            posts: { count: 10, window: 3600 },
            comments: { count: 50, window: 3600 },
            messages: { count: 100, window: 3600 },
        },
    },
};

export class ConfigManager {
    private static cache: AppConfig | null = null;
    private static lastFetch = 0;
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    static async load(): Promise<AppConfig> {
        const now = Date.now();

        if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
            return this.cache;
        }

        try {
            const remoteConfig = await this.loadFromDatabase();
            const localOverrides = await this.loadLocalOverrides();

            const mergedConfig = this.mergeConfigs(
                defaultConfig,
                remoteConfig,
                localOverrides,
            );

            this.cache = mergedConfig;
            this.lastFetch = now;

            return mergedConfig;
        } catch (error) {
            console.warn("Failed to load config, using defaults:", error);
            return defaultConfig;
        }
    }

    private static async loadFromDatabase(): Promise<Partial<AppConfig>> {
        const { data, error } = await supabase
            .from("app_configuration")
            .select("key, value")
            .eq("is_public", true);

        if (error) throw error;
        if (!data || data.length === 0) return {};

        const config: any = {};

        data.forEach(({ key, value }) => {
            const keys = key.split(".");
            let current = config;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
        });

        return config;
    }

    private static async loadLocalOverrides(): Promise<Partial<AppConfig>> {
        try {
            const stored = await AsyncStorage.getItem("config_overrides");
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    private static mergeConfigs(
        ...configs: Array<Partial<AppConfig>>
    ): AppConfig {
        return configs.reduce(
            (merged, config) => this.deepMerge(merged, config),
            {},
        ) as AppConfig;
    }

    private static deepMerge(target: any, source: any): any {
        const result = { ...target };

        for (const key in source) {
            if (
                source[key] && typeof source[key] === "object" &&
                !Array.isArray(source[key])
            ) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    static async save(config: AppConfig): Promise<void> {
        const flatConfig = this.flattenConfig(config);

        const updates = Object.entries(flatConfig).map(([key, value]) => ({
            key,
            value,
            is_public: true,
        }));

        const { error } = await supabase
            .from("app_configuration")
            .upsert(updates, { onConflict: "key" });

        if (error) throw error;

        this.cache = config;
        this.lastFetch = Date.now();
    }

    private static flattenConfig(
        config: AppConfig,
        prefix = "",
    ): Record<string, any> {
        const result: Record<string, any> = {};

        for (const [key, value] of Object.entries(config)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (value && typeof value === "object" && !Array.isArray(value)) {
                Object.assign(result, this.flattenConfig(value, fullKey));
            } else {
                result[fullKey] = value;
            }
        }

        return result;
    }

    static async saveLocalOverride(path: string, value: any): Promise<void> {
        try {
            const overrides = await this.loadLocalOverrides();
            const keys = path.split(".");
            let current = overrides as any;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;

            await AsyncStorage.setItem(
                "config_overrides",
                JSON.stringify(overrides),
            );
            this.cache = null; // Force reload
        } catch (error) {
            console.error("Failed to save local override:", error);
        }
    }

    static async clearCache(): Promise<void> {
        this.cache = null;
        this.lastFetch = 0;
    }

    static getDefault(): AppConfig {
        return { ...defaultConfig };
    }

    static validate(
        config: Partial<AppConfig>,
    ): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (
            config.features?.posts?.maxLength &&
            config.features.posts.maxLength > 10000
        ) {
            errors.push("Post max length cannot exceed 10,000 characters");
        }

        if (
            config.security?.sessionTimeout &&
            config.security.sessionTimeout < 5
        ) {
            errors.push("Session timeout cannot be less than 5 minutes");
        }

        if (
            config.moderation?.toxicityFiltering?.threshold &&
            (config.moderation.toxicityFiltering.threshold < 0 ||
                config.moderation.toxicityFiltering.threshold > 1)
        ) {
            errors.push("Toxicity threshold must be between 0 and 1");
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
