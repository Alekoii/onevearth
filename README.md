# OneVEarth Social Network

A **plugin-first** social network built with React Native Expo where all features are modular and configurable. Core provides infrastructure (auth, theming, plugin management) while social features (posts, comments, reactions) are implemented as plugins.

## Architecture Philosophy

- **Plugin-First**: Even basic features like posts/comments are plugins
- **Configuration-Driven**: Everything controlled by admin config
- **Theme Separation**: Complete styling isolation with comprehensive theming
- **TypeScript**: Full type safety throughout
- **Accessibility Built-in**: Non-bypassable accessibility features

## Tech Stack

- **Frontend**: React Native Expo 53, TypeScript
- **State**: Redux Toolkit with dynamic plugin reducers
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Theming**: Custom theme system with light/dark modes
- **Navigation**: React Navigation v7 with plugin extensions
- **Internationalization**: i18next
- **Icons**: Lucide React Native

## Project Structure

```
onevearth/
├── App.tsx                   # Main app component with providers
├── index.ts                  # Entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── metro.config.js           # Metro bundler configuration
├── tsconfig.json             # TypeScript configuration
├── 
├── supabase/
│   └── migrations/           # Database migration files
│       └── 20250727173433_remote_schema.sql
├── 
└── src/
    ├── core/                 # Core infrastructure
    │   ├── api/
    │   │   └── SupabaseClient.ts
    │   ├── config/           # Configuration system
    │   │   ├── ConfigProvider.tsx
    │   │   ├── ConfigManager.ts
    │   │   ├── appConfig.ts  # Main app configuration
    │   │   └── types.ts
    │   ├── theming/          # Theme system
    │   │   ├── ThemeProvider.tsx
    │   │   ├── useStyles.ts  # Theme hook
    │   │   ├── ThemeCustomizer.ts
    │   │   └── types.ts
    │   ├── plugins/          # Enhanced Plugin System
    │   │   ├── PluginManager.ts     # Core plugin lifecycle
    │   │   ├── ServiceRegistry.ts   # Service registry
    │   │   ├── PluginReduxIntegration.ts # Redux integration
    │   │   ├── ExtensionPoint.tsx   # UI extension points
    │   │   ├── PluginProvider.tsx   # React context
    │   │   ├── PluginLoader.tsx     # Plugin loading
    │   │   ├── EventEmitter.ts      # Plugin communication
    │   │   └── types.ts
    │   └── services/
    │       └── AuthService.ts
    ├── 
    ├── store/               # Redux store
    │   ├── index.ts         # Store configuration with dynamic reducers
    │   └── slices/
    │       ├── authSlice.ts
    │       ├── configSlice.ts
    │       └── usersSlice.ts
    ├── 
    ├── types/               # TypeScript type definitions
    │   ├── posts.ts
    │   ├── navigation.ts
    │   └── database.ts      # Generated from Supabase
    ├── 
    ├── i18n/                # Internationalization
    │   ├── index.ts         # i18n configuration
    │   └── types.ts
    ├── 
    ├── locales/             # Translation files
    │   ├── en.json
    │   └── es.json
    ├── 
    ├── themes/              # Theme system
    │   ├── base/
    │   │   └── baseTheme.ts
    │   ├── presets/         # Pre-built themes
    │   │   ├── lightTheme.ts
    │   │   └── darkTheme.ts
    │   └── components/      # Component styling
    │       └── createComponentStyles.ts
    ├── 
    ├── components/          # Reusable UI components
    │   ├── base/            # Base UI components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   └── Input.tsx
    │   ├── navigation/      # Navigation components
    │   │   ├── AppNavigator.tsx
    │   │   └── AuthGuard.tsx
    │   ├── ui/              # UI utilities
    │   │   ├── Icon.tsx
    │   │   └── LoadingScreen.tsx
    │   └── profile/         # Profile components
    │       └── ProfileHeader.tsx
    ├── 
    ├── screens/             # Main app screens
    │   ├── auth/
    │   │   └── LoginScreen.tsx
    │   └── main/
    │       ├── HomeScreen.tsx
    │       ├── SearchScreen.tsx
    │       ├── CreateScreen.tsx
    │       ├── NotificationsScreen.tsx
    │       ├── SettingsScreen.tsx
    │       └── ProfileScreen.tsx
    ├── 
    ├── hooks/               # Custom React hooks
    │   ├── index.ts         # Hook exports
    │   ├── useAppDispatch.ts
    │   ├── useAppSelector.ts
    │   ├── useAuth.ts
    │   ├── useAuthInitializer.ts
    │   ├── useLocale.ts
    │   ├── usePosts.ts
    │   ├── useProfile.ts
    │   └── useTranslation.ts
    ├── 
    ├── services/            # Business logic services
    │   └── AuthService.ts
    ├── 
    └── plugins/             # Plugin implementations
        ├── posts/           # Posts plugin
        │   ├── index.ts     # Plugin definition
        │   ├── components/  # Plugin components
        │   │   ├── PostCard.tsx
        │   │   ├── PostCreator.tsx
        │   │   ├── PostList.tsx
        │   │   └── PostDetailScreen.tsx
        │   ├── services/    # Plugin services
        │   │   └── PostService.ts
        │   ├── store/       # Plugin state
        │   │   ├── postsSlice.ts
        │   │   └── selectors.ts
        │   ├── hooks/       # Plugin hooks
        │   │   └── usePosts.ts
        │   └── types/       # Plugin types
        │       └── index.ts
        ├── comments/        # Comments plugin
        │   ├── index.ts
        │   ├── components/
        │   │   ├── CommentItem.tsx
        │   │   ├── CommentList.tsx
        │   │   ├── CommentCreator.tsx
        │   │   └── CommentActionButton.tsx
        │   ├── services/
        │   │   └── CommentService.ts
        │   ├── store/
        │   │   └── commentsSlice.ts
        │   ├── hooks/
        │   │   └── useComments.ts
        │   └── types/
        │       └── index.ts
        └── notifications/   # Notifications plugin
            ├── index.ts
            ├── components/
            │   └── NotificationBadge.tsx
            ├── services/
            │   └── NotificationService.ts
            ├── store/
            │   └── notificationsSlice.ts
            └── hooks/
                └── useNotifications.ts
```

## Installation & Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd onevearth
npm install
```

### 2. Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Create new Supabase project at https://supabase.com
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### 3. Environment Configuration

Update `src/core/api/SupabaseClient.ts` with your Supabase credentials:

```typescript
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
```

### 4. Configure Plugins

Edit `src/core/config/appConfig.ts` to enable desired plugins:

```typescript
export const defaultAppConfig: AppConfig = {
    plugins: {
        enabled: [
            "posts",        // ✅ Implemented
            "comments",     // ✅ Implemented  
            "notifications" // ✅ Implemented
        ],
        config: {
            posts: {
                maxLength: 280,
                allowMedia: true,
                requireModeration: false,
            },
            comments: {
                allowNested: true,
                maxDepth: 3,
                allowEditing: true,
            },
        },
    },
};
```

## Development

### Run Development Server

```bash
# Start Expo development server
npm start

# Run on platforms
npm run ios
npm run android
npm run web
```

### Database Development

```bash
# Start local Supabase instance
supabase start

# Create new migration
supabase migration new your_migration_name

# Apply migrations locally
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts

# Push to production
supabase db push
```

## Plugin System Architecture

### Enhanced Plugin Interface

```typescript
interface EnhancedPlugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;

    // Dependencies
    dependencies?: string[];
    peerDependencies?: string[];
    conflicts?: string[];

    // UI Components
    components?: Record<string, ComponentType<any>>;
    screens?: Record<string, ComponentType<any>>;

    // State Management
    reducers?: Record<string, Reducer<any, any>>;
    middleware?: Middleware[];

    // Services
    services?: Record<string, any>;

    // Lifecycle hooks
    install?: (api: EnhancedPluginAPI) => Promise<void>;
    activate?: (api: EnhancedPluginAPI) => Promise<void>;
    deactivate?: (api: EnhancedPluginAPI) => Promise<void>;
    uninstall?: (api: EnhancedPluginAPI) => Promise<void>;
}
```

### Plugin API Reference

```typescript
interface EnhancedPluginAPI {
    // UI Registration
    registerComponent(name: string, component: ComponentType<any>): void;
    registerScreen(name: string, screen: ComponentType<any>): void;
    registerExtension(
        point: string,
        component: ComponentType<any>,
        priority?: number,
    ): void;

    // State Management
    registerReducer(name: string, reducer: Reducer<any, any>): void;
    registerMiddleware(middleware: Middleware): void;

    // Services
    registerService(name: string, service: any): void;
    getService<T>(name: string): T | null;

    // Events
    subscribeToEvent(event: string, handler: Function): void;
    emitEvent(event: string, data?: any): void;

    // Configuration
    getPluginConfig(pluginId?: string): any;
    updatePluginConfig(config: any): Promise<void>;

    // Store Access
    getStore(): Store;
}
```

### Extension Points

Available extension points throughout the app:

- `home.content` - Home screen content
- `create.content` - Create screen content  
- `post.actions` - Post action buttons
- `post.detail.comments` - Post detail comments section
- `post.detail.actions` - Post detail action buttons
- `profile.header` - Profile header elements
- `profile.content` - Profile content sections

Usage example:
```tsx
<ExtensionPoint
    name="home.content"
    maxExtensions={5}
    fallback={DefaultContent}
    customProp="value"
/>
```

### Event System

Cross-plugin communication via events:

```typescript
// Emit events
api.emitEvent("post:created", { postId: post.id });
api.emitEvent("user:login", { userId: user.id });

// Listen to events  
api.subscribeToEvent("post:created", (data) => {
    console.log("New post:", data.postId);
});
```

## Plugin Development Workflow

### 1. Create Plugin Structure

```
src/plugins/my-plugin/
├── index.ts              # Plugin definition
├── components/           # React components
├── services/            # Business services  
├── store/               # Redux slice
├── hooks/               # Custom hooks
└── types/               # TypeScript types
```

### 2. Implement Plugin

```typescript
export const MyPlugin: EnhancedPlugin = {
    id: "my-plugin",
    name: "My Plugin", 
    version: "1.0.0",
    description: "Plugin description",
    author: "Your Name",

    services: {
        MyService: MyService,
    },

    reducers: {
        myPlugin: myPluginReducer,
    },

    components: {
        MyComponent: MyComponent,
    },

    async install(api) {
        api.registerService("MyService", MyService);
        api.registerReducer("myPlugin", myPluginReducer);
        api.registerComponent("MyComponent", MyComponent);
    },

    async activate(api) {
        api.registerExtension("home.content", MyComponent, 100);
        
        api.subscribeToEvent("user:login", (user) => {
            console.log("My plugin: User logged in");
        });
    },
};
```

### 3. Register Plugin

Add to `src/core/plugins/PluginLoader.tsx`:

```typescript
const availablePlugins = {
    posts: PostsPlugin,
    comments: CommentsPlugin,  
    notifications: NotificationsPlugin,
    "my-plugin": MyPlugin, // Add here
};
```

### 4. Enable in Configuration

Update `src/core/config/appConfig.ts`:

```typescript
plugins: {
    enabled: ["posts", "comments", "notifications", "my-plugin"]
}
```

## Database Schema

The Supabase migration includes comprehensive tables:

**Core Tables:**
- `profiles` - User profiles and metadata
- `posts` - User posts with visibility controls
- `comments` - Nested comments system
- `post_reactions` - Reaction system  
- `followers` - Follow relationships
- `notifications` - Real-time notifications

**Advanced Features:**
- `groups` - Group functionality
- `emotions` - Emotion tagging
- `hashtags` - Hashtag system with trending
- `media_attachments` - File uploads
- `blocks` - User blocking
- `reports` - Content moderation
- `user_preferences` - User settings
- `app_configuration` - Admin configuration
- `moderation_queue` - Content moderation workflow

## Theme System

### Custom Theme Creation

```typescript
// src/themes/presets/customTheme.ts
export const customTheme = customizeLightTheme({
    primaryColor: "#DB00FF",
    secondaryColor: "#6D6D6D", 
    accentColor: "#00DBFF",
    borderRadius: "rounded",
    spacing: "normal",
});
```

### Theme Usage in Components

```typescript
const { theme } = useTheme();
const styles = useStyles("ComponentName");

// Access theme values
theme.colors.primary[500]
theme.typography.fontSize.lg
theme.spacing.md
```

## Configuration System

### App Configuration

Environment-specific configuration with development and production overrides:

```typescript
// Development config
const developmentConfig: Partial<AppConfig> = {
    app: {
        environment: "development",
    },
    features: {
        comments: {
            requireApproval: false,
            allowEditing: true,
        },
    },
};

// Production config  
const productionConfig: Partial<AppConfig> = {
    app: {
        environment: "production", 
    },
    moderation: {
        autoModeration: true,
        toxicityFiltering: {
            enabled: true,
            threshold: 0.8,
        },
    },
};
```

### User Preferences

Users can override settings:
- Theme selection (light/dark/auto)
- Language preferences
- Accessibility settings
- Notification preferences

## Current Status

### ✅ Implemented

- **Core Infrastructure**
  - Enhanced plugin system with lifecycle management
  - Service registry with dependency injection
  - Redux integration with dynamic reducers
  - Extension points with filtering and priorities
  - Complete theming system with light/dark modes
  - Authentication flow with Supabase
  - Comprehensive database schema
  - Configuration system with environment overrides
  - Internationalization with i18next

- **Navigation**
  - Tab-based navigation (Home, Search, Create, Notifications, Settings)
  - Stack navigation for detail screens
  - Auth guards and protected routes

- **Plugins**
  - **Posts Plugin**: Full posting functionality with media support
  - **Comments Plugin**: Nested comments with threading
  - **Notifications Plugin**: Real-time notifications with badges

### 🏗️ In Progress

- Media upload and processing
- Real-time features (live updates, typing indicators)
- Advanced moderation tools
- Push notifications

### 📋 Planned Features

- **Reactions Plugin**: Like, love, laugh reactions
- **Groups Plugin**: Community groups and discussions  
- **Search Plugin**: Advanced search with filters
- **Messages Plugin**: Direct messaging
- **Media Plugin**: Advanced media handling
- **Analytics Plugin**: Usage analytics and insights

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Follow TypeScript and plugin development patterns
4. Keep files under 200 lines when possible
5. No verbose code or unnecessary comments
6. Test thoroughly on all platforms
7. Submit pull request

## Development Guidelines

- **TypeScript**: Full type safety required
- **File Size**: Keep files under ~200 lines
- **Code Style**: Concise, readable code without verbose comments
- **Plugin Architecture**: Follow established plugin patterns
- **Theming**: Use theme system for all styling
- **Accessibility**: Ensure accessibility compliance

## License

MIT License - see LICENSE file for details