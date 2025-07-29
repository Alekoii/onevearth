import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Icon } from "@/components/ui/Icon";

interface PostWithCommentCount {
    id: number;
    _count?: {
        comments?: number;
    };
}

interface CommentActionButtonProps {
    post: PostWithCommentCount;
}

export function CommentActionButton({ post }: CommentActionButtonProps) {
    const handleCommentPress = () => {
        console.log("Navigate to comments for post:", post.id);
        // This would typically navigate to the post detail screen
        // or open a comments modal
    };

    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 24,
            }}
            onPress={handleCommentPress}
        >
            <Icon name="comment" size={20} color="#6D6D6D" />
            <Text
                style={{
                    fontSize: 14,
                    color: "#6D6D6D",
                    marginLeft: 4,
                    fontWeight: "500",
                }}
            >
                {post._count?.comments || 0}
            </Text>
        </TouchableOpacity>
    );
}
