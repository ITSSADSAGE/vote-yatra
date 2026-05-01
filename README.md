# VoteYatra – AI-Powered Guided Voting Assistant

[![Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-blueviolet)](https://deepmind.google/technologies/gemini/)
[![Status](https://img.shields.io/badge/Status-Live-success)](http://localhost:3000)
[![Tech](https://img.shields.io/badge/Stack-Node%20%2F%20Express%20%2F%20JS-blue)](https://nodejs.org/)

## 🇮🇳 Overview

**VoteYatra** is a specialized civic assistant designed to help Indian citizens navigate the voting process with ease. By combining rule-based eligibility logic with the intelligence of **Google Gemini 2.0 Flash**, it provides a personalized, step-by-step journey tailored to your specific age and registration status.

Instead of a generic chatbot, VoteYatra delivers a structured, action-oriented flow that guides you from registration to the polling booth.

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

* 📍 **Beta: Polling Booth Locator**
  Interactive map feature using **OpenStreetMap (Overpass API)** to help users find their nearest polling station in real-time.

* 🎯 **Clean UI**
  Designed for clarity, readability, and quick understanding

---

## How It Works

1. User enters age and selects voting status
2. Decision engine determines eligibility and flow
3. Backend calls Google Gemini API (with persona-aware prompt engineering)
4. Structured response is generated
5. Frontend renders a guided journey
6. User completes simulation

---

## Tech Stack

### Frontend
* HTML, CSS, JavaScript (Modern UI with Glassmorphism)

### Backend
* Node.js / Express.js
* Google Generative AI (Gemini 2.0 Flash)

### Google Technologies Used

* **Google Gemini API**
  Used to generate structured and personalized voting guidance. Now updated to use **Gemini 2.0 Flash** via direct API integration for maximum performance.

* **Google Cloud Run**
  Used to deploy backend securely and manage environment variables.

* **Google Antigravity**
  Used for prompt-driven development and rapid iteration.

---

## 🚀 Recent Updates & Fixes

The system has been recently upgraded to leverage **Gemini 2.0 Flash** with a focus on speed and reliability:

1.  **Persona-Specific Accuracy Fix**: 
    Previously, different user personas (e.g., "Not Registered" vs "First Time Voter") occasionally received similar generic advice. We fixed this by implementing **Status-Aware Prompt Engineering**. The AI is now strictly constrained to provide specific starting points based on the user's situation (e.g., forcing Form 6 registration steps for unregistered users).

2.  **Direct API Integration**: 
    Bypassed SDK overhead to use direct HTTPS calls for faster response times and better compatibility with Gemini 2.0 Flash.

3.  **Dual-Model Fallback**: 
    Primary use of `gemini-2.0-flash` with automatic fallback to `gemini-1.5-flash` ensuring 100% availability.

4.  **ECI Reliability Layer**: 
    A specialized fallback system that delivers static, verified Election Commission of India (ECI) guidelines if AI services are unreachable.

5.  **Live Booth Locator (Beta)**: 
    Integrated Geolocation and OpenStreetMap data to provide a functional booth finder within the guided journey.

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

* Multilingual support
* Real-time election updates
* Deep integration with ECI candidate data

---

## License

For educational and hackathon use
