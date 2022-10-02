import { useContext } from "react"
import { AppStore, appStore } from "../stores/AppStore"

export const useAppstate = (): AppStore => {
    return useContext(appStore)
}