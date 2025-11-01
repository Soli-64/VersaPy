from versapy import expose, run_versapy, load_config
    
config = load_config("versapy.config.json")

@expose
def greet(name: str) -> str:
    print(f"Hello, {name}!")
    return f"Hello, {name}!"

if __name__ == "__main__":
    run_versapy(config)
