from fastapi import FastAPI
import uvicorn

from src.api import api_router

app = FastAPI(
    title="API Only",
    description="This is an API-only application without any frontend components.",
    version="1.0.0",
)

app.include_router(api_router, prefix="/api")    

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)