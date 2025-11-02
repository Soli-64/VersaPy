import { component$ } from '@builder.io/qwik'
import qwikLogo from './assets/qwik.svg'
import viteLogo from '/vite.svg'

import { invoke } from "versapy/api"

import './app.css'

export const App = component$(() => {

  const greet = async () => {

    console.log(
      await invoke("greet", {name: "World !"})
    )

  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://qwik.dev" target="_blank">
          <img src={qwikLogo} class="logo qwik" alt="Qwik logo" />
        </a>
      </div>
      <h1>Versapy + Vite + Qwik</h1>
      
      <button onClick$={() => greet()}>
        Greetings from Versapy
      </button>
    
    </>
  )
})
