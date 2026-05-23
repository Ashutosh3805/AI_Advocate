# AI Advocate Legal Terminal - Backend API Node

Welcome to the production-ready backend engine for the **AI Advocate** legal assistant platform. This MERN stack Node.js server manages user identities, persists secure litigation chat logs, processes contract documents via RAG (Retrieval-Augmented Generation), and calculates fast semantic search scores inside MongoDB without requiring heavy native ChromaDB/FAISS compiles.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime Environment**: Node.js (ES Modules syntax, `import/export`)
- **Framework**: Express.js
- **Database**: MongoDB (Object data modeling via Mongoose)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Legal RAG Pipeline**: `pdf-parse` (text extraction), Custom Cosine Similarity (JavaScript), OpenAI Embeddings & Chat Completion APIs
- **Security & Validation**: Multer (file processing), CORS, `express-validator` (credential sanitizers)

---

## 🚀 Speed-Start Setup Instructions

### 1. Database Prerequisite

Ensure MongoDB is running locally:

```bash
# Verify MongoDB is running (Default port: 27017)
mongod
```

### 2. Environment Configurations

Create a `.env` file in the root of `/Server` (use the provided `.env.example` as a baseline):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_advocate
JWT_SECRET=ai_advocate_super_secure_terminal_key_2026
GROQ_API_KEY=your_groq_api_key_here
```

> **Resilience Fallback**: If `GROQ_API_KEY` is left blank, the server automatically boots into **Mock Offline Mode**, allowing you to log in, register, upload documents, and perform chats utilizing offline responses!

### 3. Install Dependencies

```bash
# Navigate to the Server directory
cd Server

# Install all listed packages
npm install
```

### 4. Fire up the Node Engine

```bash
# Launch development environment (via nodemon auto-refresh)
npm run dev

# Or start standard production server
npm start
```

Upon a successful boot, the secure terminal responds on:

- **Healthcheck endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📁 Project Architecture & Components

```text
Server/
 ├── config/
 │    └── db.js                 # Database connection pooling
 ├── controllers/
 │    ├── authController.js     # Register, Login, Profile controllers
 │    ├── chatController.js     # Chat message logs, RAG query handlers
 │    ├── uploadController.js   # PDF ingestion, chunking, database embeddings
 │    └── analyzeController.js  # Dedicated contract summaries & audit analyzer
 ├── middleware/
 │    ├── authMiddleware.js     # JWT token authenticators
 │    ├── errorHandler.js       # Centralized JSON error formatters
 │    ├── uploadMiddleware.js   # Multer file structure validators
 │    └── validationMiddleware.js # credential rules (express-validator)
 ├── models/
 │    ├── User.js               # Hashed credential schemas
 │    ├── Chat.js               # Message logs arrays
 │    ├── Document.js           # PDF metadata and parsed raw text
 │    ├── DocumentChunk.js      # Vector-store chunks with 1536 float arrays
 │    └── LegalQuery.js         # Audit log for queries and citations
 ├── routes/
 │    ├── authRoutes.js         # /api/auth API pathing
 │    ├── chatRoutes.js         # /api/chat RAG conversation pathing
 │    ├── uploadRoutes.js       # /api/upload file processing pathing
 │    └── analyzeRoutes.js      # /api/analyze specialized audit paths
 ├── services/
 │    ├── aiService.js          # OpenAI Ross Mode & Contract analysis
 │    ├── pdfService.js         # pdf-parse text extraction & splitters
 │    └── vectorStoreService.js # Memory Cosine Similarity calculation service
 ├── uploads/                   # Folder holding uploaded PDF resources
 ├── package.json               # Backend script definitions
 └── server.js                  # Express bootstrap entrypoint
```

---

## 📚 Complete API Documentation

### 🔒 1. Authentication System (`/api/auth`)

#### Register User

- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Body Request**:
  ```json
  {
    "email": "attorney@firm.com",
    "password": "supersecretpassword",
    "name": "Jane Doe"
  }
  ```
  _(Note: If `name` is omitted, the server automatically derives it from the email prefix)._
- **Response**:
  ```json
  {
    "success": true,
    "message": "Registration executed successfully.",
    "data": {
      "_id": "64bf...",
      "name": "JANE",
      "email": "attorney@firm.com",
      "role": "user",
      "token": "eyJhbGciOi..."
    }
  }
  ```

#### Login User

- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Body Request**:
  ```json
  {
    "email": "attorney@firm.com",
    "password": "supersecretpassword"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Terminal session initiated successfully.",
    "data": {
      "_id": "64bf...",
      "name": "JANE",
      "email": "attorney@firm.com",
      "role": "user",
      "token": "eyJhbGciOi..."
    }
  }
  ```

#### Fetch Current Profile Context

- **Route**: `GET /api/auth/me`
- **Access**: Protected (JWT Bearer Token required)
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Secure profile context retrieved.",
    "data": {
      "_id": "64bf...",
      "name": "JANE",
      "email": "attorney@firm.com",
      "role": "user"
    }
  }
  ```

---

### 💬 2. AI Chat & RAG Engine (`/api/chat`)

#### Fetch Conversation Log History

- **Route**: `GET /api/chat/history`
- **Access**: Protected (JWT required)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Case terminal filing history retrieved.",
    "data": [
      {
        "_id": "64c8...",
        "name": "NDA Clause Refinement",
        "messages": [
          { "sender": "user", "text": "Is this NDA mutual?" },
          { "sender": "ai", "text": "Based on clause 2..." }
        ]
      }
    ]
  }
  ```

#### Ask Ross Mode AI / Ingest Conversation

- **Route**: `POST /api/chat`
- **Access**: Protected (JWT required)
- **Body Request**:
  ```json
  {
    "query": "Does the NDA protect trade secrets?",
    "chatId": "64c8..."
  }
  ```
  _(Note: Omit `chatId` to instantiate a brand new conversational thread)._
- **Response**:
  ```json
  {
    "success": true,
    "message": "Query processed, filing log saved.",
    "data": {
      "chatId": "64c8...",
      "chatName": "Does the NDA protect...",
      "messages": [
        { "sender": "user", "text": "Does the NDA protect trade secrets?" },
        {
          "sender": "ai",
          "text": "Yes, Section 3 expressly includes trade secrets under..."
        }
      ],
      "citations": [
        {
          "filename": "Standard_NDA.pdf",
          "text": "The term Confidential Information shall encompass trade secrets...",
          "score": 0.895
        }
      ]
    }
  }
  ```

#### Permanently Purge Case Thread

- **Route**: `DELETE /api/chat/:id`
- **Access**: Protected (JWT required)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Filing case thread permanently purged.",
    "data": null
  }
  ```

---

### 📄 3. Document Processing System (`/api/upload`)

#### Upload Legal PDF Document (Multer form-data)

- **Route**: `POST /api/upload`
- **Access**: Protected (JWT required)
- **Body Form-Data**: `file` (Select PDF binary file)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Legal PDF uploaded, text parsed, and indexed in Vector Store successfully.",
    "data": {
      "documentId": "64d2...",
      "filename": "Employment_Contract.pdf",
      "totalChunks": 24,
      "numpages": 4
    }
  }
  ```

#### Fetch Ingested Documents List

- **Route**: `GET /api/documents`
- **Access**: Protected (JWT required)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Filing legal documents repository indexed.",
    "data": [
      {
        "_id": "64d2...",
        "originalName": "Employment_Contract.pdf",
        "fileSize": 348210,
        "uploadDate": "2026-05-21T21:00:00Z",
        "numpages": 4
      }
    ]
  }
  ```

---

### 🔍 4. Specialized Contract Analyzer (`/api/analyze`)

#### Submit Contract Auditing Request

- **Route**: `POST /api/analyze`
- **Access**: Protected (JWT required)
- **Body Request**:
  ```json
  {
    "documentId": "64d2..."
  }
  ```
  _(Note: You can also pass raw text directly as `{ "text": "Contract text..." }` if the document is not uploaded)._
- **Response**:
  ```json
  {
    "success": true,
    "message": "Structured contract audit completed for: Employment_Contract.pdf",
    "data": {
      "filename": "Employment_Contract.pdf",
      "analysis": {
        "summary": "This document is a standard Employment Agreement defining services...",
        "clauses": [
          {
            "name": "Non-Compete Covenant",
            "text": "Clause 8 restricts recipient from competing in the same industry for 24 months.",
            "risk": "HIGH"
          }
        ],
        "risks": [
          "Excessive non-compete geographical radius restriction",
          "Broad intellectual property assignments without equitable compensation"
        ],
        "recommendations": [
          "California associates: invalidate Clause 8 entirely under California Business & Professions Code 16600.",
          "Shorten non-compete duration parameter to 6 months."
        ]
      }
    }
  }
  ```

---

## 🔒 Security Assertions

1.  **Strict Context Isolation**: Document queries, PDF uploads, and chat threads are queried using the authenticated `req.user._id` index. Users can **never** search, view, or modify legal logs of other accounts.
2.  **Password Safety**: Passwords are secure utilizing standard cryptographic salt cycles inside `bcryptjs` and stored safely inside MongoDB database fields.
3.  **Strict Buffer Sanitation**: Express validators normalize incoming text inputs, sanitizing against scripting vulnerabilities, while file type filters inside Multer guarantee that only PDF buffers are written locally to the storage node.
