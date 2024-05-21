// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoUaFG-7-Cq-a7V0e2GDvDJ106MRqiPHg",
    authDomain: "carwashbooking-7911c.firebaseapp.com",
    projectId: "carwashbooking-7911c",
    storageBucket: "carwashbooking-7911c.appspot.com",
    messagingSenderId: "906666963037",
    appId: "1:906666963037:web:0c7e50d631aa82ac8a5db4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

export { auth }