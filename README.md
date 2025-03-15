# Recipe Sorcery 🍳✨

## Overview
Recipe Sorcery is a web application that generates delicious recipes based on the ingredients you provide. Powered by a FastAPI backend and a React frontend built with Vite, shadcn/ui, and TypeScript, this project uses the Groq API to create detailed recipes, including preparation steps, nutritional values, and more. Whether you're a cooking enthusiast or just looking for a quick meal idea, Recipe Sorcery has you covered!

## Features
- **Ingredient-Based Recipe Generation:** Enter a list of ingredients (e.g., tomato, onion, chicken), and get a detailed recipe.
- **Beautiful UI:** A modern, responsive frontend built with React, shadcn/ui, and Tailwind CSS.
- **Nutritional Information:** Get estimated nutritional values for your recipe.
- **Action Buttons:** Save, share, or print your recipes (functionality to be implemented).
- **Fast and Scalable:** Backend powered by FastAPI with a Vite-powered frontend for quick development and deployment.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, shadcn/ui, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Python, Groq API for LLM-based recipe generation
- **Tools:** fnm (Fast Node Manager), npm, Uvicorn

## Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js:** Version 20 or higher (recommended: v22.14.0). Use `fnm` to manage Node.js versions.
- **Python:** Version 3.9 or higher.
- **Git:** To clone the repository.
- **A Groq API Key:** Sign up at [Groq](https://groq.com) to obtain your API key for recipe generation.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/tyagipriyansh07/recipe-sorcery-frontend.git
cd recipe-sorcery-frontend
```

### 2. Set Up Node.js with fnm
#### Install fnm:
On Windows, use:
```powershell
winget install Schniz.fnm
```
For other platforms, follow the instructions at [fnm’s GitHub](https://github.com/Schniz/fnm).

#### Install Node.js v22.14.0:
```powershell
fnm install 22.14.0
fnm use 22.14.0
```
#### Verify Installation:
```powershell
node -v  # Should print v22.14.0
npm -v   # Should print 10.9.2 or similar
```

### 3. Set Up the Backend
#### Navigate to the Backend Directory:
```powershell
cd backend
```
#### Create and Activate a Virtual Environment:
```powershell
python -m venv venv
./venv/Scripts/activate
```
#### Install Backend Dependencies:
```powershell
pip install -r requirements.txt
```
#### Configure the Groq API Key:
Create a `.env` file in the backend directory:
```powershell
echo GROQ_API_KEY=your_api_key_here > .env
```
Replace `your_api_key_here` with your Groq API key (obtain it from Groq).

### 4. Set Up the Frontend
#### Navigate to the Frontend Directory:
```powershell
cd ..
```
#### Install Frontend Dependencies:
```powershell
npm install
```

## Running the Application

### 1. Start the Backend
#### Navigate to the backend directory if not already there:
```powershell
cd backend
```
#### Activate the virtual environment:
```powershell
./venv/Scripts/activate
```
#### Run the FastAPI server:
```powershell
uvicorn app.main:app --reload
```
The backend will run on `http://127.0.0.1:8000`.

Test it by visiting `http://127.0.0.1:8000` in your browser; you should see:
```json
{"message": "Welcome to Recipe Sorcery Backend!"}
```

### 2. Start the Frontend
Open a new terminal and navigate to the recipe-sorcery-frontend directory:
```powershell
cd C:\Users\<YourUsername>\Documents\GitHub\recipe-sorcery-frontend
```
#### Run the Vite development server:
```powershell
npm run dev
```
The frontend will run on `http://localhost:5173` (or another port if 5173 is in use, e.g., `http://localhost:5174`).

## Using the Application
1. **Open the Frontend:**
   - Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).
2. **Generate a Recipe:**
   - Enter ingredients in the input field (e.g., chicken, tomato, onion).
   - Click "Generate Recipe".
   - The application will fetch a recipe from the backend, display it in a `RecipeCard`, and show nutritional values and action buttons (Save, Share, Print).

## Debugging
### Frontend Issues
#### Port Conflicts:
If port `5173` is in use, Vite will automatically try another port (e.g., `5174`). Update the CORS `allow_origins` in `backend/app/main.py` to match the new port:
```python
allow_origins=["http://localhost:5173", "http://localhost:5174"]
```
Alternatively, use the proxy in `vite.config.ts` to avoid CORS issues.

#### Dependencies Fail to Install:
Ensure Node.js is v22.14.0 (`fnm use 22.14.0`).
Clear the npm cache and reinstall:
```powershell
npm cache clean --force
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path package-lock.json -Force
npm install
```

### Backend Issues
#### CORS Errors:
If you see CORS errors in the browser console, ensure the frontend’s origin is in `allow_origins` in `main.py`.
Alternatively, use the proxy by setting the fetch URL in `RecipeForm.tsx` to `/api/generate-recipe`.

#### Groq API Key Missing:
Ensure `GROQ_API_KEY` is set in `backend/.env`.
Restart the backend after updating the `.env` file.

#### Backend Not Running:
Ensure `uvicorn` is running and accessible at `http://127.0.0.1:8000`.
Test with curl:
```powershell
curl -X POST "http://127.0.0.1:8000/api/generate-recipe" -H "Content-Type: application/json" -d "{\"ingredients\": [\"tomato\", \"onion\", \"chicken\"]}"
```

## Contributing
Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements
- **FastAPI** for the backend framework.
- **Vite** for the frontend build tool.
- **shadcn/ui** for the beautiful UI components.
- **Groq** for powering recipe generation with LLM.
