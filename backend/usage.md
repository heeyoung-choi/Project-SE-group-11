Sample body of:

http://localhost:8000/auth/login
    {
    "email": "quang@gmail.com",
    "password": "123456",
    }

http://localhost:8000/auth/register
    {
    "email": "email@gmail.com",
    "password": "pass>6digits",
    "displayName": "User Name"
    }

http://localhost:8000/predictions/predict
    {
    "userId": "user1234",
    "matchId": "match456",
    "type": "winner",
    "data": {
        "predictedWinner": "teamA"
    },
    "timestamp": "2024-12-20T12:34:56.789Z" // req dont need to include because it is auto generated
    }

Or:

    {
    "userId": "user456",
    "matchId": "match789",
    "type": "score",
    "data": {
        "predictedScore": {
        "teamA": 2,
        "teamB": 1
        }
    }
    "timestamp": "2024-12-20T12:34:56.789Z" // req dont need to include because it is auto generated
    }
