import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { AppConfig } from "@/core/config/types";
import { ConfigManager } from "@/core/config/ConfigManager";

interface ConfigContextType {
    config: AppConfig;
    loading: boolean;
    error: Error | null;
    isFeatureEnabled: (feature: string) => boolean;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within ConfigProvider");
    }
    return context;
};

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

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<AppConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const configData = await ConfigManager.load();
            setConfig(configData);
        } catch (err) {
            setError(err as Error);
            setConfig(defaultConfig);
        } finally {
            setLoading(false);
        }
    };

    const isFeatureEnabled = (feature: string): boolean => {
        const parts = feature.split(".");
        let current: any = config.features;

        for (const part of parts) {
            if (!current?.[part]) return false;
            current = current[part];
        }

        return current === true;
    };

    return (
        <ConfigContext.Provider
            value={{
                config,
                loading,
                error,
                isFeatureEnabled,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};
