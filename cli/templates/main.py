import versapy as vpy
import threading as th

def change_counter(val): 
    print(val, "value changed")

counter = vpy.SharedValue("counter", 0, change_counter)

@vpy.expose
async def decrease():
    await counter.set_change(counter.get_value() - 1)

if __name__ == "__main__":
    
    vpy.run_app()
