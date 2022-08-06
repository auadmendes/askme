import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/auth';

import { useNavigation } from '@react-navigation/native';

import { db } from '../../services/firebase';
import { ref, onValue, get } from 'firebase/database';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Modalize } from 'react-native-modalize';

import {
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

import {
  VStack,
  Heading,
  Box,
  FormControl,
  Icon,
  IconButton,
  Link,
  Text,
  HStack,
  KeyboardAvoidingView
} from 'native-base';

import Logo from '../../assets/askMe.svg';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Empty } from '../../components/Empty';

import { Entypo, Feather } from '@expo/vector-icons';

interface roomProps {
  id: string;
}

export function NewRoom() {
  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  const myAsyncStoragedRoom = '@askme:room';
  const [getRoomCode, setGetRoomCode] = useState('');
  const modalizerRef = useRef(null);
  //const { questions, title } = useRoom(user.id)

  function handleLogOut() {
    signOut();
  }

  function goBackPage() {
    navigation.goBack();
  }

  async function handleCheckRoom() {
    try {
      if (!getRoomCode) {
        Alert.alert('Por favor, insira o código da sala')
        return;
      }

      const roomRefKey = ref(db, `rooms/${getRoomCode}`)
      const keyRoom = get(roomRefKey)
      console.log('Result Page New Room KEY..... ' + keyRoom)

      if (!(await keyRoom).exists()) {
        handleOpenModal();
      } else {
        const roomRef = ref(db, `rooms/${getRoomCode}`)

        onValue(roomRef, (snapshot) => {
          const data = snapshot.val();

          if (data !== null) {
            navigation.navigate('Room', {
              roomId: getRoomCode
            });

          } else {
            navigation.navigate('Room', {
              roomId: getRoomCode
            });
          }
        });

      }
    } catch (error) {
      Alert.alert('Não encontramos esta sala. Ela pode não existir ou ter sido desativada! 🙁 ' + error)
      throw new Error(error)
    }
  }

  function handleOpenModal() {
    modalizerRef.current?.open();
  }

  return (
    <KeyboardAvoidingView
      h={{
        base: "400px",
        lg: "auto"
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack alignItems="center" w="full" bg="background.800" >
          <Box bg="details.500" w="full">
            <VStack w="full" alignItems="flex-end">
              <IconButton onPress={handleLogOut} mt={10} mr={2} icon={<Icon as={Feather} name="log-out" />}
                borderRadius="full" _icon={{
                  color: "background.50",
                  size: "md"
                }} _hover={{
                  bg: "pink.600:alpha.20"
                }} _pressed={{
                  bg: "pink.600:alpha.20",
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
            </VStack>
            <VStack w="full" alignItems="center" justifyContent="center">
              <Logo />
            </VStack>
            <Heading
              alignContent="center"
              color="background.50"
              mb={5}
              p={5}
            >
              Type or paste the {'\n'}
              room code
            </Heading>
          </Box>
          <Box w="full" >
            <VStack p={5} h="full" bg="background.200">
              <FormControl>
                <Input
                  mb={3}
                  placeholder='Room code'
                  height="12"
                  borderWidth={1}
                  bg="background.50"
                  borderColor="background.300"
                  onChangeText={setGetRoomCode}
                  value={getRoomCode}
                  InputLeftElement={
                    <Icon
                      as={<Entypo name='code' />}
                      size={5}
                      ml={2}
                      color="muted.400"
                    />
                  }
                />
                <Button onPress={handleCheckRoom} title='Join' />
                <HStack mt={4}>
                  <Text>Create your own room. </Text>

                  <Link
                    fontSize="lg"
                    onPress={goBackPage}
                  >
                    <Text color="attention.400">Click here.</Text>
                  </Link>
                </HStack>
              </FormControl>
            </VStack>
          </Box>
        </VStack>

      </TouchableWithoutFeedback>
      <Modalize
        ref={modalizerRef}
        snapPoint={280}
        modalHeight={280}
        modalStyle={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30
        }}
      // handleStyle={{
      //   borderTopRightRadius: 200,
      //   backgroundColor: '#ff0000'
      // }}
      >
        <Empty />
      </Modalize>
    </KeyboardAvoidingView>
  );
}