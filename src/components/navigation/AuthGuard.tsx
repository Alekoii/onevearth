import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginScreen } from "@/screens/auth/LoginScreen";

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const { user } = useAuth();

    if (!user) {
        return <LoginScreen />;
    }

    return <>{children}</>;
};
