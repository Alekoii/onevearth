export interface ModerationConfig {
    autoModeration: boolean;
    humanReview: boolean;
    appealProcess: boolean;
    content: {
        textFiltering: boolean;
        imageModeration: boolean;
        videoModeration: boolean;
        audioModeration: boolean;
    };
    awsRekognition: {
        enabled: boolean;
        confidence: number;
        labels: string[];
        customLabels: boolean;
    };
    toxicityFiltering: {
        enabled: boolean;
        threshold: number;
        provider: "perspective" | "aws-comprehend";
    };
    spamDetection: {
        enabled: boolean;
        aiPowered: boolean;
        rateLimiting: boolean;
    };
}

export interface AnalyticsConfig {
    enabled: boolean;
    trackingLevel: "basic" | "detailed" | "full";
    shareWithPlugins: boolean;
    userConsent: boolean;
}

export interface PremiumConfig {
    enabled: boolean;
    features: string[];
    trialPeriod: number;
    gracePeriod: number;
}

export interface PrivacyConfig {
    dataRetention: number;
    allowDataExport: boolean;
    allowAccountDeletion: boolean;
    cookieConsent: boolean;
    gdprCompliant: boolean;
}

export interface SecurityConfig {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordComplexity: PasswordRules;
    rateLimiting: RateLimitConfig;
}

export interface PasswordRules {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
}

export interface RateLimitConfig {
    posts: { count: number; window: number };
    comments: { count: number; window: number };
    messages: { count: number; window: number };
}

export interface UIConfig {
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
    animations: {
        enabled: boolean;
        reducedMotion: boolean;
        duration: number;
    };
    accessibility: {
        screenReader: boolean;
        highContrast: boolean;
        largeText: boolean;
        voiceNavigation: boolean;
    };
}

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
            allowEmbeds: boolean;
            maxLength: number;
            requireModeration: boolean;
            allowScheduling: boolean;
            allowEditing: boolean;
            editTimeLimit: number;
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
            allowSubGroups: boolean;
        };
        messaging: {
            enabled: boolean;
            allowGroupMessages: boolean;
            maxParticipants: number;
            fileSharing: boolean;
            readReceipts: boolean;
        };
        premium: PremiumConfig;
        notifications: {
            push: boolean;
            email: boolean;
            inApp: boolean;
            digestFrequency: "none" | "daily" | "weekly";
        };
    };
    plugins: {
        enabled: string[];
        config: Record<string, any>;
        marketplace: {
            enabled: boolean;
            allowThirdParty: boolean;
            requireApproval: boolean;
        };
    };
    theme: {
        name: string;
        customizations: ThemeOverrides;
        allowUserThemes: boolean;
        darkModeDefault: boolean;
    };
    moderation: ModerationConfig;
    ui: UIConfig;
    privacy: PrivacyConfig;
    analytics: AnalyticsConfig;
    security: SecurityConfig;
}

export interface ReactionType {
    id: string;
    name: string;
    emoji: string;
    description?: string;
    customIcon?: string;
}

export interface ThemeOverrides {
    colors?: Partial<ColorPalette>;
    typography?: Partial<Typography>;
    spacing?: Partial<SpacingSystem>;
    borderRadius?: Partial<BorderRadiusSystem>;
}

export interface ColorPalette {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    info: ColorScale;
    neutral: ColorScale;
}

export interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface Typography {
    fontFamily: {
        primary: string;
        secondary: string;
        monospace: string;
    };
    fontSize: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
        "3xl": number;
        "4xl": number;
    };
    fontWeight: {
        normal: string;
        medium: string;
        semibold: string;
        bold: string;
    };
    lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
    };
    letterSpacing: {
        tight: number;
        normal: number;
        wide: number;
    };
}

export interface SpacingSystem {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
    "4xl": number;
}

export interface BorderRadiusSystem {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
}
