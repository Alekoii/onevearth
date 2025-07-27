import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    text: {
        marginTop: 16,
        color: "#6D6D6D",
        fontSize: 16,
    },
});

export const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#DB00FF" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
};
