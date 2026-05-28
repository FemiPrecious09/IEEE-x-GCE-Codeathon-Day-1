# Notes API ── Day 1

A RESTful CRUD API for managing notes, built with **Node.js** and **Express**.

Built for the IEEE × GitHub Campus Experts Codeathon — Backend Track.

Focus areas for Day 1:

* HTTP fundamentals
* Clean REST API design
* Semantic status codes
* Defensive backend engineering

---

# Overview

This project implements a complete Notes API with:

* CRUD operations
* Pagination and sorting
* Modular Express architecture
* Request logging
* Centralized error handling
* Semantic HTTP responses

Data is currently stored in-memory and seeded on server startup.

---

# Features

## Core Features

* Create notes
* Read all notes
* Read a single note
* Replace notes with PUT
* Partially update notes with PATCH
* Delete notes

## Engineering Features

* Semantic HTTP status codes
* Pagination and sorting
* Request logging middleware
* Centralized error handling
* Global 404 route handler
* Modular folder structure

---

# Tech Stack

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| Node.js (v18+) | JavaScript runtime              |
| Express.js     | HTTP routing and middleware     |
| dotenv         | Environment variable management |
| crypto         | UUID generation                 |

---

# Project Structure

```txt id="my7gx4"
.
├── controllers/
│   └── notes_controller.js
│
├── routes/
│   └── notes.js
│
├── db/
│   └── database.js
│
├── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# Quick Start

## 1. Clone the Repository

```bash id="7t9qdw"
git clone <your-repo-url>
cd <repo-folder>
```

---

## 2. Install Dependencies

```bash id="o1e7cx"
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env id="d9j6gl"
ACTIVE_PORT=8800
```

---

## 4. Start the Server

```bash id="0d0r8x"
node server.js
```

Expected output:

```txt id="uxh7n8"
Server is ACTIVE🔥🔥 on http://localhost:8800
```

---

# API Base URL

```txt id="f3pxwe"
http://localhost:8800
```

---

# API Endpoints

| Method | Endpoint     | Description     | Success |
| ------ | ------------ | --------------- | ------- |
| POST   | `/notes`     | Create note     | 201     |
| GET    | `/notes`     | Get all notes   | 200     |
| GET    | `/notes/:id` | Get single note | 200     |
| PUT    | `/notes/:id` | Replace note    | 200     |
| PATCH  | `/notes/:id` | Partial update  | 200     |
| DELETE | `/notes/:id` | Delete note     | 204     |

---

# Create Note

## `POST /notes`

Creates a new note with server-generated identifiers and timestamps.

### Request Body

```json id="8jryy7"
{
  "title": "Buy milk",
  "body": "2% from the corner store"
}
```

---

### Response — `201 Created`

```json id="agx4o5"
{
  "id": "8f3a1b2c-4d5e-6f70-8a9b-0c1d2e3f4a5b",
  "title": "Buy milk",
  "body": "2% from the corner store",
  "createdAt": "2026-05-25T14:30:00.000Z",
  "updatedAt": "2026-05-25T14:30:00.000Z"
}
```

---

### Example cURL

```bash id="e2jlwm"
curl -X POST http://localhost:8800/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","body":"2% from the corner store"}'
```

---

# Get Notes

## `GET /notes`

Returns paginated notes with optional sorting.

---

## Query Parameters

| Parameter | Type    | Default | Description                      |
| --------- | ------- | ------- | -------------------------------- |
| page      | Integer | 1       | Page number                      |
| limit     | Integer | 10      | Items per page                   |
| sort      | String  | —       | `title`, `newest`, `lastupdated` |

---

## Example Requests

```bash id="4o6psf"
# Default list
curl http://localhost:8800/notes

# Page 2 with 5 items
curl "http://localhost:8800/notes?page=2&limit=5"

# Sort by newest
curl "http://localhost:8800/notes?sort=newest"

# Sort by title
curl "http://localhost:8800/notes?sort=title&page=1&limit=3"
```

---

## Invalid Sort Response

### `400 Bad Request`

```json id="z2b7ig"
{
  "error": "sort must be one of: title, newest, lastupdated"
}
```

---

# Get Single Note

## `GET /notes/:id`

Returns a single note.

### Error Response

| Status | Meaning        |
| ------ | -------------- |
| 404    | Note not found |

---

### Example cURL

```bash id="oqdh90"
curl http://localhost:8800/notes/<id>
```

---

# Replace Note

## `PUT /notes/:id`

Fully replaces a note.

PUT is idempotent — repeating the same request produces the same result.

---

### Request Body

```json id="f2a79r"
{
  "title": "Updated title",
  "body": "Replaced body content"
}
```

---

### Example cURL

```bash id="8gpry6"
curl -X PUT http://localhost:8800/notes/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","body":"New body"}'
```

---

# Partial Update

## `PATCH /notes/:id`

Updates only the provided fields.

### Request Body

```json id="f4pxi2"
{
  "title": "Just changing the title"
}
```

---

### Example cURL

```bash id="hvw8lm"
curl -X PATCH http://localhost:8800/notes/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Patched title"}'
```

---

# Delete Note

## `DELETE /notes/:id`

Deletes a note.

### Response

`204 No Content`

---

### Example cURL

```bash id="pb3x3i"
curl -X DELETE http://localhost:8800/notes/<id>
```

---

# Status Codes

| Code | Meaning                   |
| ---- | ------------------------- |
| 200  | Successful read or update |
| 201  | Resource created          |
| 204  | Successful delete         |
| 400  | Invalid request           |
| 404  | Resource not found        |
| 500  | Internal server error     |

---

# Design Notes

## PUT vs PATCH

| Method | Purpose          |
| ------ | ---------------- |
| PUT    | Full replacement |
| PATCH  | Partial update   |

PUT and DELETE are idempotent.

POST is not idempotent because each request creates a new resource.

---

## Why DELETE Returns 204

`204 No Content` communicates:

* The operation succeeded
* No response body is required

Returning `200 OK` with `"Note deleted"` would be redundant.

---

## In-Memory Storage

Notes are stored in a JavaScript array inside:

```txt id="k2ynf7"
db/database.js
```

The array is seeded on server startup.

Restarting the server resets all state because persistence is not yet implemented.

A PostgreSQL database layer is planned for Day 2.

---

# Request Logging

Example logs:

```txt id="55r7fp"
[2026-05-25T14:30:00.000Z] POST /notes 201 4
[2026-05-25T14:30:05.123Z] GET /notes 200 1
[2026-05-25T14:30:10.456Z] DELETE /notes/abc-123 204 1
```

Format:

```txt id="mll31x"
[ISO timestamp] METHOD URL STATUS_CODE durationMs
```

---

# Testing

You can test the API using:

* curl
* Postman
* Insomnia
* Thunder Client

Screenshots of successful requests are available in the `screenshots/` directory.

---

# Future Improvements

* PostgreSQL persistence
* Authentication and authorization
* JWT-protected routes
* Database-backed pagination
* Automated testing
* Docker support

---

# Author

Built by **Femi Oyetade**

IEEE × GitHub Campus Experts Codeathon — Backend Track
