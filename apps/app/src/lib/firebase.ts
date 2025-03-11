import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB9RucLdWENklF5Y8hAs8n2Eq2lGfGMtlU",
    authDomain: "iglesiasbc-os.firebaseapp.com",
    projectId: "iglesiasbc-os",
    storageBucket: "iglesiasbc-os.appspot.com",
    messagingSenderId: "861322280709",
    appId: "1:861322280709:web:678007fe73fda7a120816c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
