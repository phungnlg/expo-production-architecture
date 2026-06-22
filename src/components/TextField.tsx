import { colors, radius, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type IconName = keyof typeof MaterialIcons.glyphMap;

/** Labelled text input with leading icon + error slot. Consistent form fields. */
export function TextField({
  label,
  error,
  icon,
  multiline,
  ...inputProps
}: { label: string; error?: string; icon?: IconName } & TextInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          focused && styles.focused,
          !!error && styles.errorBorder,
        ]}
      >
        {icon ? (
          <MaterialIcons
            name={icon}
            size={20}
            color={focused ? colors.primary : colors.outline}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          placeholderTextColor={colors.outline}
          multiline={multiline}
          {...inputProps}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.sm, marginLeft: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  fieldMultiline: { height: undefined, alignItems: 'flex-start', paddingVertical: spacing.md },
  icon: { marginRight: spacing.md },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  inputMultiline: { minHeight: 96, textAlignVertical: 'top' },
  focused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  errorBorder: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs, marginLeft: 2 },
});
