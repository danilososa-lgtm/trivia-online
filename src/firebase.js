import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAoZAeLI7pZ5ysxE-nO0JWRpvhT28_oBHw",
  authDomain: "trivia-59492.firebaseapp.com",
  databaseURL: "https://trivia-59492-default-rtdb.firebaseio.com",
  projectId: "trivia-59492",
  storageBucket: "trivia-59492.firebasestorage.app",
  messagingSenderId: "357816871542",
  appId: "1:357816871542:web:1eed999d297936ca06cd57"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);