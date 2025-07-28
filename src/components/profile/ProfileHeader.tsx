// src/components/profile/ProfileHeader.tsx

import { Image, Text, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { Icon } from "@/components/ui/Icon";
import { ExtensionPoint } from "@/core/plugins/ExtensionPoint";

interface UserProfile {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    isVerified: boolean;
}

interface ProfileHeaderProps {
    profile: UserProfile;
    isCurrentUser?: boolean;
}

export const ProfileHeader = (
    { profile, isCurrentUser = false }: ProfileHeaderProps,
) => {
    const styles = useStyles("ProfileHeader");
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.avatarSection}>
                {profile.avatarUrl
                    ? (
                        <Image
                            source={{ uri: profile.avatarUrl }}
                            style={styles.avatar}
                        />
                    )
                    : (
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="user" size={40} color="#6D6D6D" />
                        </View>
                    )}

                <View style={styles.userInfo}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.displayName}>
                            {profile.fullName || profile.username}
                        </Text>
                        {profile.isVerified && (
                            <Icon name="check" size={16} color="#1DA1F2" />
                        )}
                    </View>

                    <Text style={styles.username}>
                        @{profile.username}
                    </Text>
                </View>
            </View>

            {profile.bio && (
                <Text style={styles.bio}>
                    {profile.bio}
                </Text>
            )}

            <View style={styles.metadata}>
                {profile.location && (
                    <View style={styles.metadataItem}>
                        <Icon name="home" size={14} color="#6D6D6D" />
                        <Text style={styles.metadataText}>
                            {profile.location}
                        </Text>
                    </View>
                )}

                {profile.website && (
                    <View style={styles.metadataItem}>
                        <Icon name="paperclip" size={14} color="#6D6D6D" />
                        <Text style={styles.metadataText}>
                            {profile.website}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {profile.postCount.toLocaleString()}
                    </Text>
                    <Text style={styles.statLabel}>
                        {t("profile.posts")}
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {profile.followerCount.toLocaleString()}
                    </Text>
                    <Text style={styles.statLabel}>
                        {t("profile.followers")}
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {profile.followingCount.toLocaleString()}
                    </Text>
                    <Text style={styles.statLabel}>
                        {t("profile.following")}
                    </Text>
                </View>
            </View>

            <ExtensionPoint
                name="profile.header.actions"
                profile={profile}
                isCurrentUser={isCurrentUser}
            />
        </View>
    );
};
