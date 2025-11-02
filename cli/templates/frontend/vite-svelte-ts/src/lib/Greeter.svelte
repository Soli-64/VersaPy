<script lang="ts">
  import { invoke } from "versapy/api"

  const greet = async (): void => {
    console.log(
      await invoke("greet", {name: "World !"})
    )
  }

</script>

<button onclick={greet}>
  Greetings from Versapy
</button>
