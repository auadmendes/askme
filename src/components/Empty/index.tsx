import React from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  VStack,
  Heading,
  HStack,
  IconButton,
  Icon,
  StatusBar,
  Text
} from 'native-base';


import QuestionImage from '../../assets/empty-questions.svg';

import { AntDesign } from '@expo/vector-icons';

export function Empty() {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      w="full"
      h="full"
      bg="details.200"
      flex={1}
      p={3}
      borderRadius={30}
    // borderTopRightRadius={30}
    // borderTopLeftRadius={30}
    >
      <StatusBar barStyle='dark-content' />
      <HStack w="full" alignItems="flex-start">
        <IconButton
          onPress={handleGoBack}
          icon={<Icon as={AntDesign} name="arrowleft" />} borderRadius="full" _icon={{
            color: "danger.500",
            size: "lg"
          }} _hover={{
            bg: "pink.400:alpha.20"
          }} _pressed={{
            bg: "pink.400:alpha.20",
            _icon: {
              name: "emoji-flirt"
            },
            _ios: {
              _icon: {
                size: "2xl"
              }
            }
          }} _ios={{
            _icon: {
              size: "2xl"
            }
          }} />
      </HStack>
      <VStack h="80%" display="flex-start" justifyContent="space-between" alignItems="center">

        <Heading mb={4} color="muted.600" fontSize="lg" fontFamily="heading">
          Desculpe!
        </Heading>

        <Text fontSize="xs" fontFamily="heading" color="muted.600" mt={2} mb={2}>
          Nôs não encontramos a sua sala. {'\n'}
          Ela pode não existir, ou ter sido desativada.
        </Text>
        <QuestionImage />
      </VStack>
    </VStack>
  );
}