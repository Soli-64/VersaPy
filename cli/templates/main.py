from versapy import VersaPyApp

app = VersaPyApp()

@app.expose
def greet(name):
    print("Greetings from back", name)
    return "Back say: hi"

if __name__ == "__main__":
    
    app.run()
