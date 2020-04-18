import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBGayXvX8wC6WYuTRuOKSGhO6EpY1eiwko",
    authDomain: "apay-85789.firebaseapp.com",
    databaseURL: "https://apay-85789.firebaseio.com",
    projectId: "apay-85789",
    storageBucket: "apay-85789.appspot.com",
    messagingSenderId: "644276095618",
    appId: "1:644276095618:web:cf5e5ce748ed06779a429b",
    measurementId: "G-N340Z13H21"
};
if (!firebase.apps.length){firebase.initializeApp(firebaseConfig)} else{firebase.app()};


export default firebase;