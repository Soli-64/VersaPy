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

# expose event to decrease value from the back
@app.expose
async def decrease():
    await counter.set(counter.get() - 1)

if __name__ == "__main__":
    
    app.run()

```

```js
// in your front
import { createSharedValue } from "versapy/api"

// [...] your app code

// In your method / class 
let [counter, setCounter] = await createSharedValue(
    "counter",
    (value) => {
        console.log(counterValue)
    }
)


```
### If you're using a framework that handle states like react, you might like this use:
```js
import { createSharedValue } from "versapy/api";
import { useState } from "react";

class Manager {

    constructor() {
        this.data = {};
        this.setData = () => {};
    }
    
    create_sv = async (onChange) => {
        [this.data, this.setData] = await createSharedValue(
            "counter",
            (val) => {
                this.data = val
                onChange(val)
            }
        )
    }
}

const manager = new Manager()

const App = () => {

    // _setData because only for sv use, don't call it to avoid unexpected behaviors.
    const [data,_setData] = useState({})

    useEffect(() => {
        manager.create_sv(_setData)
    }, [])

    // You can now use manager.data (or data) and manager.setData in your component. The value persist between re-renders, as it's instantly stored in back.

}

```

### You can try to use the createSharedValue method in a hook, but re-renders might cause unexpected behaviors.