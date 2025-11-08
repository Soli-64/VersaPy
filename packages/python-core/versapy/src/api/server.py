
def start_server(app, config):
    import uvicorn
    uvicorn.run(app, host=config.BACK_HOST, port=config.BACK_PORT)
    