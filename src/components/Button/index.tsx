import { Button as ButtonNativeBase, Heading, IButtonProps } from 'native-base';

type Props = IButtonProps & {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase
      colorScheme="purple"
      size={14}
      width="full"

      {...rest}
    >
      <Heading
        color="background.50"
        fontFamily="heading"
        fontSize="md">
        {title}
      </Heading>
    </ButtonNativeBase>
  );
}