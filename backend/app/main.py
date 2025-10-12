from fastapi import FastAPI

from app.api.api import api_router

app = FastAPI(
    title="Formula 1 Strategy Sharing API",
    description="API for sharing Formula 1 race strategies",
    version="1.0.0",
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Formula 1 Strategy Sharing API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)