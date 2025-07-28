import { forwardRef, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";

interface InputProps extends Omit<TextInputProps, "style"> {
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    variant?: "outline" | "filled";
}

export const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    disabled = false,
    required = false,
    variant,
    placeholder,
    onFocus,
    onBlur,
    ...props
}, ref) => {
    const [focused, setFocused] = useState(false);
    const styles = useStyles("Input", {
        disabled,
        hasError: !!error,
        focused,
        variant,
    });

    const handleFocus = (e: any) => {
        setFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}>*</Text>}
                </Text>
            )}
            <TextInput
                ref={ref}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={styles.placeholder?.color}
                editable={!disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});
