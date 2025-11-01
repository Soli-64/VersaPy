

# **VersaPy - Build modern desktop Python apps easily**

## Introduction

<p>

VersaPy is a lightweight framework made for building modern desktop apps using a web-based frontend (with vitejs) and and integrated Python backend with PyWebview and FastAPI.

PyInstaller is used for packaging the app into a single executable.   

</p>

## Test versapy:

#### To use versapy, you'll need Python >=3.9 and NodeJS installed. <br/>
#### Make sure to initialize your project in an empty directory.

You can try versapy with these commands:

```bash
npm create versapy@latest
```

This command might take a bit of time, it init the whole project.

Once done, just run with:


```bash
npm run dev
```

## Call the back from the front:

#### I haven't implemented exmple templates yet, so here's one with Vanilla Javascript.


```js

// src/main.js or whatever is executed

import { invoke } from "versapy/api"

const button = document.querySelector("#greetBtn")

button.addEventListener("click", async () => {
    console.log(await invoke("greet", {name: "Everyone"}))
})

```

Output in web console:

```
Hello, Everyone!
```


#### and in the back (this file is pregenerated)

```python
# src-versapy/main.py

from versapy import expose, run_versapy
    
@expose
def greet(name: str) -> str:
    print(f"Hello, {name}!")
    return f"Hello, {name}!"

if __name__ == "__main__":
    run_versapy()

```
You might observe that the "Hello, Everyone" will be printed in front but not in back. I'm currently working on this issue.


## About Build

#### The build function is actually reserved to windows, and will come later for linuw and macos.

You can build your project with:

```bash
npm run build
```
