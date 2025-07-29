import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { PostCardSkeletonProps } from "../types";

const SkeletonBox = ({ width, height, style }: {
    width: number | string;
    height: number;
    style?: any;
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ]),
        );

        animation.start();
        return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 4,
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const PostCardSkeleton = (
    { variant = "default" }: PostCardSkeletonProps,
) => {
    const styles = useStyles("PostCard", { variant });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <SkeletonBox
                        width={40}
                        height={40}
                        style={{ borderRadius: 20 }}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <SkeletonBox
                            width="60%"
                            height={16}
                            style={{ marginBottom: 4 }}
                        />
                        <SkeletonBox width="40%" height={12} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <SkeletonBox
                    width="100%"
                    height={16}
                    style={{ marginBottom: 8 }}
                />
                <SkeletonBox
                    width="80%"
                    height={16}
                    style={{ marginBottom: 8 }}
                />
                <SkeletonBox width="60%" height={16} />
            </View>

            <View style={styles.actions}>
                <View style={styles.defaultActions}>
                    <SkeletonBox
                        width={60}
                        height={20}
                        style={{ marginRight: 24 }}
                    />
                    <SkeletonBox
                        width={60}
                        height={20}
                        style={{ marginRight: 24 }}
                    />
                    <SkeletonBox width={40} height={20} />
                </View>
            </View>
        </View>
    );
};

export const PostListSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <>
            {Array.from(
                { length: count },
                (_, index) => <PostCardSkeleton key={`skeleton-${index}`} />,
            )}
        </>
    );
};

export const PaginationLoadingSkeleton = () => {
    const styles = useStyles("PostList");

    return (
        <View style={[styles.footerLoader, { padding: 16 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <SkeletonBox
                    width={20}
                    height={20}
                    style={{ borderRadius: 10, marginRight: 8 }}
                />
                <SkeletonBox width={80} height={16} />
            </View>
        </View>
    );
};

export const CompactPostSkeleton = () => {
    const styles = useStyles("PostCard", { variant: "compact" });

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <SkeletonBox
                    width={32}
                    height={32}
                    style={{ borderRadius: 16, marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 4,
                        }}
                    >
                        <SkeletonBox
                            width="40%"
                            height={14}
                            style={{ marginRight: 8 }}
                        />
                        <SkeletonBox width="20%" height={12} />
                    </View>
                    <SkeletonBox
                        width="100%"
                        height={14}
                        style={{ marginBottom: 4 }}
                    />
                    <SkeletonBox width="70%" height={14} />
                </View>
            </View>
        </View>
    );
};
