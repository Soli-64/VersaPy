import versapy as vpy
    

# create an endpoint with function name
@vpy.expose
def greet(name: str) -> str:
    print(f"Hello, {name}!")
    return f"Hello, {name}!"


if __name__ == "__main__":
    # start the app
    vpy.run_versapy()
