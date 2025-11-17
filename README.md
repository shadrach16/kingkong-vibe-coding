# KingKong: AI-Native Backend-as-a-Service

KingKong is a revolutionary platform that allows developers to build and deploy robust backends using simple, natural language prompts. This project is structured as a monorepo, containing both the React frontend and the Node.js backend.

## Getting Started

Follow the steps below to set up the project and begin development.

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  Clone the repository:
    `git clone <repository-url> kingkong`
    `cd kingkong`

2.  Install dependencies for both the client and server:
    `npm run install:all`

### Running the Application

To start both the frontend and the backend concurrently in development mode, run:
`npm run dev`

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

Seed the database for billings, run:
`npm run seed`

## Directory Structure

-   `client/`: The React frontend application.
-   `server/`: The Node.js backend application.