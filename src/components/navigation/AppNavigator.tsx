import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/core/theming/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { appNavigatorStyles } from "./AppNavigator.styles";
import { HomeScreen } from "@/screens/main/HomeScreen";
import { SearchScreen } from "@/screens/main/SearchScreen";
import { CreateScreen } from "@/screens/main/CreateScreen";
import { NotificationsScreen } from "@/screens/main/NotificationsScreen";
import { ProfileScreen } from "@/screens/main/ProfileScreen";
import {
    BellIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    UserIcon,
} from "react-native-heroicons/outline";
import {
    BellIcon as BellIconSolid,
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    PlusIcon as PlusIconSolid,
    UserIcon as UserIconSolid,
} from "react-native-heroicons/solid";

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
        (OutlineIcon: any, SolidIcon: any) =>
        ({ focused, color, size }: TabIconProps) => {
            const Icon = focused ? SolidIcon : OutlineIcon;
            return <Icon color={color} size={size} />;
        };

    return (
        <NavigationContainer>
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
                        tabBarIcon: createTabIcon(HomeIcon, HomeIconSolid),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        title: t("navigation.search"),
                        tabBarIcon: createTabIcon(
                            MagnifyingGlassIcon,
                            MagnifyingGlassIconSolid,
                        ),
                    }}
                />
                <Tab.Screen
                    name="Create"
                    component={CreateScreen}
                    options={{
                        title: t("navigation.create"),
                        tabBarIcon: createTabIcon(PlusIcon, PlusIconSolid),
                    }}
                />
                <Tab.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                    options={{
                        title: t("navigation.notifications"),
                        tabBarIcon: createTabIcon(BellIcon, BellIconSolid),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        title: t("navigation.profile"),
                        tabBarIcon: createTabIcon(UserIcon, UserIconSolid),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
