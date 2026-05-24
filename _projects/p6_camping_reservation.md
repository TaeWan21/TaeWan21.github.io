---
layout: page
title: Camping Site Reservation — Web Programming Term Project
description: An Airbnb-style camping reservation web app with browsing, filtering, booking, and reviews — built end-to-end with React (front end) and an Express + MySQL backend.
img:
importance: 6
category: personal
project_type: personal
display_year: "2023"
funding: "React · Express.js · Node.js · MySQL"
logo_icon: fa-solid fa-campground
---

**Repo.** [github.com/TaeWan21/webProgrammingTermProject](https://github.com/TaeWan21/webProgrammingTermProject) (backend)

**Course.** Web Programming term project &nbsp;·&nbsp; **Role.** Developer

A full-stack camping reservation service modeled loosely after Airbnb. Users can browse campsites, filter by criteria, view individual sites within each campsite, make reservations, and leave reviews.

---

### 🧱 Architecture

A clean MVC-ish split, with React on the front end calling a stateless Express REST API backed by MySQL.

```
React (frontend) ──HTTP──> Express server (server.js)
                                │
                                ├─ /login        — auth
                                ├─ /campsite     — campsite list / detail
                                ├─ /site         — individual sites within a campsite
                                ├─ /reservation  — booking flow
                                ├─ /review       — review CRUD (with image upload)
                                └─ /filtering    — search & filter
                                       │
                                       ▼
                                  MySQL (mysql2)
```

---

### ✨ Features (by route)

| Route | What it does |
|---|---|
| `/login` | Session-based authentication (`express-session`) |
| `/campsite` | List campsites, fetch detail |
| `/site` | Individual sites (pitches) within a campsite |
| `/reservation` | Create / view bookings |
| `/review` | Reviews with **image upload** (handled by `multer`) |
| `/filtering` | Server-side filtering for search results |

---

### 🛠️ Backend stack

- **Runtime.** Node.js
- **Server.** Express + CORS + body-parser
- **DB driver.** `mysql2`
- **Sessions.** `express-session`
- **File upload.** `multer` (campsite / review images served from `/uploads`)

---

### 🧠 What I learned

- Designing a small but realistic REST API surface: separating campsite, site, reservation, and review concerns into independent routers.
- Wiring up an Express server with the middleware essentials (CORS, body-parser, session, static file serving).
- Handling **multipart file uploads** with multer and serving uploaded assets back to the React client.
- Connecting Node.js to a real MySQL instance and reasoning about basic relational schema (campsites → sites → reservations / reviews).

---

*Note. The repository linked above is the Express backend. The React frontend was developed as a separate part of the term project.*
