import firebase from 'firebase/app';
import 'firebase/firestore'

    
const firebaseConfig = {
  apiKey: "AIzaSyC59DFPCHAnlmyq_KDfNIf4dyvHIp54Hdk",
  authDomain: "buddyfitai.firebaseapp.com",
  projectId: "buddyfitai",
  storageBucket: "buddyfitai.firebasestorage.app",
  messagingSenderId: "7746694694",
  appId: "1:7746694694:web:910edac01d68befcda00e7"
}
    

firebase.initializeApp(firebaseConfig);

const projectFirebase = firebase;firestore();

export { projectFirebase, firebaseConfig };

