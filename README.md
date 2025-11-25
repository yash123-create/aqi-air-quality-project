
# 🌍 Air Quality Index (AQI) Search Application  
### **Java Spring Boot Backend + React (Vite) Frontend**

## 📘 Project Overview
This project is a full-stack Air Quality Index (AQI) Search Application that allows users to check real-time AQI values for any city worldwide.

Includes:
- Java Spring Boot backend  
- React + Vite frontend  
- LRU caching  
- AQICN API integration  
- Modern UI  

---

## 🛠 Tech Stack
### Frontend
- React.js  
- Vite  
- Axios  

### Backend
- Java 17  
- Spring Boot 3  
- WebClient  
- LRU Cache  

### API
- AQICN Open Data API  

---

## 📂 Project Structure
```
aqi-full-java-project/
├── backend-java/
├── frontend/
└── screenshots/
```

---

## 🚀 Setup Instructions

# Backend Setup
### 1. Open backend in IntelliJ  
Folder:
```
backend-java/
```

### 2. Configure API Token
File:
```
src/main/resources/application.properties
```

Set:
```
aqicn.api.token=YOUR_TOKEN_HERE
```

### 3. Run Backend
```
mvn spring-boot:run
```

Runs at:
```
http://localhost:5000
```

---

# Frontend Setup
### 1. Install dependencies
```
cd frontend
npm install
```

### 2. Run frontend
```
npm run dev
```

Runs at:
```
http://localhost:5173
```

---

# 🔗 Proxy Setup
Already configured in:
```
vite.config.js
```

---

# 🧠 Caching (LRU)
Backend includes:
- Max size 100  
- TTL 10 minutes  
- Reduces external API calls  

---

# 📸 Screenshots

### Backend Running
![Backend Running](screenshots/backend-running.png)

### API Response
![API Response](screenshots/api-response.png)

### Frontend – Live API Result
![Frontend Live Result](screenshots/frontend-live.png)

### Frontend – Cached Result
![Frontend Cached Result](screenshots/frontend-cache.png)

### Project Folder Structure
![Folder Structure](screenshots/folder-structure.png)

---

# 🏁 Conclusion
This project demonstrates:
- Java backend engineering  
- React frontend development  
- API integration  
- Caching strategy  
- Clean architecture  
