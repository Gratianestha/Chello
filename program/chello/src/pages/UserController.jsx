import { db} from '../firebase.js';
import { collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove, getDocs } from 'firebase/firestore';
import { useState } from 'react';

export const userRef = collection(db, "user"); 

export const AddNewUser = (newName, email, userId) => {
    
    try{
        addDoc(userRef, {
                UserId: userId,
                Name: newName,
                Email: email,
                NotificationFrequency: "Instantly",
                OwnedWorkspacesId: [],
                JoinedWorkspacesId: [],
                OwnedBoardId: [],
                JoinedBoardId: [],
                FavoriteBoard: []
        })

    }catch (error){
       console.log(error)
    }
  }

export function updateOwnedWorkspace(userId, workspaceId){
    try {
        updateDoc( doc(db, "User", userId), {
            OwnedWorkspacesId: arrayUnion(
                workspaceId
            )
        })
    } catch (error) {
        console.log(error)
    }
}

export function RevokeUser(userId, workspaceId){
    // console.log("test " + userId + " " + workspaceId)
    try {

        updateDoc( doc(db, "User", userId), {
            OwnedWorkspacesId: arrayRemove(workspaceId),
            JoinedWorkspacesId: arrayUnion(workspaceId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function GrantUser(userId, workspaceId){
    // console.log("test " + userId + " " + workspaceId)
    try {

        updateDoc( doc(db, "User", userId), {
            OwnedWorkspacesId: arrayUnion(workspaceId),
            JoinedWorkspacesId: arrayRemove(workspaceId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function RemoveUserWo(userId, workspaceId){
    try {

        updateDoc( doc(db, "User", userId), {
            OwnedWorkspacesId: arrayRemove(workspaceId),
            JoinedWorkspacesId: arrayRemove(workspaceId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function RemoveUserBo(userId, boardId){
    try {

        updateDoc( doc(db, "User", userId), {
            OwnedBoardId: arrayRemove(boardId),
            JoinedBoardId: arrayRemove(boardId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function joinWorkspace(userId, workspaceId){
    try {

        updateDoc( doc(db, "User", userId), {
            JoinedWorkspacesId: arrayUnion(workspaceId)
        })

    } catch (error) {
        console.log(error)
    }
}

export async function getUsers(){
    return await getDocs( collection(db, "User"))
}

export function updateOwnedBoard(userId, boardId){
    try {
        updateDoc( doc(db, "User", userId), {
            OwnedBoardId: arrayUnion(
                boardId
            )
        })
    } catch (error) {
        console.log(error)
    }
}

export function joinBoard(userId, boardId){
    try {

        updateDoc( doc(db, "User", userId), {
            JoinedBoardId: arrayUnion(boardId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function GrantUserBoard(userId, boardId){
    // console.log("test " + userId + " " + workspaceId)
    try {

        updateDoc( doc(db, "User", userId), {
            OwnedBoardId: arrayUnion(boardId),
            JoinedBoardId: arrayRemove(boardId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function RevokeUserBoard(userId, boardId){
    // console.log("test " + userId + " " + workspaceId)
    try {

        updateDoc( doc(db, "User", userId), {
            OwnedBoardId: arrayRemove(boardId),
            JoinedBoardId: arrayUnion(boardId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function setFavoriteBoard(userId, boardId){
    try {

        updateDoc( doc(db, "User", userId), {
            FavoriteBoard: arrayUnion(boardId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function untoggleFavorite(userId, boardId){
    try {

        updateDoc( doc(db, "User", userId), {
            FavoriteBoard: arrayRemove(boardId)
        })

    } catch (error) {
        console.log(error)
    }
}

export function updateNotif(userId, notificationFrequency){
    try {
        
        updateDoc(doc(db, "User", userId), {
            NotificationFrequency: notificationFrequency
        })

    } catch (error) {
        console.log(error)
    }
}

export function UpdateEmail(userId, email){
    try {
        
        updateDoc(doc(db, "User", userId), {
            Email: email
        })

    } catch (error) {
        console.log(error)
    }
}

export function UpdateName(userId, name){
    try {
        
        updateDoc(doc(db, "User", userId), {
            Name: name
        })

    } catch (error) {
        console.log(error)
    }
}