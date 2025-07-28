import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ConfigProvider, useConfig } from "@/core/config/ConfigProvider";
import { ThemeProvider } from "@/core/theming/ThemeProvider";
import { PluginProvider } from "@/core/plugins/PluginProvider";
import { PluginLoader } from "@/core/plugins/PluginLoader";
import { AppNavigator } from "@/components/navigation/AppNavigator";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import "@/i18n";

// In App.tsx, make sure ConfigProvider is wrapping everything:
const AppContent = () => {
  const { loading, config } = useConfig();
  useAuthInitializer();

  if (loading) {
    return <LoadingScreen />;
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ConfigProvider>
            {/* This should be here */}
            <ThemeProvider>
              <PluginProvider>
                <PluginLoader />
                <AppContent />
                <StatusBar style="auto" />
              </PluginProvider>
            </ThemeProvider>
          </ConfigProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
