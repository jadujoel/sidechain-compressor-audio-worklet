import { makeAutoObservable } from "mobx"
import { createContext } from "react"
import { FileStore } from "./FileStore"

export class AppStore {
    currentTabIndex: number
    fileStore: FileStore

    constructor () {
        this.currentTabIndex = 0
        this.fileStore = new FileStore(this)
        makeAutoObservable(this, {}, { autoBind: true })
    }
}

export const appStore = createContext<AppStore>(new AppStore())
