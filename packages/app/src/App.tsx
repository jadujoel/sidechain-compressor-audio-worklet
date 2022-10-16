import { useState } from 'react'
import { Compressor } from "./components/Compressor"
// import { Knob } from "./components/Knob"

import './App.css'
// import { Circle } from './components/Circle'
function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="App">
            <header className="App-header"></header>
            <Compressor/>
            {/* <Knob fillStart={0}></Knob> */}
            {/* <Knob fillStart={1} value={0.2}></Knob> */}
            {/* <Knob fillStart={1} value={0.8}></Knob> */}
            {/* <Knob fillStart={2}></Knob> */}
        </div>
    )
}

export default App
