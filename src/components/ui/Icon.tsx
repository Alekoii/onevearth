import {
    ArrowLeft,
    ArrowRight,
    Attachment,
    Bell,
    Camera,
    ChatBubble,
    Check,
    EditPencil,
    Heart,
    Home,
    MediaImage,
    Menu,
    Plus,
    Search,
    Settings,
    ShareAndroid,
    Trash,
    User,
    VideoCamera,
    Xmark,
} from "iconoir-react-native";

interface IconProps {
    name: IconName;
    color?: string;
    size?: number;
    strokeWidth?: number;
}

export type IconName =
    | "home"
    | "search"
    | "plus"
    | "bell"
    | "user"
    | "heart"
    | "comment"
    | "share"
    | "settings"
    | "menu"
    | "arrow-left"
    | "arrow-right"
    | "check"
    | "x"
    | "edit"
    | "trash"
    | "camera"
    | "image"
    | "video"
    | "paperclip";

const iconMap = {
    home: Home,
    search: Search,
    plus: Plus,
    bell: Bell,
    user: User,
    heart: Heart,
    comment: ChatBubble,
    share: ShareAndroid,
    settings: Settings,
    menu: Menu,
    "arrow-left": ArrowLeft,
    "arrow-right": ArrowRight,
    check: Check,
    x: Xmark,
    edit: EditPencil,
    trash: Trash,
    camera: Camera,
    image: MediaImage,
    video: VideoCamera,
    paperclip: Attachment,
};

export const Icon = ({
    name,
    color = "#000000",
    size = 24,
    strokeWidth = 1.5,
}: IconProps) => {
    const IconComponent = iconMap[name];

    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent
            color={color}
            width={size}
            height={size}
            strokeWidth={strokeWidth}
        />
    );
};
