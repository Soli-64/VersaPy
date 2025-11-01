from versapy import expose, run_versapy
    

@expose
def greet(name: str) -> str:
    print(f"Hello, {name}!")
    return f"Hello, {name}!"

if __name__ == "__main__":
    run_versapy()
