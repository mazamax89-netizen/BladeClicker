from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

leaderboard = []

@app.post("/submit_score")
async def submit_score(request: Request):
    global leaderboard
    data = await request.json()
    name = data.get("name", "Игрок")
    score = data.get("score", 0)
    leaderboard.append({"name": name, "score": score})
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    if len(leaderboard) > 10:
        leaderboard = leaderboard[:10]
    return JSONResponse(content={"top10": leaderboard})

@app.get("/get_leaderboard")
async def get_leaderboard():
    return JSONResponse(content={"top10": leaderboard})