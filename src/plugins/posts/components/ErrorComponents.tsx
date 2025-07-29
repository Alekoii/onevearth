import { Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/base/Button";
import { PostListErrorProps } from "../types";

export const PostListError = ({ error, onRetry, type }: PostListErrorProps) => {
    const styles = useStyles("PostList");
    const { t } = useTranslation();

    if (type === "pagination") {
        return (
            <View style={[styles.footerLoader, { padding: 16 }]}>
                <View style={{ alignItems: "center" }}>
                    <Icon name="x" size={20} color="#EF4444" />
                    <Text
                        style={{
                            fontSize: 14,
                            color: "#EF4444",
                            textAlign: "center",
                            marginVertical: 8,
                        }}
                    >
                        Failed to load more posts
                    </Text>
                    <TouchableOpacity
                        onPress={onRetry}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            backgroundColor: "#F3F4F6",
                            borderRadius: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#374151",
                                fontWeight: "500",
                            }}
                        >
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.emptyContainer, { justifyContent: "center" }]}>
            <Icon name="x" size={48} color="#EF4444" />
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#111827",
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 8,
                }}
            >
                Something went wrong
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    marginBottom: 24,
                    paddingHorizontal: 32,
                }}
            >
                {error}
            </Text>
            <Button onPress={onRetry} variant="primary">
                {t("common.retry")}
            </Button>
        </View>
    );
};

export const NetworkError = ({ onRetry }: { onRetry: () => void }) => {
    const styles = useStyles("PostList");
    const { t } = useTranslation();

    return (
        <View style={styles.emptyContainer}>
            <Icon name="x" size={48} color="#F59E0B" />
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#111827",
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 8,
                }}
            >
                Connection Problem
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    marginBottom: 24,
                    paddingHorizontal: 32,
                }}
            >
                Check your internet connection and try again
            </Text>
            <Button onPress={onRetry} variant="primary">
                {t("common.retry")}
            </Button>
        </View>
    );
};

export const EmptyPostsState = () => {
    const styles = useStyles("PostList");

    return (
        <View style={styles.emptyContainer}>
            <Icon name="user" size={48} color="#9CA3AF" />
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#111827",
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 8,
                }}
            >
                No posts yet
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    paddingHorizontal: 32,
                }}
            >
                Be the first to share something with the community
            </Text>
        </View>
    );
};

export const RefreshError = ({ onRetry }: { onRetry: () => void }) => {
    return (
        <View
            style={{
                backgroundColor: "#FEF2F2",
                borderLeftWidth: 4,
                borderLeftColor: "#EF4444",
                padding: 12,
                margin: 16,
                borderRadius: 8,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="x" size={20} color="#EF4444" />
                <Text
                    style={{
                        fontSize: 14,
                        color: "#991B1B",
                        fontWeight: "500",
                        marginLeft: 8,
                        flex: 1,
                    }}
                >
                    Failed to refresh posts
                </Text>
                <TouchableOpacity
                    onPress={onRetry}
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: "#EF4444",
                        borderRadius: 6,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            color: "white",
                            fontWeight: "500",
                        }}
                    >
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
