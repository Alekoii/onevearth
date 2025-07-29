import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConfig, ValidationResult } from "./types";
import { getEnvironmentConfig } from "./appConfig";

export class ConfigManager {
    private static cache: AppConfig | null = null;
    private static readonly LOCAL_OVERRIDES_KEY = "config_overrides";

    static async load(): Promise<AppConfig> {
        if (this.cache) {
            return this.cache;
        }

        try {
            const baseConfig = getEnvironmentConfig();
            const localOverrides = await this.loadLocalOverrides();
            const finalConfig = this.mergeConfigs(baseConfig, localOverrides);

            const validation = this.validate(finalConfig);
            if (!validation.valid) {
                console.warn(
                    "Configuration validation failed:",
                    validation.errors,
                );
                this.cache = baseConfig;
            } else {
                this.cache = finalConfig;
            }

            return this.cache;
        } catch (error) {
            console.warn("Failed to load config, using defaults:", error);
            const defaultConfig = getEnvironmentConfig();
            this.cache = defaultConfig;
            return defaultConfig;
        }
    }

    private static async loadLocalOverrides(): Promise<Partial<AppConfig>> {
        try {
            const stored = await AsyncStorage.getItem(this.LOCAL_OVERRIDES_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn("Failed to load local config overrides:", error);
            return {};
        }
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
                this.LOCAL_OVERRIDES_KEY,
                JSON.stringify(overrides),
            );

            this.cache = null;
        } catch (error) {
            console.error("Failed to save local override:", error);
        }
    }

    static async clearLocalOverrides(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.LOCAL_OVERRIDES_KEY);
            this.cache = null;
        } catch (error) {
            console.error("Failed to clear local overrides:", error);
        }
    }

    private static mergeConfigs(
        base: AppConfig,
        overrides: Partial<AppConfig>,
    ): AppConfig {
        return this.deepMerge(base, overrides) as AppConfig;
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

    static validate(config: Partial<AppConfig>): ValidationResult {
        const errors: string[] = [];

        if (
            config.features?.posts?.maxLength &&
            config.features.posts.maxLength > 10000
        ) {
            errors.push("Post max length cannot exceed 10,000 characters");
        }

        if (
            config.features?.posts?.maxLength &&
            config.features.posts.maxLength < 1
        ) {
            errors.push("Post max length must be at least 1 character");
        }

        if (
            config.security?.sessionTimeout &&
            config.security.sessionTimeout < 5
        ) {
            errors.push("Session timeout cannot be less than 5 minutes");
        }

        if (config.moderation?.toxicityFiltering?.threshold !== undefined) {
            const threshold = config.moderation.toxicityFiltering.threshold;
            if (threshold < 0 || threshold > 1) {
                errors.push("Toxicity threshold must be between 0 and 1");
            }
        }

        if (
            config.security?.passwordComplexity?.minLength &&
            config.security.passwordComplexity.minLength < 6
        ) {
            errors.push(
                "Password minimum length cannot be less than 6 characters",
            );
        }

        if (
            config.features?.comments?.maxDepth &&
            config.features.comments.maxDepth > 10
        ) {
            errors.push("Comment max depth cannot exceed 10 levels");
        }

        if (
            config.features?.groups?.maxMembers &&
            config.features.groups.maxMembers > 100000
        ) {
            errors.push("Group max members cannot exceed 100,000");
        }

        if (config.plugins?.config?.posts?.maxLines !== undefined) {
            const maxLines = config.plugins.config.posts.maxLines;
            if (maxLines < 0) {
                errors.push("Post max lines cannot be negative");
            }
            if (maxLines > 20) {
                errors.push("Post max lines cannot exceed 20");
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    static getDefault(): AppConfig {
        return getEnvironmentConfig();
    }

    static async clearCache(): Promise<void> {
        this.cache = null;
    }

    static isFeatureEnabled(config: AppConfig, feature: string): boolean {
        const parts = feature.split(".");
        let current: any = config.features;

        for (const part of parts) {
            if (!current?.[part]) return false;
            current = current[part];
        }

        return current === true;
    }

    static getPluginConfig(config: AppConfig, pluginId: string): any {
        return config.plugins.config[pluginId] || {};
    }

    static isPluginEnabled(config: AppConfig, pluginId: string): boolean {
        return config.plugins.enabled.includes(pluginId);
    }
}
