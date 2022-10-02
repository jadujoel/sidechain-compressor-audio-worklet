import { useContext } from "react"
import { FileStore } from "../stores/FileStore"
import { appStore } from "../stores/AppStore"

export const useFilesystem = (): FileStore => {
    const context = useContext(appStore)

    return context.fileStore
}