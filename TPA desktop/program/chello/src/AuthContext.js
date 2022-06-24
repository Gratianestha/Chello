import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { useLocation } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState("");

  const location = useLocation();

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function saveUser(id, email, password, username) {
    const userRef = collection(db, "user")
    const path = 'user/' + id

    return setDoc(doc(db, path), {
      username: username,
      email: email,
      password: password,
      admin: [],
      member: [],
      adminBoard: [],
      memberBoard: [],
      path: path
    })
  }

  function setName(uname) {
    return updateProfile(auth.currentUser, { displayName: uname });
  }

  function logout() {
    localStorage.removeItem("user")
    return signOut(auth);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      window.localStorage.setItem('user', JSON.stringify(currentUser));
    });
    return unsubscribe;
  }, [location]);

  return (
    <userAuthContext.Provider value={{ user, signUp, login, logout, setName, saveUser }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
