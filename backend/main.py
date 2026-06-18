from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Welcome to ShopHub API"
    }

@app.get("/about")
def about():
    return {
        "project": "ShopHub",
        "version": "1.0"
    }

@app.get("/products")
def get_products():
    return [
        {
            "id": 1,
            "name": "Laptop"
        },
        {
            "id": 2,
            "name": "Mouse"
        }
    ]