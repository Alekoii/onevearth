import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useStyles } from "@/core/theming/useStyles";
import { Icon, IconName } from "@/components/ui/Icon";
import { AuthGuard } from "./AuthGuard";
import { HomeScreen } from "@/screens/main/HomeScreen";
import { SearchScreen } from "@/screens/main/SearchScreen";
import { CreateScreen } from "@/screens/main/CreateScreen";
import { NotificationsScreen } from "@/screens/main/NotificationsScreen";
import { SettingsScreen } from "@/screens/main/SettingsScreen";
import { ProfileScreen } from "@/screens/main/ProfileScreen";
import { PostDetailScreen } from "@/plugins/posts/components/PostDetailScreen";
import { RootStackParamList, TabParamList } from "@/types/navigation";

// Import notification badge (this will be available after plugin is loaded)
import { TabNotificationBadge } from "@/plugins/notifications/components/NotificationBadge";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

interface TabIconProps {
    focused: boolean;
    color: string;
    size: number;
}

const MainTabs = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = useStyles("AppNavigator");
    const insets = useSafeAreaInsets();

    const createTabIcon =
        (iconName: IconName) => ({ focused, color, size }: TabIconProps) => (
            <Icon
                name={iconName}
                color={focused ? theme.colors.primary[500] : color}
                size={size}
                strokeWidth={focused ? 2 : 1.5}
            />
        );

    const createNotificationsTabIcon = (
        { focused, color, size }: TabIconProps,
    ) => (
        <View style={{ position: "relative" }}>
            <Icon
                name="bell"
                color={focused ? theme.colors.primary[500] : color}
                size={size}
                strokeWidth={focused ? 2 : 1.5}
            />
            <TabNotificationBadge />
        </View>
    );

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    ...styles.tabBar,
                    paddingBottom: insets.bottom + 8,
                    height: 60 + insets.bottom + 8,
                },
                tabBarActiveTintColor: theme.colors.primary[500],
                tabBarInactiveTintColor: theme.colors.text.secondary,
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: "500",
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: t("navigation.home"),
                    tabBarIcon: createTabIcon("home"),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    title: t("navigation.search"),
                    tabBarIcon: createTabIcon("search"),
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateScreen}
                options={{
                    title: t("navigation.create"),
                    tabBarIcon: createTabIcon("plus"),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    title: t("navigation.notifications"),
                    tabBarIcon: createNotificationsTabIcon,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: t("settings.title"),
                    tabBarIcon: createTabIcon("settings"),
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    const { theme } = useTheme();

    return (
        <NavigationContainer>
            <AuthGuard>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: theme.colors.surface.primary,
                            borderBottomColor: theme.colors.border.primary,
                        },
                        headerTintColor: theme.colors.text.primary,
                        headerTitleStyle: {
                            fontWeight: "600",
                            fontSize: theme.typography.fontSize.lg,
                        },
                        headerBackTitle: "",
                    }}
                >
                    <Stack.Screen
                        name="MainTabs"
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            title: "Profile",
                            headerStyle: {
                                backgroundColor: theme.colors.surface.primary,
                            },
                        }}
                    />
                    <Stack.Screen
                        name="PostDetail"
                        component={PostDetailScreen}
                        options={({ navigation }) => ({
                            title: "Post",
                            headerStyle: {
                                backgroundColor: theme.colors.surface.primary,
                            },
                        })}
                    />
                </Stack.Navigator>
            </AuthGuard>
        </NavigationContainer>
    );
};
