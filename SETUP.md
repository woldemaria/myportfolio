# Portfolio Website - Complete Setup Guide

## Project Structure

```
portfolio/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── backend/
│   ├── portfolio_project/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/ (created after setup)
└── SETUP.md
```

## EXACT SETUP COMMANDS

### 1. Initialize Frontend (React + Vite + Tailwind)

```bash
cd /home/woldemariam/Desktop/portfolio/frontend

# Create Vite React app
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install Tailwind CSS and its peer dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind configuration
npx tailwindcss init -p

# Install additional UI utilities (optional but recommended)
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Ready to run
npm run dev
```

### 2. Initialize Backend (Django)

```bash
cd /home/woldemariam/Desktop/portfolio/backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies from requirements.txt (provided below)
pip install -r requirements.txt

# Create Django superuser (optional)
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Start the backend server
python manage.py runserver 0.0.0.0:8000
```

## Backend requirements.txt

```
Django==4.2.11
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
gunicorn==21.2.0
Pillow==10.2.0
```

## Running the Full Stack

**Terminal 1 - Backend:**
```bash
cd /home/woldemariam/Desktop/portfolio/backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd /home/woldemariam/Desktop/portfolio/frontend
npm run dev
```

Frontend will be available at: http://localhost:5173
Backend will be available at: http://localhost:8000
API endpoints will be at: http://localhost:8000/api/
