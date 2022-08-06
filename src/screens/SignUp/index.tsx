import React from 'react';

import { Platform } from 'react-native';

import { Center, Heading, VStack, Text, Button, KeyboardAvoidingView, Input, Box } from 'native-base';

export function SignUp() {
  return (
    <KeyboardAvoidingView h={{
      base: "400px",
      lg: "auto"
    }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <VStack flex={1}>
        <Box w="full" h="500" bg="yellow.200">
          <Heading>Text</Heading>
        </Box>
        <Box>
          <Input />
          <Button>Entrar</Button>
        </Box>
      </VStack>
    </KeyboardAvoidingView>
  );
}