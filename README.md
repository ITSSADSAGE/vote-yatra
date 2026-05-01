# VoteYatra

VoteYatra is an interactive platform designed to guide users through personalized voting scenarios and simulations.

## Project Structure

- `frontend/`: Vanilla HTML/CSS/JS frontend.
- `backend/`: Node.js Express server with Gemini AI integration.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file in the `backend/` directory with:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   PORT=5000
   ```
4. `npm start`

### Frontend
1. Open `frontend/index.html` in a browser or use a live server.

## Why VoteYatra Stands Out

Unlike generic chatbot solutions, VoteYatra combines:

* Rule-based decision logic for accurate user classification
* AI-generated personalized guidance using Google Gemini
* Real-time fallback system to ensure reliability
* Interactive simulation of the voting process

This hybrid approach ensures both correctness and engagement, making the experience practical, trustworthy, and easy to follow.
