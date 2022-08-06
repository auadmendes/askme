import { Input as NativeBaseInput, IInputProps } from 'native-base';

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="background.200"
      h={14}

      size="md"
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      placeholderTextColor="gray.300"
      _focus={{
        borderWidth: 1,
        borderColor: 'tooltip.400',
        bg: 'gray.300'
      }}
      {...rest}
    />
  );
}