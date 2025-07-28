import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/core/theming/useStyles";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";

export const HomeScreen = () => {
    const styles = useStyles("Screen");
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.base, { paddingTop: insets.top }]}>
            <ExtensionPoint name="home.content" />
        </View>
    );
};
