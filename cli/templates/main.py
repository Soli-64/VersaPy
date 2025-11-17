 # src-versapy/main.py

from versapy import VersaPyApp

app = VersaPyApp()

@app.expose
def greet(name):
    print("Greetings from VersaPy ", name)
    return f"Hi {name}"

if __name__ == "__main__":
    
    app.run()