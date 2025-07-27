import { View } from "react-native";
import { FeedLayout } from "@/components/layouts/FeedLayout";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";

export const HomeScreen = () => {
    return (
        <FeedLayout>
            <ExtensionPoint name="home.content" />
        </FeedLayout>
    );
};
