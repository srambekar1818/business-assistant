# 🔌 API Documentation

Base URL (local): `http://localhost:8000`  
Base URL (production): `https://your-app.onrender.com`

---

## Authentication

All `/chat` and `/sessions` endpoints require a JWT token in the header:

```
Authorization: Bearer <your_token>
```

---

## Auth Endpoints

### Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "Sushil Ambekar",
  "email": "sushil@example.com",
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "name": "Sushil Ambekar",
  "email": "sushil@example.com"
}
```

---

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "sushil@example.com",
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "name": "Sushil Ambekar",
  "email": "sushil@example.com"
}
```

---

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "user_id": 1,
  "email": "sushil@example.com"
}
```

---

## Chat Endpoints

### Send Message
```
POST /chat
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Help me write an email" }
  ],
  "system_prompt": "You are a professional business assistant.",
  "session_id": null
}
```

**Response:**
```json
{
  "reply": "Sure! Here is a professional email...",
  "session_id": 1
}
```

> Pass `session_id` from previous response to continue the same conversation.

---

## Session Endpoints

### Get All Sessions
```
GET /sessions
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Help me write an email",
    "user_id": 1,
    "created_at": "2026-06-25T10:00:00",
    "updated_at": "2026-06-25T10:05:00"
  }
]
```

---

### Get Session Messages
```
GET /sessions/{session_id}/messages
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  { "id": 1, "session_id": 1, "role": "user", "content": "Help me write an email", "created_at": "..." },
  { "id": 2, "session_id": 1, "role": "assistant", "content": "Sure! Here is...", "created_at": "..." }
]
```

---

### Delete Session
```
DELETE /sessions/{session_id}
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{ "status": "deleted" }
```

---

## Error Responses

| Code | Meaning |
|------|---------|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not found |
| 500 | Server error (API issue) |
