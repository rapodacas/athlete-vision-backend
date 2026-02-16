# **athlete-vision-backend**  
Backend service for processing athlete media, evaluating performance, and powering coaching tools.

---

## **Overview**

**athlete-vision-backend** is a modular, serverless backend designed to process images and videos of athletes, extract meaningful insights, and support a suite of coaching and scouting tools.  
It provides:

- Media upload, trimming, and evaluation  
- Athlete + team data management  
- Prompt versioning for AI‑powered evaluations  
- Unified routing through a single serverless entrypoint  
- Provider‑agnostic LLM integration (Groq, OpenAI, Gemini, etc.)  
- A clean, future‑proof architecture built for scale  

This backend powers the athlete evaluation workflows used in the EGSL Tryout App and related coaching tools.

---

## **Features**

### **Media Processing**
- Upload raw images and videos  
- Trim videos server‑side  
- Evaluate media using AI models  
- Delete or purge stored media  

### **Athlete Data**
- Create and load player profiles  
- Save player datasets  
- Manage teams and rosters  

### **Prompt Versioning System**
- Create new prompt versions  
- Activate or roll back versions  
- Test prompts against sample media  
- Maintain a full version history for reproducibility  

### **Unified API Router**
A single catch‑all route (`api/[...route].js`) dispatches all backend operations, simplifying deployment and ensuring consistent CORS behavior.

---

## **Tech Stack**

- **Node.js** (ESM modules)  
- **Serverless Functions** (Vercel)  
- **Supabase** (storage + database)  
- **Groq / OpenAI / Gemini** (LLM providers)  
- **Custom CORS middleware**  
- **Modular handler architecture**  

---

## **Project Structure**

```
backend/
  api/
    [...route].js        # Unified router
    _cors.js             # CORS wrapper
  server/
    handlers/            # All API handlers
      upload.js
      trim-video.js
      evaluate-media.js
      create-player.js
      load-players.js
      save-players.js
      list-teams.js
      create-teams.js
      delete-media.js
      purge-all.js
      prompts.js
      prompts-create-version.js
      prompts-activate-version.js
      prompts-rollback.js
      test-evaluate-prompt.js
  lib/
    providers/           # LLM provider integrations
    supabase.js          # Supabase client
    prompts/             # Prompt templates + versioning logic
  package.json
  README.md
```

---

## **API Endpoints**

All endpoints are routed through:

```
/api/[...route]
```

### **Media**
- `POST /api/upload`
- `POST /api/trim-video`
- `POST /api/evaluate-media`
- `DELETE /api/delete-media`
- `POST /api/purge-all`

### **Players**
- `POST /api/create-player`
- `GET /api/load-players`
- `POST /api/save-players`

### **Teams**
- `GET /api/list-teams`
- `POST /api/create-teams`

### **Prompts**
- `GET /api/prompts`
- `POST /api/prompts/create-version`
- `POST /api/prompts/activate-version`
- `POST /api/prompts/rollback`
- `POST /api/test-evaluate-prompt`

---

## **Environment Variables**

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

(Only the providers you enable are required.)

---

## **Development**

Install dependencies:

```
npm install
```

Run locally:

```
vercel dev
```

Or with Node:

```
node api/[...route].js
```

---

## **Deployment**

This backend is designed for **Vercel serverless functions**.

Ensure your Vercel project root is set to the `backend/` folder.

Then deploy:

```
vercel --prod
```

---

## **Future Roadmap**

- Automatic media tagging  
- Pose estimation + biomechanical metrics  
- Real‑time evaluation pipeline  
- Multi‑provider fallback + cost optimization  
- Coach dashboards + analytics  

---

## **License**

MIT License.
