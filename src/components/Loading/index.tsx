import { Center, Spinner } from "native-base";

export function Loading() {
  return (
    <Center flex={1} bg="primary.700">
      <Spinner color="background.50" size="lg" />
    </Center>
  );
}