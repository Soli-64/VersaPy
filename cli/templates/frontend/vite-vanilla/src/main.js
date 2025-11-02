import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

import { invoke } from "versapy/api"

const greet = async () => {

    console.log(
      await invoke("greet", {name: "World !"})
    )

}
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Versapy + Vite</h1>
    <button id="greetBtn">
      Greetings from Versapy
    </button>
  </div>
`

document.querySelector("#greetBtn").addEventListener("click", (e) => greet())
