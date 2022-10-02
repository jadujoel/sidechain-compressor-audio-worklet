import { makeAutoObservable } from "mobx"
import { AppStore } from "./AppStore"

export class FileStore {
    navigatorFiles: any
    appStore: AppStore

    constructor (appStore: AppStore) {
        this.appStore = appStore
        this.setNavFiles()
        makeAutoObservable(this)
    }

    setNavFiles = () => {
        this.navigatorFiles = {}
    }
}
