import { firebaseAuth } from 'config/firebase'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
  AuthProvider,
  EmailAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { register } from 'service/user'
import applicationStore from 'stores/applicationStore'

interface signupProps {
  Name: string
  Surname: string
  Email: string
  password: string
}

firebaseAuth.languageCode = 'th'

function checkAuthState() {
  onAuthStateChanged(firebaseAuth, (user) => {
    applicationStore.setUser(user)
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const UID = user.uid
      // console.log(UID)
      // console.log(user)
      return true
    } else console.log('Auth State Changed')
    return false
  })
  return false
}

async function signUp_EmailPassword({
  Name,
  Surname,
  Email,
  password,
}: signupProps) {
  try {
    const userCrendential = await createUserWithEmailAndPassword(
      firebaseAuth,
      Email,
      password
    )
    // Signed up
    const user = userCrendential.user
    const UID = user.uid
    register({ UID, Name, Surname, Email })
  } catch (error) {
    alert(error)
  }
}

async function signIn_EmailPassword(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    )
    // Signed in
    const user = userCredential.user
    if (!user.emailVerified) {
      console.log('Please verify your email before logging in.')
      sendEmailVerification(user)
    } else console.log('Login successfully.')
    return userCredential
  } catch (error) {
    alert(error)
  }
}

async function signOut() {
  try {
    await firebaseAuth.signOut()
    localStorage.removeItem('providerToken')
    applicationStore.setUser(null)
    console.log('successful logout')
    return true
  } catch (error) {
    alert(error)
    return false
  }
}

async function signIn_Google() {
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
  provider.addScope('https://www.googleapis.com/auth/userinfo.email')
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  //provider.setCustomParameters(hd: 'ku.th')
  try {
    console.log(provider)
    const userCredential = await signInWithPopup(firebaseAuth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(userCredential)
    const token = credential?.accessToken
    if (token) localStorage.setItem('providerToken', token)
    // The signed-in user info.
    const user = userCredential.user
    console.log(userCredential)
    // console.log(user)
    // console.log(token)
    applicationStore.setUser(user)
    return userCredential
  } catch (error) {
    alert(error)
    return false
  }
}
export {
  checkAuthState,
  signIn_EmailPassword,
  signUp_EmailPassword,
  signIn_Google,
  signOut,
}
