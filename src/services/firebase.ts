import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// const { REACT_APP_API_KEY } = process.env;
// const { REACT_APP_AUTH_DOMAIN } = process.env;
// const { REACT_APP_DATABASE_URL } = process.env;
// const { REACT_APP_PROJECT_ID } = process.env;
// const { REACT_APP_STORAGE_BUCKET } = process.env;
// const { REACT_APP_MESSAGING_SENDER_ID } = process.env;
// const { REACT_APP_APP_ID } = process.env;


const firebaseConfig = {
  apiKey: "AIzaSyAv900SumUA-T-xckO75ecICdDffHamgn8",
  authDomain: "letmeask-dfffa.firebaseapp.com",
  databaseURL: "https://letmeask-dfffa-default-rtdb.firebaseio.com",
  projectId: "letmeask-dfffa",
  storageBucket: "letmeask-dfffa.appspot.com",
  messagingSenderId: "724526857899",
  appId: "1:724526857899:web:c42e1aa674db4c193441ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);


