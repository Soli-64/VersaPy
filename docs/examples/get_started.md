# Examples


### A simple event creation example with ```@expose``` and ```invoke```.

```py
# src-versapy/main.py

from versapy import VersaPyApp

app = VersaPyApp()

@app.expose
def greet(name):
    print("Greetings from VersaPy ", name)
    return f"Hi {name}"

if __name__ == "__main__":
    
    app.run()

```

```js
// in your front
import { invoke } from "versapy/api"

// [...] your app code

const greet = async () => {
    const r = await invoke('greet', {name: "YourName"})
    console.log(r)
}

```

### - A shared value between front and back with ```SharedValue``` and ```useSharedValue```

```py
# src-versapy/main.py

from versapy import VersaPyApp

app = VersaPyApp()

# on change callback
def on_counter_change(value):
    print("new counter value", value)

# shared value
counter = app.SharedValue("counter", 0, on_counter_change)

# expose event to decrease value
@app.expose
async def decrease():
    await counter.set(counter.get() - 1)

if __name__ == "__main__":
    
    app.run()

```

```js
// in your front
import { useSharedValue } from "versapy/api"

// [...] your app code

const onCounterChange = (value) => {
    console.log(counterValue)
}

let [counter, setCounter] = useSharedValue("counter", 0, onCounterChange)


```
### If you're using a framework that handle states like react, you might like this trick:
```js
import { useSharedValue } from "versapy/api";
import { useState } from "react";

// With this hook, the useSharedValue onChange method is handled by the useState, 
// for a fully reactive experience
const useCounter = (initCount) => {

    const [count, setCount] = useState(initCount)
    const [shared, setShared] = useSharedValue(
        "counter", 
        initVal, 
        (val) => setCount(val)
    )

    return [shared, setShared]

}

```