<script>
  import { invoke } from "versapy/api";

  async function greet() {
    console.log(
      await invoke("greet", {name: "World !"})
    )
  }
</script>

<button onclick={greet}>
  Greetings from Versapy 
</button>
