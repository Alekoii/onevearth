import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { AppConfig, ConfigContextType, ValidationResult } from "./types";
import { ConfigManager } from "./ConfigManager";

const ConfigContext = createContext<ConfigContextType | null>(null);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within ConfigProvider");
    }
    return context;
};

interface ConfigProviderProps {
    children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
    const [config, setConfig] = useState<AppConfig>(ConfigManager.getDefault());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadConfiguration();
    }, []);

    const loadConfiguration = async () => {
        try {
            setLoading(true);
            setError(null);
            const configData = await ConfigManager.load();
            setConfig(configData);
        } catch (err) {
            const error = err as Error;
            setError(error);
            console.error("Failed to load configuration:", error);
            // Fall back to default config
            setConfig(ConfigManager.getDefault());
        } finally {
            setLoading(false);
        }
    };

    const updateConfig = (updates: Partial<AppConfig>) => {
        try {
            // For code-based config, we only allow user preference updates
            // The main configuration is in code

            // Merge updates with current config (in memory only)
            const newConfig = deepMerge(config, updates);

            // Validate before applying
            const validation = ConfigManager.validate(newConfig);
            if (!validation.valid) {
                throw new Error(
                    `Configuration validation failed: ${
                        validation.errors.join(", ")
                    }`,
                );
            }

            // Update local state
            setConfig(newConfig);
            setError(null);

            // Save certain user preferences to local storage
            // (like theme preferences, accessibility settings)
            if (updates.ui?.theme || updates.ui?.accessibility) {
                Object.entries(updates).forEach(([key, value]) => {
                    if (key === "ui") {
                        Object.entries(value as any).forEach(
                            ([subKey, subValue]) => {
                                if (
                                    subKey === "theme" ||
                                    subKey === "accessibility"
                                ) {
                                    ConfigManager.saveLocalOverride(
                                        `${key}.${subKey}`,
                                        subValue,
                                    );
                                }
                            },
                        );
                    }
                });
            }
        } catch (err) {
            const error = err as Error;
            setError(error);
            throw error;
        }
    };

    const isFeatureEnabled = (feature: string): boolean => {
        return ConfigManager.isFeatureEnabled(config, feature);
    };

    const getPluginConfig = (pluginId: string): any => {
        return ConfigManager.getPluginConfig(config, pluginId);
    };

    const validateConfig = (
        configToValidate: Partial<AppConfig>,
    ): ValidationResult => {
        return ConfigManager.validate(configToValidate);
    };

    const value: ConfigContextType = {
        config,
        loading,
        error,
        updateConfig,
        isFeatureEnabled,
        getPluginConfig,
        validateConfig,
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
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
