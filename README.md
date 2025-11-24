# 🦍 Kingkong: The Vibe Coding Platform

![Status](https://img.shields.io/badge/Status-Beta_Access-purple)
![AI](https://img.shields.io/badge/AI-Function_Calling_&_Agents-green)
![Infrastructure](https://img.shields.io/badge/Infra-Serverless_&_Node.js-blue)

> **"Stop writing boilerplate. Start Vibe Coding."**
> Kingkong is a Natural Language Development Environment that allows developers and founders to build, execute, and monitor sophisticated backend architectures using only natural language.

---

## 🔮 The Concept: Vibe Coding

Traditional development requires defining models, writing migrations, and configuring servers before logic exists. **Kingkong** flips this workflow using an **AI Agent Workflow**.

You describe the data or the task; the AI builds the infrastructure, generates the schema, and even executes complex logic on demand.

---

## 🚀 Core Features

### 1. 🧠 AI Task Execution & Playground
A dedicated environment to move from "Prompt" to "Production" safely.
* **AI Playground:** A sandbox interface to test natural language queries against your data models before implementing them.
* **Prompt Templates:** Save and reuse complex prompt engineering logic (e.g., *"Find users by country and calculate LTV"*) to streamline recurring tasks.
* **Smart Configuration:** Fine-tune the AI's behavior using the `optimiseTask` toggle to balance speed vs. reasoning depth.
* **Core API:** Programmatic access via `/kingkong/run-tasks` to execute AI-driven logic from external applications.

### 2. 🛠️ Internal Functions & AI Tool Use
Kingkong bridges the gap between text and code. The AI isn't just a chatbot; it is an agent that can use tools.
* **Function Calling (`!func`):** The AI can trigger your custom code via natural language prompts.
    * *Example:* Typing `!sendEmail to all users in Lagos` triggers the internal email function automatically.
* **CRUD Management:** A full suite to Create, Read, Update, and Delete custom internal functions.
* **Execution API:** Dedicated routes (`/internal-functions/:projectId/...`) to trigger these functions manually or via webhooks.

### 3. ☁️ Serverless Architecture
* **Serverless Deployment:** Deploy complex user logic as isolated serverless functions directly from the platform.
* **Scalability:** Designed to handle variable loads without managing physical servers.

### 4. 📊 Observability & Monitoring
A "Mission Control" for your backend application.
* **Centralized Logging Dashboard:** View all system events, function executions, and AI reasoning logs in one place.
* **Advanced Filtering:** Drill down by Severity (Info/Error), Project ID, Date, or specific content keywords.
* **Usage Analytics:** Monitor resource consumption and plan limits via a dedicated analytics route.

---

## 📸 Interface Sneak Peek

<div align="center">
  <img src="./assets/2025-11-24 05_01_52-.png" alt="Kingkong AI Playground" width="800">
  <p><em>Figure 1: The AI Playground for testing Natural Language Queries</em></p>
</div>

---

## 💻 Tech Stack

* **Frontend:** React.js (Playground, Log Dashboard, Function Editor)
* **Backend:** Node.js (API Gateway, Task Orchestration)
* **Infrastructure:** Serverless Functions
* **AI Logic:** LLM Agent Workflow with Tool-Use capabilities

---

## 🛤️ API Highlights

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/kingkong/run-tasks` | Execute a natural language task programmatically. |
| `POST` | `/internal-functions/.../run` | Trigger a specific serverless function. |
| `GET` | `/analytics/usage` | Retrieve project resource consumption. |

---

## 👨‍💻 Author

**Tunde [Last Name]**
*Full Stack Developer & AI Solutions Architect*
[Link to Portfolio]