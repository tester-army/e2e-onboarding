import { useState } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors, space, type } from '@/constants/theme';

type TextFieldProps = TextInputProps & { label: string; invalid?: boolean };

export function TextField({ label, invalid = false, style, onFocus, onBlur, ...props }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={[type.caption, styles.label]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.neutral500}
        selectionColor={colors.green}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[type.bodyM, styles.input, focused && styles.focused, invalid && styles.invalid, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space(1) },
  label: { color: colors.neutral400 },
  input: {
    height: space(7),
    paddingHorizontal: space(2),
    borderWidth: 2,
    borderColor: colors.neutral800,
    backgroundColor: colors.neutral800,
    color: colors.offWhite,
  },
  focused: { borderColor: colors.green },
  invalid: { borderColor: colors.mint },
});
