import { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useStyles } from "@/core/theming/useStyles";

interface InputProps extends Omit<TextInputProps, "style"> {
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    disabled = false,
    required = false,
    placeholder,
    ...props
}, ref) => {
    const styles = useStyles("Input", { disabled, hasError: !!error });

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
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});
