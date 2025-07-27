import { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useComponentStyles } from "@/core/theming/useComponentStyles";
import { inputStyles } from "./Input.styles";

interface InputProps extends Omit<TextInputProps, "style"> {
    label?: string;
    error?: string;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    variant = "primary",
    size = "md",
    disabled = false,
    required = false,
    placeholder,
    ...props
}, ref) => {
    const styles = useComponentStyles("Input", inputStyles, {
        variant,
        size,
        disabled,
        hasError: !!error,
    });

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
                accessibilityLabel={label}
                accessibilityHint={error}
                accessibilityState={{ disabled }}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});
