import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import { Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';

import {
  Center,
  Box,
  Heading,
  Link,
  FormControl,
  VStack,
  Icon,
  Checkbox,
  Text,
  WarningOutlineIcon,
  StatusBar
} from 'native-base';

import { Alert } from 'react-native';

import Logo from '../../assets/askMe.svg';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';


export function SigIn() {
  const { signWithGoogle, signInWithApple } = useAuth();
  const navigation = useNavigation();

  function handleAlert() {
    Alert.alert('Not implemented yet.')
    //navigation.navigate('SignUp')
  }

  function handleSignInWithGoogle() {
    try {
      signWithGoogle();
    } catch (error) {
      Alert.alert(error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Center
        bg="background.300"
        height="full"
      >
        <StatusBar barStyle='dark-content' />
        <VStack mb={12}>
          <Logo />
        </VStack>
        <VStack width="full" paddingX={10}>

          <Box width="full">
            <Heading
              color="purple.500"
              mb={8}
            >
              Login
            </Heading>

            <FormControl>
              <Input
                placeholder="your-name@email.com"
                mb={2}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name='person' />}
                    size={5}
                    ml={2}
                    color="muted.400"
                  />
                }
              />
              <FormControl.ErrorMessage mb={5} leftIcon={<WarningOutlineIcon size="xs" />}>
                Wrong email
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Password'
                height="12"
                secureTextEntry
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name='lock' />}
                    size={5}
                    ml={2}
                    color="muted.400"
                  />
                }
              />
            </FormControl>
            <Button mt={5} tintColor="background.50" title="Log In" />

            <Button
              onPress={handleSignInWithGoogle}
              mt={5}
              bg="blue.600:alpha.90"
              title="Log In with Google"
              leftIcon={
                <Icon
                  as={<AntDesign name='google' />}
                  size={7}
                  ml={2}
                  color="primary.50"
                />
              } />
            {Platform.OS === 'ios' && (
              <Button mt={2}
                onPress={signInWithApple}
                bg="gray.600:alpha.90"
                title="Log In with Apple"
                leftIcon={
                  <Icon
                    as={<AntDesign name='apple1' />}
                    size={7}
                    ml={2}
                    color="primary.50"
                  />
                } />
            )}

          </Box>
          <Checkbox
            value='agree'
            background="purple.400"
            size="sm"
            mt={2}
          >
            <Text fontSize="sm" color="gray.600">I agree with the terms and use.</Text>
          </Checkbox>
          <Link
            fontSize="lg"
            color="primary.700"
            mt={2}
            onPress={handleAlert}
          >
            Don't have an account, create one.
          </Link>
        </VStack>

      </Center >
    </TouchableWithoutFeedback>
  );
}