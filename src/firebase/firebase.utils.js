import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
    apiKey: "AIzaSyAIY4UtmTZ9-jvVeFXmPk2nSY8BY19QHi4",
    authDomain: "my-app-9c934.firebaseapp.com",
    databaseURL: "https://my-app-9c934.firebaseio.com",
    projectId: "my-app-9c934",
    storageBucket: "my-app-9c934.appspot.com",
    messagingSenderId: "577879953944",
    appId: "1:577879953944:web:f938afa84caa4d5bb5a96d",
    measurementId: "G-DE9X47FMP9"
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const createUserProfileDocument = async (userAuth , additionalData) =>{
    if(!userAuth) return;
    console.log(userAuth);
    const userRef = firestore.doc(`users/${userAuth.uid}`)
    const snapShot = await userRef.get();
    if(!snapShot.exists){
        const {displayName , email , uid ,photoURL} = userAuth;
        const status = 'online';
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                uid,
                status,
                photoURL,
                ...additionalData
            })
        } catch (error) {
            console.log('Error creating user' , error.message);
        }
    }

    return userRef;
}

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.setCustomParameters({prompt : 'select_account'})

export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const userCollectionRef = () => {
    const userCollectionRef = firestore.collection('users');
    return userCollectionRef;
};
export default firebase;
