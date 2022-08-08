import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect
} from 'react';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  }
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);


function AuthProvider({ children }: AuthProviderProps) {
  const [userStorageLoading, setUserStorageLoading] = useState(true);
  const [user, setUser] = useState<User>({} as User)
  const userAsyncStorage = '@askme:user';
  const userAppleAsyncStorage = '@askme:userApple';

  async function signWithGoogle() {
    try {

      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

      const { type, params } = await AuthSession
        .startAsync({ authUrl }) as AuthorizationResponse;

      if (type === 'success') {
        const response =
          await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)

        const userInfo = await response.json()

        const userLogged = {
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture
        }
        setUser(userLogged);

        await AsyncStorage.setItem(userAsyncStorage, JSON.stringify(userLogged));
      }

    } catch (error) {

    }
  }

  async function signInWithApple() {
    const userStoraged = await AsyncStorage.getItem(userAppleAsyncStorage)
    if (userStoraged) {


      const userLogged = JSON.parse(userStoraged) as User;
      setUser(userLogged);

      await AsyncStorage.setItem(userAsyncStorage, JSON.stringify(userLogged));

    } else {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ]
        });

        if (credential) {
          const name = credential.fullName?.givenName!
          const photo = `https://ui-avatars.com/api/?name=${name}&length=1`
          const userLogged = {
            id: credential.user,
            name,
            email: credential.email,
            photo
          }
          setUser(userLogged);
          await AsyncStorage.setItem(userAsyncStorage, JSON.stringify(userLogged));
          await AsyncStorage.setItem(userAppleAsyncStorage, JSON.stringify(userLogged));
        }

      } catch (error) {
        throw new Error(error);
      }
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userAsyncStorage);
  }

  useEffect(() => {
    async function loadUserStoragedData() {
      const userStoraged = await AsyncStorage.getItem(userAsyncStorage)

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
      setUserStorageLoading(false)
    }
    loadUserStoragedData();
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      userStorageLoading,
      signWithGoogle,
      signInWithApple,
      signOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context;
}

export { AuthProvider, useAuth }