// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbe-Mb0E9ezw5bu_b9YieQQRh61VQUAPg",
    authDomain: "reactapp-cbbea.firebaseapp.com",
    projectId: "reactapp-cbbea",
    storageBucket: "reactapp-cbbea.appspot.com",
    messagingSenderId: "575141842092",
    appId: "1:575141842092:web:924021acd6a5434718e309"
  };

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

export { auth }