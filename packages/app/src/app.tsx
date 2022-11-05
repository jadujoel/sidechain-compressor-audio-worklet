
import styles from './app.module.css'
import { Compressor } from "./components/compressor"
export function App() {
    return (
        <div className={styles.App}>
            <header className={styles["App-header"]}></header>
            <Compressor/>
        </div>
    )
}
