import {
    ArrowLeft,
    ArrowRight,
    Bell,
    Camera,
    Check,
    Edit3,
    Heart,
    Home,
    Image,
    Menu,
    MessageCircle,
    Paperclip,
    Plus,
    Search,
    Settings,
    Share,
    Trash2,
    User,
    Video,
    X,
} from "lucide-react-native";

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
    comment: MessageCircle,
    share: Share,
    settings: Settings,
    menu: Menu,
    "arrow-left": ArrowLeft,
    "arrow-right": ArrowRight,
    check: Check,
    x: X,
    edit: Edit3,
    trash: Trash2,
    camera: Camera,
    image: Image,
    video: Video,
    paperclip: Paperclip,
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
            size={size}
            strokeWidth={strokeWidth}
        />
    );
};
