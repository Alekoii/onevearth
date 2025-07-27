// src/components/profile/ProfileHeader.tsx
import { Text, View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { profileHeaderStyles } from "./ProfileHeader.styles";

interface ProfileHeaderProps {
    profile: {
        username: string;
        bio?: string;
        postCount: number;
        followerCount: number;
        followingCount: number;
    };
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const styles = useComponentStyles("ProfileHeader", profileHeaderStyles);

    return (
        <View style={styles.container}>
            <View style={styles.avatar} />
            <Text style={styles.username}>@{profile.username}</Text>
            {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{profile.postCount}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                        {profile.followerCount}
                    </Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                        {profile.followingCount}
                    </Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>
        </View>
    );
};
