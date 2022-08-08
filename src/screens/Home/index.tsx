import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import { db } from '../../services/firebase';
import { ref, set, push } from 'firebase/database';

import AsyncStorage from "@react-native-async-storage/async-storage";

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
  Avatar,
  KeyboardAvoidingView
} from 'native-base';

import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import Logo from '../../assets/askImage.svg';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface RoomProps {
  user: string;
  roomId: string;
}

export function Home() {
  const navigation = useNavigation()
  const [room, setRoom] = useState('');
  const myAsyncStoragedRoom = '@askme:room';
  const [storageRoomAsync, setStorageRoomAsync] = useState<RoomProps>({} as RoomProps);
  const { signOut, user } = useAuth();

  function handleLogOut() {
    signOut();
  }

  function goToNewRoom() {
    navigation.navigate('NewRoom', {
      roomId: 'test'
    });
  }

  async function handleNewRoom() {

    if (room === '') {
      Alert.alert('Your forgot to name your Room 😅')
    } else {
      const roomRef = ref(db, 'rooms');
      const newRoomRef = await push(roomRef);
      set(newRoomRef, {
        authorId: user.id,
        title: room
      });
      setRoom('');

      const storageRoom = {
        roomId: newRoomRef.key,
        userId: user.id
      }

      await AsyncStorage.setItem(myAsyncStoragedRoom, JSON.stringify(storageRoom));

      navigation.navigate('Room', {
        roomId: newRoomRef.key,
      });
    }
  }

  async function getStorageRoom() {
    const roomStorageInfo = await AsyncStorage.getItem(myAsyncStoragedRoom)

    if (roomStorageInfo) {
      const roomStoraged = JSON.parse(roomStorageInfo) as RoomProps;
      setStorageRoomAsync(roomStoraged);

      //await console.log('Guardado ' + JSON.stringify(storageRoomAsync.roomId))
      console.log(roomStoraged.roomId)


      navigation.navigate('Room', {
        roomId: roomStoraged.roomId,
      });

    } else {
      console.log(roomStorageInfo)
    }

  }

  useEffect(() => {
    //AsyncStorage.removeItem(myAsyncStoragedRoom)
    getStorageRoom();
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack alignContent="center" h="full" w="full" bg="background.200">
        <Box bg="primary.700">
          <VStack alignItems="flex-end">
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
          <VStack mt={-8} h="90">
            <Logo />
          </VStack>
          <Heading
            alignContent="center"
            color="background.50"
            mb={5}
            p={5}
          >
            Every question has {'\n'}
            an answer
          </Heading >
          <HStack ml={5} mb={2} alignItems="center">
            <Avatar source={{ uri: user.photo }} />
            <Text ml={3} color="background.50" fontFamily="heading">{user.name}</Text>
          </HStack>

        </Box>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          h={{
            base: "200px",
            lg: "auto"
          }}
        >
          <VStack flex={1} w="full" bg="background.200" justifyContent="center" alignContent="center">

            <Box pl={5} pr={3}>
              <Heading mb={5} color="background.800" fontFamily="heading">Create a room</Heading>
              <FormControl>
                <Input
                  placeholder='Room name'
                  height="12"
                  borderWidth={1}
                  bg="background.50"
                  borderColor="background.300"
                  InputLeftElement={
                    <Icon
                      as={<MaterialIcons name='question-answer' />}
                      size={5}
                      ml={2}
                      color="muted.400"
                    />
                  }
                  value={room}
                  onChangeText={setRoom}
                />

              </FormControl>
            </Box>

          </VStack>
        </KeyboardAvoidingView>
        <VStack mb={20} p={3} mt={-7}>
          <Button title='Create' onPress={handleNewRoom} />
          <HStack mt={4}>
            <Text>Join to an existent room </Text>

            <Link
              fontSize="lg"
              onPress={goToNewRoom}
            >
              <Text color="attention.400">Click here.</Text>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </TouchableWithoutFeedback >
  );
}