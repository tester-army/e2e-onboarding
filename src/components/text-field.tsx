import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors, type } from '@/constants/theme';

type TextFieldProps = TextInputProps & { label: string };

export function TextField({ label, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={[type.labelXs, styles.label]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.caret}
        style={[type.field, styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { color: colors.textFaint },
  input: {
    height: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.fieldStroke,
    backgroundColor: colors.fieldFill,
    color: colors.textBright,
  },
});
