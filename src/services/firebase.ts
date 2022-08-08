import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const { REACT_APP_API_KEY } = process.env;
const { REACT_APP_AUTH_DOMAIN } = process.env;
const { REACT_APP_DATABASE_URL } = process.env;
const { REACT_APP_PROJECT_ID } = process.env;
const { REACT_APP_STORAGE_BUCKET } = process.env;
const { REACT_APP_MESSAGING_SENDER_ID } = process.env;
const { REACT_APP_APP_ID } = process.env;


const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseURL: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);


