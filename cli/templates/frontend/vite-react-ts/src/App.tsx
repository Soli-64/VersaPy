import { invoke } from "versapy/api"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
  const greet = async () => {

    console.log(
      await invoke("greet", {name: "World !"})
    )

  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Versapy + Vite + React</h1>
      <button onClick={() => greet()}>
          Greetings from Versapy
        </button>
    </>
  )
}

export default App
