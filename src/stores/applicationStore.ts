import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import { User, UserCredential } from "@firebase/auth"

class applicationStore {
    user = {} as User

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: User | null) {
        this.user = user as User
        console.log('เข้ามายัง', user)
    }
}

export default new applicationStore()
