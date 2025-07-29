# OneVEarth Social Network

A **plugin-first** social network built with React Native Expo where all
features are modular and configurable. Core provides infrastructure (auth,
theming, plugin management) while social features (posts, comments, reactions)
are implemented as plugins.

## Architecture Philosophy

- **Plugin-First**: Even basic features like posts/comments are plugins
- **Configuration-Driven**: Everything controlled by admin config
- **Theme Separation**: Complete styling isolation with comprehensive theming
- **TypeScript**: Full type safety throughout
- **Accessibility Built-in**: Non-bypassable accessibility features

## Tech Stack

- **Frontend**: React Native Expo, TypeScript
- **State**: Redux Toolkit with dynamic plugin reducers
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Theming**: Custom theme system with light/dark modes
- **Navigation**: React Navigation with plugin extensions
- **Internationalization**: i18next

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
    │   └── plugins/          # Enhanced Plugin System
    │       ├── PluginManager.ts     # Core plugin lifecycle
    │       ├── ServiceRegistry.ts   # Service registry
    │       ├── PluginReduxIntegration.ts # Redux integration
    │       ├── ExtensionPoint.tsx   # UI extension points
    │       ├── PluginProvider.tsx   # React context
    │       ├── PluginLoader.tsx     # Plugin loading
    │       ├── EventEmitter.ts      # Plugin communication
    │       └── types.ts
    ├── 
    ├── components/           # Reusable UI components
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
    ├── store/               # Redux store
    │   ├── index.ts         # Store configuration with dynamic reducers
    │   └── slices/
    │       ├── authSlice.ts
    │       ├── configSlice.ts
    │       └── usersSlice.ts
    ├── 
    ├── types/               # TypeScript type definitions
    │   ├── posts.ts
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
    └── 
    └── plugins/             # Plugin implementations
        └── posts/           # Posts plugin (example)
            ├── index.ts     # Plugin definition
            ├── components/  # Plugin components
            │   ├── PostCard.tsx
            │   ├── PostCreator.tsx
            │   ├── PostList.tsx
            │   └── PostDetailScreen.tsx
            ├── services/    # Plugin services
            │   └── PostService.ts
            ├── store/       # Plugin state
            │   ├── postsSlice.ts
            │   └── selectors.ts
            ├── hooks/       # Plugin hooks
            │   └── usePosts.ts
            └── types/       # Plugin types
                └── index.ts
```

## Database Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### 2. Run Database Migration

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

The schema includes:

**Core Tables**:

- `profiles` - User profiles and metadata
- `posts` - User posts with visibility controls
- `comments` - Nested comments system
- `post_reactions` - Reaction system
- `followers` - Follow relationships
- `notifications` - Real-time notifications

**Advanced Features**:

- `groups` - Group functionality
- `emotions` - Emotion tagging
- `hashtags` - Hashtag system with trending
- `media_attachments` - File uploads
- `blocks` - User blocking
- `reports` - Content moderation
- `user_preferences` - User settings
- `app_configuration` - Admin configuration

### 3. Configure Environment

Create environment configuration:

```typescript
// Update src/core/api/SupabaseClient.ts
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
```

The migrations in `supabase/migrations/` include:

**Core Tables**:

- `profiles` - User profiles and metadata
- `posts` - User posts with visibility controls
- `comments` - Nested comments system
- `post_reactions` - Reaction system
- `followers` - Follow relationships
- `notifications` - Real-time notifications

**Advanced Features**:

- `groups` - Group functionality
- `emotions` - Emotion tagging
- `hashtags` - Hashtag system with trending
- `media_attachments` - File uploads
- `blocks` - User blocking
- `reports` - Content moderation
- `user_preferences` - User settings
- `app_configuration` - Admin configuration

### 4. Configure Environment

Create environment configuration:

```typescript
// Update src/core/api/SupabaseClient.ts
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
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

### Plugin Development Example

```typescript
// src/plugins/posts/index.ts
export const PostsPlugin: EnhancedPlugin = {
    id: "posts",
    name: "Posts",
    version: "1.0.0",
    description: "Core posting functionality",
    author: "OneVEarth Team",

    services: {
        PostService: PostService,
    },

    reducers: {
        posts: postsReducer,
    },

    components: {
        PostCard: PostCard,
        PostList: PostList,
        PostCreator: PostCreator,
    },

    async install(api) {
        api.registerService("PostService", PostService);
        api.registerReducer("posts", postsReducer);
        api.registerComponent("PostCard", PostCard);
    },

    async activate(api) {
        api.registerExtension("home.content", PostList, 100);
        api.registerExtension("create.content", PostCreator, 100);

        api.subscribeToEvent("user:login", (user) => {
            console.log("Posts plugin: User logged in");
        });
    },
};
```

### Extension Points

The app provides extension points throughout the UI:

```typescript
// Use in components
<ExtensionPoint
    name="home.content"
    maxExtensions={5}
    filterBy={{ tags: ["featured"], minPriority: 10 }}
    fallback={DefaultContent}
/>;
```

Available extension points:

- `home.content` - Home screen content
- `create.content` - Create screen content
- `post.actions` - Post action buttons
- `post.header` - Post header elements
- `profile.header` - Profile header
- `profile.content` - Profile sections

### Service Registry

Plugins register services for cross-plugin communication:

```typescript
// Register service
api.registerService("PostService", PostService);

// Use service in other plugins
const { getService } = useEnhancedPlugins();
const postService = getService<PostService>("PostService");
```

## Installation & Setup

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

### Plugin Development Example

```typescript
// src/plugins/posts/index.ts
export const PostsPlugin: EnhancedPlugin = {
    id: "posts",
    name: "Posts",
    version: "1.0.0",
    description: "Core posting functionality",
    author: "OneVEarth Team",

    services: {
        PostService: PostService,
    },

    reducers: {
        posts: postsReducer,
    },

    components: {
        PostCard: PostCard,
        PostList: PostList,
        PostCreator: PostCreator,
    },

    async install(api) {
        api.registerService("PostService", PostService);
        api.registerReducer("posts", postsReducer);
        api.registerComponent("PostCard", PostCard);
    },

    async activate(api) {
        api.registerExtension("home.content", PostList, 100);
        api.registerExtension("create.content", PostCreator, 100);

        api.subscribeToEvent("user:login", (user) => {
            console.log("Posts plugin: User logged in");
        });
    },
};
```

### Extension Points

The app provides extension points throughout the UI:

```typescript
// Use in components
<ExtensionPoint
    name="home.content"
    maxExtensions={5}
    filterBy={{ tags: ["featured"], minPriority: 10 }}
    fallback={DefaultContent}
/>;
```

Available extension points:

- `home.content` - Home screen content
- `create.content` - Create screen content
- `post.actions` - Post action buttons
- `post.header` - Post header elements
- `profile.header` - Profile header
- `profile.content` - Profile sections

### Service Registry

Plugins register services for cross-plugin communication:

```typescript
// Register service
api.registerService("PostService", PostService);

// Use service in other plugins
const { getService } = useEnhancedPlugins();
const postService = getService<PostService>("PostService");
```

## Installation & Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd onevearth
npm install

# Install Supabase CLI for database management
npm install -g supabase
```

### 2. Environment Setup

Configure your Supabase credentials in `src/core/api/SupabaseClient.ts`

### 3. Database Migration

Run the provided SQL schema in your Supabase project

### 4. Configure App

Edit `src/core/config/appConfig.ts`:

```typescript
export const defaultAppConfig: AppConfig = {
    plugins: {
        enabled: [
            "posts", // Enable posts plugin
            // "comments",  // Uncomment to enable
            // "reactions", // Uncomment to enable
        ],
        config: {
            posts: {
                maxLength: 280,
                allowMedia: true,
                requireModeration: false,
            },
        },
    },
};
```

### 5. Local Development (Optional)

For local development with Supabase:

```bash
# Start local Supabase instance
supabase start

# This will provide local URLs for development
# Update your SupabaseClient.ts to use local URLs when in development
```

## Development

### Run Development Server

```bash
# Start Expo development server
npm start

# Run on specific platforms
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

### Plugin Development Workflow

1. **Create Plugin Structure**:

```
src/plugins/my-plugin/
├── index.ts              # Plugin definition
├── components/           # React components
├── services/            # Business services
├── store/               # Redux slice
└── types/               # TypeScript types
```

2. **Implement Plugin**:

```typescript
export const MyPlugin: EnhancedPlugin = {
    id: "my-plugin",
    name: "My Plugin",
    version: "1.0.0",
    // ... implementation
};
```

3. **Register Plugin**:

```typescript
// Add to src/core/plugins/PluginLoader.tsx
const availablePlugins = {
    posts: PostsPlugin,
    "my-plugin": MyPlugin, // Add here
};
```

4. **Enable in Config**:

```typescript
// src/core/config/appConfig.ts
plugins: {
    enabled: ["posts", "my-plugin"];
}
```

### Theme Customization

```typescript
// Customize themes in src/themes/presets/
export const customTheme = customizeLightTheme({
    primaryColor: "#DB00FF",
    secondaryColor: "#6D6D6D",
    accentColor: "#00DBFF",
    borderRadius: "rounded",
    spacing: "normal",
});
```

### Adding Extension Points

```tsx
// In any component
<ExtensionPoint
    name="my.extension.point"
    customProp="value"
    fallback={DefaultComponent}
/>;
```

## Configuration

### App Configuration

Main config in `src/core/config/appConfig.ts`:

```typescript
export const defaultAppConfig: AppConfig = {
    app: {
        name: "OneVearth",
        version: "1.0.0",
        environment: "development",
    },

    features: {
        posts: {
            enabled: true,
            allowPhotos: true,
            maxLength: 280,
            requireModeration: false,
        },

        comments: {
            enabled: true,
            allowNested: true,
            maxDepth: 3,
        },
    },

    ui: {
        theme: {
            name: "default",
            allowUserThemes: true,
            darkModeDefault: false,
        },

        navigation: {
            type: "tabs",
            showLabels: true,
        },
    },

    plugins: {
        enabled: ["posts"],
        config: {
            posts: {
                maxLength: 280,
                allowMedia: true,
            },
        },
    },
};
```

### User Preferences

Users can override certain settings:

- Theme selection (light/dark/auto)
- Language preferences
- Accessibility settings
- Notification preferences

## Current Status

### ✅ Implemented

- Enhanced plugin system with lifecycle management
- Service registry with dependency injection
- Redux integration with dynamic reducers
- Extension points with filtering
- Complete theming system
- Authentication flow
- Database schema
- Configuration system
- Internationalization

### 🏗️ In Progress

- Posts plugin (core functionality)
- Navigation integration with extension points

### 📋 Planned

- Comments plugin
- Reactions plugin
- Notifications plugin
- Groups plugin
- Media upload plugin

## Development Commands

```bash
# Start development server
npm start

# Run on platforms
npm run ios
npm run android
npm run web

# Database commands
supabase db reset          # Reset local database
supabase db push           # Push migrations to remote
supabase db pull           # Pull schema from remote
supabase gen types typescript --local > src/types/database.ts

# Type checking
npx tsc --noEmit

# Clear cache
npx expo start --clear
```

## Plugin API Reference

### Plugin Lifecycle

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

### Event System

```typescript
// Emit events
api.emitEvent("post:created", { postId: post.id });
api.emitEvent("user:activity", { type: "post_create" });

// Listen to events
api.subscribeToEvent("post:created", (data) => {
    console.log("New post:", data.postId);
});
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Follow the plugin development workflow
4. Ensure TypeScript compliance
5. Test thoroughly
6. Submit pull request

## License

MIT License - see LICENSE file for details
