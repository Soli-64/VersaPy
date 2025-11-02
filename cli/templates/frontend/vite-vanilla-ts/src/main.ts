import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

import { invoke } from "versapy/api"

const greet = async () => {

    console.log(
      await invoke("greet", {name: "World !"})
    )

}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>VersaPy + Vite + TypeScript</h1>
    
    <button id="greetBtn">
      Grettings From Versapy !
    </button>

  </div>
`

document.querySelector("#greetBtn")?.addEventListener("click", (e) => greet())
