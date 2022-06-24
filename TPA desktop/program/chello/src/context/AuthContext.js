// import {createContext, useContext } from "react";
// import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
// import {auth} from '../firebase'

// const UserContext = createContext()

// export const AuthContextProvider = ({children}) => {
//     const createUser = (email, password) => {
//         return createUserWithEmailAndPassword(auth, email, password)
//     }

//     return(
//     <UserContext.Provider value={{createUser}}>
//         {children}
//     </UserContext.Provider>
//     )
// }

// export const UserAuth = () => {
//     return useContext(UserContext)
// }

// export default AuthContextProvider

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

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
