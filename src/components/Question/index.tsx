import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import { db } from '../../services/firebase';

import { Alert } from 'react-native';
import { useToast } from 'native-base';

import {
  ref,
  onValue,
  remove,
  push,
  set,
  update
} from 'firebase/database';

import {
  HStack,
  Avatar,
  Text,
  VStack,
  IconButton,
  Icon,
  Heading
} from 'native-base';


import { EvilIcons } from '@expo/vector-icons';


type QuestionCardProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
  id: string;
}

interface Props {
  data: QuestionCardProps;
  roomKey: string;
  likeId: string;
  likeCount: number;
}


export function Question({ data, roomKey, likeId, likeCount }: Props) {
  const { user } = useAuth();
  const [author, setAuthor] = useState(false);
  const roomId = data.id;
  // const { myRoomId } = useRoom(data);
  const userRoomKey = data.author.name;

  const toast = useToast();

  async function checkRoomId() {

    if (roomId === null) {
      //console.log('Vazio')
    } else {
      try {
        const roomRef = ref(db, `rooms/${roomKey}`)
        onValue(roomRef, (snapshot) => {
          const data = snapshot.val();


          if (data !== null) {
            if (data.authorId === user.id) {

              setAuthor(true)
            }
            //console.log(author)
          } else {

          }
        });
      } catch (error) {
        throw new Error(error);
      }
    }

  }

  async function handleLikeQuestion(questionId: string, likeCount: number, likeId: string | undefined) {

    if (likeId) {
      //remove like
      const newLike = await ref(db, `rooms/${roomKey}/questions/${roomId}/likes/${likeId}`);
      remove(newLike)
    } else {
      const newLike = await ref(db, `rooms/${roomKey}/questions/${roomId}/likes/`)
      const newLikeRef = await push(newLike)
      //console.log(newLikeRef)
      set(newLikeRef, {
        authorId: user.id,
      })
    }
  }

  async function handleCheckQuestion(questionId: string) {
    let setHightlight = !data.isHighlighted

    const questionHighligh = ref(db, `rooms/${roomKey}/questions/${questionId}/`);

    update(questionHighligh, {
      isHighlighted: setHightlight
    })

  }

  async function handleDeleteQuestion(questionId: string) {

    Alert.alert(
      "Alert 🚨.",
      "Are you sure you want to delete this question?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            const question = ref(db, `rooms/${roomKey}/questions/${questionId}/`);
            remove(question);
            handleCallToast();
          }
        }
      ]
    );

  }

  function handleCallToast() {
    toast.show({
      description: "Question successful deleted!"
    })
  }

  useEffect(() => {
    checkRoomId();
  }, [])

  return (
    <VStack w="full"
      p={3}
      borderRadius={7}
      bg={`${data.isHighlighted ? 'isHighlighted.100' : 'white'}`}
      borderWidth={`${data.isHighlighted ? 1 : 0}`}
      mb={3}
      borderColor="isHighlighted.800"
    >
      <VStack p={3}>
        <Text color="gray.500">{data.content}</Text>
      </VStack>
      <HStack w="full" alignItems="center" justifyContent="space-between">
        <HStack justifyContent="center" alignItems="center">
          <Avatar height={10} width={10} source={{
            uri: data.author.avatar
          }} />
          <Text ml={3}>{data.author.name}</Text>
        </HStack>
        {author ? (
          <HStack width="50%"
            justifyContent="space-between"
          >

            <IconButton onPress={() => handleCheckQuestion(data.id)}
              key={data.id}
              icon={<Icon
                as={EvilIcons}
                name={'check'}
              />} borderRadius="full" _icon={{
                color: "gray.500",
                size: "lg"
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

            <IconButton onPress={() => handleLikeQuestion(likeId, likeCount, likeId)}
              // key={data.author.avatar}
              icon={
                <Icon as={EvilIcons} name={'like'} color={likeId ? "isHighlighted.800" : "gray.700"} />
              } borderRadius="full"
              _icon={{
                // color: "gray.800",
                size: "lg"
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
            {likeCount > 0 ?
              (
                <Text pt={3} pl={-1} pr={3}>{likeCount}</Text>
              )
              : (
                <Text></Text>
              )
            }

            <IconButton onPress={() => handleDeleteQuestion(data.id)}
              icon={<Icon
                as={EvilIcons}
                name={'close'}
              />} borderRadius="full" _icon={{
                color: "danger.500",
                size: "lg"
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
        )
          : (
            <HStack width="50%" justifyContent="flex-end">

              <IconButton onPress={() => handleLikeQuestion(likeId, likeCount, likeId)}
                key={data.id}
                icon={
                  <Icon as={EvilIcons} name={'like'} color={likeId ? "isHighlighted.800" : "gray.700"} />
                } borderRadius="full"
                _icon={{
                  // color: "gray.800",
                  size: "lg"
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
              {likeCount > 0 ?
                (
                  <Text pt={3} pl={-1} pr={3}>{likeCount}</Text>
                )
                : (
                  <Text></Text>
                )
              }

            </HStack>
          )

        }
      </HStack>
    </VStack>
  );
}