# VoteYatra – Guided Voting Assistant

## Overview

VoteYatra is an AI-powered assistant that helps users understand the voting process through a structured, step-by-step journey.

Instead of a chatbot, it delivers a guided flow based on the user’s context (age and voting status), making the process clear, actionable, and easy to follow.

---

## Problem

Many first-time voters struggle to understand:

* How to register
* What steps to follow
* What happens on voting day

Information exists, but it is scattered and not structured.

---

## Solution

VoteYatra converts the voting process into a guided journey:

* Personalized based on user status
* Broken into simple, actionable steps
* Supported by real-world context and explanations

---

## Key Features

* 🧠 **Decision Engine**
  Determines user path based on age and voting status

* 🤖 **AI Guidance (Google Gemini)**
  Generates structured voting steps with:
  * Description
  * Why it matters
  * Action
  * Tip

* 🪜 **Step-by-Step Flow**
  Clear, sequential guidance instead of unstructured chat

* 🗳️ **Voting Simulation**
  Helps users understand the actual polling process

* 🛡️ **Fallback System**
  Ensures reliable output even if AI fails

* 🎯 **Clean UI**
  Designed for clarity, readability, and quick understanding

---

## How It Works

1. User enters age and selects voting status
2. Decision engine determines eligibility and flow
3. Backend calls Google Gemini API
4. Structured response is generated
5. Frontend renders a guided journey
6. User completes simulation

---

## Tech Stack

### Frontend
* HTML, CSS, JavaScript

### Backend
* Node.js
* Express.js

### Google Technologies Used

* **Google Gemini API**
  Used to generate structured and personalized voting guidance

* **Google Cloud Run**
  Used to deploy backend securely and manage environment variables

* **Google Antigravity**
  Used for prompt-driven development and rapid iteration

---

## System Design

VoteYatra follows a hybrid architecture:

* **Rule-Based Logic** → handles eligibility and user classification
* **AI Layer (Gemini)** → generates structured guidance
* **Fallback Layer** → ensures consistent output

This ensures both accuracy and reliability.

---

## Key Differentiator

VoteYatra is not a chatbot.

It combines:
* Decision logic
* AI-generated structured output
* Interactive simulation

to create a guided system rather than a conversational one.

---

## Setup

### Clone
```bash
git clone https://github.com/ITSSADSAGE/vote-yatra
```

### Backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
GEMINI_API_KEY=your_key_here
PORT=3000
```

Run:
```bash
npm start
```

### Frontend
Open `frontend/index.html`

---

## Deployment

Backend is deployed using Google Cloud Run for:
* Secure API handling
* Scalability
* Reliability

---

## Future Scope

* Polling booth locator (OpenStreetMap based)
* Multilingual support
* Real-time election updates

---

## License

For educational and hackathon use
