import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "@/screens/main/HomeScreen";
import { ProfileScreen } from "@/screens/main/ProfileScreen";
import { useTranslation } from "@/hooks/useTranslation";

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    const { t } = useTranslation();

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: t("navigation.home"),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        title: t("navigation.profile"),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
