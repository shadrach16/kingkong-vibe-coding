# 🦍 Kingkong: The Vibe Coding Platform

![Status](https://img.shields.io/badge/Status-Beta_Access-purple)
![AI](https://img.shields.io/badge/Powered_by-LLM_Agents-green)
![Stack](https://img.shields.io/badge/Stack-React_|_Node.js_|_AI_Workflow-blue)

> **"Stop writing boilerplate. Start Vibe Coding."**
> Kingkong is a Natural Language Development Environment that eliminates the tedious setup of backend architecture. You describe the data; the AI builds the infrastructure.

---

## 🔮 The Concept: Vibe Coding

Traditional development requires defining models, writing migrations, setting up API endpoints, and configuring data types before you even write a single line of business logic.

**Kingkong** flips this workflow. It uses an **AI Agent Workflow** to translate intent into execution instantly. It allows non-technical founders to build sophisticated data structures and allows senior developers to prototype backends in seconds.

---

## ✨ Key AI Features

### 1. Natural Language to SQL Schema
Don't write `CREATE TABLE` statements. Just tell Kingkong what you need.

> **User Prompt:** *"I need a CRM system to track Customers, their Orders, and a Sales Representative assigned to each."*
>
> **Kingkong Action:** Instantly generates the relational schema, creates the `Customers`, `Orders`, and `SalesReps` tables, and sets up the Foreign Key relationships automatically.

### 2. Automatic Data Type Inference
The AI doesn't just create text fields; it understands context.
* If you ask for "Email", it sets the type to `String (Email Format)`.
* If you ask for "Salary", it sets the type to `Decimal/Float`.
* If you ask for "Date Joined", it sets the type to `Timestamp`.

### 3. Intelligent Visualization Inference (Auto-Charts)
Kingkong analyzes the *shape* of your data to recommend the best way to view it.
* **Categorical Data?** It renders a Bar Chart or Pie Chart automatically.
* **Time-Series Data?** It renders a Line Graph.
* **Geographical Data?** It renders a Map view.
* *No manual configuration required.*

---

## 🛠️ How It Works (The Agent Workflow)

The platform runs on a multi-step AI Agent system:

1.  **Intent Parsing:** The LLM breaks down the user's natural language prompt into technical requirements.
2.  **Schema Generation:** The Agent constructs a JSON representation of the database structure.
3.  **Execution:** The Node.js backend executes the schema changes directly on the database.
4.  **UI Hydration:** The React frontend automatically generates forms and tables to match the new schema.

---

## 📸 Demo

*(Placeholder for screenshots. Recommended: Show a split screen. Left side: A simple text prompt. Right side: A fully built table and dashboard.)*

<div align="center">
  <img src="./assets/2025-11-24 05_01_52-.png" alt="Kingkong Interface" width="800">
</div>

---

## 💻 Tech Stack

* **Frontend:** React.js (Dynamic Form Generation, Dashboarding)
* **Backend:** Node.js (Schema Management, API Layer)
* **AI Logic:** LLM Agent Workflow (Prompt Chaining, Context Management)
* **Database:** (SQL/NoSQL agnostic architecture)

---

## 🚀 Future Roadmap

* [ ] **Voice-to-Schema:** Build backends using voice commands.
* [ ] **API Export:** One-click export of the generated backend to a standalone Express.js app.
* [ ] **Integration:** Connect with Zapier/Webhooks for external automation.

---

## 👨‍💻 Author

**Tunde Oluwamo**
*Full Stack Developer & AI Integrations Specialist*
[ linkedin.com/in/oluwamo-shadrach-740242185 ]