import { AppConfig } from "@/core/config/types";
import { supabase } from "@/core/api/SupabaseClient";

const defaultConfig: AppConfig = {
    app: {
        name: "Social Network",
        version: "1.0.0",
        environment: "development",
    },
    features: {
        posts: {
            enabled: true,
            allowPhotos: true,
            maxLength: 280,
        },
        reactions: {
            enabled: true,
            types: ["like", "love", "laugh", "angry"],
        },
        premium: {
            enabled: false,
        },
    },
    plugins: {
        enabled: ["posts", "emotions"],
    },
};

export class ConfigManager {
    static async load(): Promise<AppConfig> {
        try {
            const { data, error } = await supabase
                .from("app_configuration")
                .select("key, value")
                .eq("is_public", true);

            if (error) throw error;
            if (!data || data.length === 0) return defaultConfig;

            const config = { ...defaultConfig };

            data.forEach(({ key, value }) => {
                const keys = key.split(".");
                let current: any = config;

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current = current[keys[i]];
                }

                current[keys[keys.length - 1]] = value;
            });

            return config as AppConfig;
        } catch (error) {
            console.warn(
                "Failed to load config from database, using defaults:",
                error,
            );
            return defaultConfig;
        }
    }

    static getDefault(): AppConfig {
        return { ...defaultConfig };
    }
}
