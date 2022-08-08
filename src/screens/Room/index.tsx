import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth';
import { useRoom } from '../../hooks/useRoom';
import { useNavigation } from '@react-navigation/native';

import { getBottomSpace } from 'react-native-iphone-x-helper';
import { db } from '../../services/firebase';
import { ref, onValue, set, push } from 'firebase/database';

import AsyncStorage from "@react-native-async-storage/async-storage";


import {
  Alert,
  Share,
  Keyboard,
  FlatList,
  Platform
} from 'react-native';

import {
  VStack,
  Heading,
  Text,
  HStack,
  IconButton,
  Icon,
  Box,
  TextArea,
  Center,
  Spinner,
  StatusBar
} from 'native-base';

import Logo from '../../assets/askMe.svg'
import { Button } from '../../components/Button';
import { Empty } from '../../components/Empty';
import { Question } from '../../components/Question';

import { EvilIcons, Entypo } from '@expo/vector-icons';



export function Room({ route }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { roomId } = route.params;
  const { user } = useAuth();
  const { handleCheckRoom, getRoom } = useRoom(roomId);

  const myAsyncStoragedRoom = '@askme:room';
  const navigation = useNavigation();

  const shareIcon = {
    icon: Platform.OS === 'ios' ? 'EvilIcons' : 'Entypo',
    iconName: Platform.OS === 'ios' ? 'share-apple' : 'share',
  }

  const { questions, title } = useRoom(roomId);

  async function handleQuestion() {

    if (newQuestion.trim() === '') {
      return;
    }
    if (!user) {
      //throw new Error(toast.error('Nenhum usuário'));
    }

    setIsLoading(true)
    const roomRef = ref(db, `rooms/${roomId}/questions`);
    const neoQuestion = await push(roomRef);
    set(neoQuestion, {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.photo,
      },
      isHighlighted: false,
      isAnswered: false,
    });

    setNewQuestion('');
    setIsLoading(false);
  }

  async function handleShareRoom() {
    try {
      if (Platform.OS === 'android') {
        const result = await Share.share({
          title: 'Check my App',
          //message: 'Hi I am using the Askme App, get into my Room!',
          message: `Oi Eu criei uma sala para perguntas ${'\n'} Código da dala: *${roomId}* ${'\n'}Ou click no link abaixo 👇 ${'\n'} https://letmeask-dfffa.web.app/rooms/${roomId}`
          //message: `${roomId}`
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } else {
        const result = await Share.share({
          title: 'Askme',
          message: `Código da sala: ${roomId}`,
          url: `https://letmeask-dfffa.web.app/rooms/${roomId}`
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      }

    } catch (error) {
      Alert.alert(error)
    }
  }

  async function clearAsyncRoom() {
    AsyncStorage.removeItem(myAsyncStoragedRoom)
    navigation.navigate('NewRoom')
  }

  function handleLeaveRoom() {
    Alert.alert(
      "Sair da sala.",
      "Você realmente quer sair da sala?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: clearAsyncRoom }
      ]
    );
  }

  async function checkRoom() {
    if (!roomId) {
      await handleCheckRoom(roomId);
    }
  }


  useEffect(() => {
    checkRoom()
  }, [])

  return (
    <Center flex={1} h="full" alignItems="center" bg="background.300">
      <VStack p={2}>
        <StatusBar barStyle='dark-content' translucent />
        {getRoom === null ? <Empty /> :
          <VStack flex={1} safeArea>

            <HStack justifyContent="space-between" alignItems="center" pl={3} pr={3}>
              <Logo height={50} />
              <HStack
                justifyContent="space-between"
                alignItems="center"
                //borderWidth={1}
                //borderColor="tooltip.400"
                p={1}
                borderRadius={3}
              >
                {/* <Text fontFamily="body">{roomId}</Text> */}
                <IconButton onPress={handleShareRoom}
                  icon={<Icon
                    as={Platform.OS === 'ios' ? EvilIcons : Entypo}
                    name={shareIcon.iconName}
                  />} borderRadius="full" _icon={{
                    color: "tooltip.400",
                    size: "2xl"
                  }} _hover={{
                    bg: "danger.600:alpha.20"
                  }} _pressed={{
                    bg: "danger.600:alpha.20",
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
            </HStack>
            <VStack w="full" mt={4} borderWidth={1} borderColor="gray.300" />
            <VStack>
              <HStack p={3} alignItems="center" justifyContent="space-between">
                <HStack>
                  <Heading fontFamily="heading">
                    {getRoom.title}
                  </Heading>
                  <Box ml={5} p={1} pl={2} pr={2} bg="tooltip.400" borderRadius={40}>
                    <Text color="white">{questions.length} perguntas</Text>
                  </Box>
                </HStack>
                <Button
                  onPress={handleLeaveRoom}
                  bg="alert.600"
                  width={100}
                  height={7}
                  title='Sair da sala'
                />
              </HStack>
            </VStack>

            <VStack p={3}>
              <TextArea
                autoCompleteType="off"
                h={90}
                bg="white"
                borderColor="gray.300"
                placeholder="O que você deseja perguntar?"
                w="100%"
                maxW="100%"
                onChangeText={setNewQuestion}
                value={newQuestion}
              />
              <HStack w="full" mt={3} justifyContent="space-between" alignItems="center">
                <Logo height={20} />
                <VStack>
                  {!isLoading ? (
                    <Button
                      onPress={handleQuestion}
                      title='Enviar pergunta'
                      w={200}
                      height={10}
                    />
                  ) :
                    (
                      <HStack
                        alignItems="center"
                        w={200}
                        height={10}
                      >
                        <Spinner accessibilityLabel="Loading posts" color="attention.400" />
                        <Heading color="attention.400" pl={3} fontSize="md">
                          sending
                        </Heading>
                      </HStack>
                    )
                  }

                </VStack>
              </HStack>
            </VStack>

            {questions.length > 0 ? (

              <FlatList

                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: getBottomSpace(),
                  paddingHorizontal: 10
                }}
                data={questions}
                keyExtractor={item => item.id}
                renderItem={({ item }) =>
                  <Question
                    data={item}
                    roomKey={roomId}
                    likeId={item.likeId}
                    likeCount={item.likeCount} />
                }
              />

            ) : <VStack justifyContent="center" alignItems="center" h="full">
              <Spinner size="lg" color="primary.700" />
            </VStack>}

          </VStack>
        }
      </VStack>
    </Center>
  );
}
