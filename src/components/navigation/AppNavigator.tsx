import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { appNavigatorStyles } from "./AppNavigator.styles";
import { Icon, IconName } from "@/components/ui/Icon";
import { AuthGuard } from "./AuthGuard";
import { HomeScreen } from "@/screens/main/HomeScreen";
import { SearchScreen } from "@/screens/main/SearchScreen";
import { CreateScreen } from "@/screens/main/CreateScreen";
import { NotificationsScreen } from "@/screens/main/NotificationsScreen";
import { ProfileScreen } from "@/screens/main/ProfileScreen";

const Tab = createBottomTabNavigator();

interface TabIconProps {
    focused: boolean;
    color: string;
    size: number;
}

export const AppNavigator = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = useComponentStyles("AppNavigator", appNavigatorStyles);

    const createTabIcon =
        (iconName: IconName) => ({ focused, color, size }: TabIconProps) => (
            <Icon
                name={iconName}
                color={focused ? theme.colors.primary[500] : color}
                size={size}
            />
        );

    return (
        <NavigationContainer>
            <AuthGuard>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: styles.tabBar,
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
                            tabBarIcon: createTabIcon("bell"),
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            title: t("navigation.profile"),
                            tabBarIcon: createTabIcon("user"),
                        }}
                    />
                </Tab.Navigator>
            </AuthGuard>
        </NavigationContainer>
    );
};
