import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { getDatabase, ref, onValue, update, push, remove, off } from 'firebase/database';
import { useAuth } from './auth';
import { Alert } from 'react-native'


type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;

  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }

  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;

  likes: Record<string, {
    authorId: string;
  }>;
}>

interface roomProps {
  title: string;
  key: string;
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTile] = useState('');
  const [getRoom, setGetRoom] = useState<roomProps>({} as roomProps);


  async function handleCheckRoom(roomId: string) {
    if (roomId === null) {
      Alert.alert(roomId)
    } else {
      try {
        const roomRef = ref(db, `rooms/${roomId}`)
        onValue(roomRef, (snapshot) => {
          const data = snapshot.val();

          if (data !== null) {
            setGetRoom(data);
          } else {
            setGetRoom(null)
          }
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  useEffect(() => {
    handleCheckRoom(roomId)
    const roomRef = ref(db, `rooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const databaseRoom = snapshot.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,

          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })


      setTile(databaseRoom.title);
      setQuestions(parseQuestions);

    })
    return () => {
      // roomRef
      // off('');
    }
  }, [roomId, user?.id])

  return (
    {
      questions,
      title,
      getRoom,
      handleCheckRoom
    }
  )
}