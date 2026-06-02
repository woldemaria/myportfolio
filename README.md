# Portfolio Website - Complete Setup & Deployment Guide

## Overview
This is a professional, production-ready portfolio website for Woldemariam Abi (Software Engineering Student) built with:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Django REST Framework + SQLite
- **Deployment**: Ready for Azure, AWS, or self-hosted environments

## Quick Start (5 Minutes)

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Setup

#### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The backend will start at: **http://127.0.0.1:8000**

#### 2. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: **http://localhost:5173**

## What's Included

### Backend Features
✅ Django REST Framework with CORS enabled  
✅ Two API endpoints: `/api/projects` and `/api/contact`  
✅ Proper input validation with Django Serializers  
✅ Contact messages logged to console and database  
✅ Ready for production deployment with Gunicorn  

### Frontend Features
✅ Hero section with call-to-action buttons  
✅ Projects grid with hover animations  
✅ Fully controlled contact form with validation  
✅ Real-time API integration with fetch  
✅ Loading and error states  
✅ Responsive mobile-first design  
✅ Tailwind CSS styling  
✅ Social media links and contact information  

## API Endpoints

### GET /api/projects
Returns a list of 3 software engineering projects with:
- title
- description
- tech_stack (array)
- github_link

**Example Response:**
```json
{
  "status": "success",
  "count": 3,
  "data": [
    {
      "title": "E-Commerce API Platform",
      "description": "...",
      "tech_stack": ["Django", "REST Framework", "PostgreSQL"],
      "github_link": "https://github.com/woldemaria/ecommerce-api"
    }
  ]
}
```

### POST /api/contact
Accepts contact form data and saves to database.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss..."
}
```

**Response on Success (201):**
```json
{
  "status": "success",
  "message": "Your message has been received successfully!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "...",
    "created_at": "2026-06-02T12:34:56.123456Z"
  }
}
```

## Directory Structure

```
portfolio/
├── backend/
│   ├── portfolio_project/
│   │   ├── settings.py         # Django configuration
│   │   ├── urls.py             # URL routing
│   │   ├── wsgi.py             # WSGI application
│   │   └── __init__.py
│   ├── api/
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # Data validation
│   │   ├── models.py           # Database models
│   │   ├── urls.py             # API routes
│   │   ├── admin.py            # Django admin
│   │   ├── apps.py             # App configuration
│   │   └── __init__.py
│   ├── manage.py               # Django CLI
│   ├── requirements.txt        # Python dependencies
│   ├── db.sqlite3              # Database (created after migrate)
│   └── venv/                   # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global styles
│   │   └── App.css             # Component styles
│   ├── public/                 # Static assets
│   ├── index.html              # HTML entry point
│   ├── package.json            # npm dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   └── postcss.config.js       # PostCSS configuration
│
└── SETUP.md                    # This file
```

## Production Deployment

### Option 1: Deploy to Azure App Service

#### Backend
```bash
# Inside backend directory
az webapp up --name woldemariam-portfolio-api --resource-group myResourceGroup --runtime "PYTHON|3.11"
```

#### Frontend
```bash
# Build frontend
npm run build

# Deploy to Azure Static Web Apps
az staticwebapp create --name woldemariam-portfolio --source ./frontend/dist --location eastus
```

### Option 2: Deploy with Docker

#### Docker Compose (Both Services)
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DEBUG: "False"
      ALLOWED_HOSTS: "yourdomain.com"

  frontend:
    build: ./frontend
    ports:
      - "80:3000"
    depends_on:
      - backend
```

### Option 3: Self-Hosted (VPS/DigitalOcean)

#### Backend with Gunicorn
```bash
source venv/bin/activate
pip install gunicorn
gunicorn portfolio_project.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

#### Frontend with Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/portfolio/frontend/dist;
    index index.html;
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
    }
    
    location / {
        try_files $uri /index.html;
    }
}
```

## Environment Variables (Production)

Create a `.env` file in the backend directory:

```
DEBUG=False
SECRET_KEY=your-production-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/portfolio_db
ENVIRONMENT=production
```

## Troubleshooting

### "Cannot POST /api/contact"
- Ensure backend is running on port 8000
- Check CORS settings in backend/portfolio_project/settings.py
- Verify the backend URL in frontend/src/App.jsx

### "Projects not loading"
- Check browser console for errors
- Verify backend is returning data from /api/projects
- Check CORS error messages in network tab

### "Module not found" errors in backend
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

### Frontend build errors
- Delete node_modules and package-lock.json
- Run: `npm install` again
- Ensure Node.js version is 18+

## Features Implemented

✅ **CORS Middleware** - Allows requests from http://localhost:5173  
✅ **Data Validation** - Pydantic-like validation using Django Serializers  
✅ **Contact Form** - POST endpoint with console logging  
✅ **Projects API** - GET endpoint with hardcoded real projects  
✅ **Hero Section** - Professional introduction with CTA buttons  
✅ **Projects Grid** - Responsive cards with hover animations  
✅ **Contact Form** - Fully controlled React component  
✅ **Error Handling** - Network errors, validation errors, loading states  
✅ **Social Links** - GitHub, TikTok, YouTube, Facebook, Phone  
✅ **Responsive Design** - Mobile, tablet, desktop layouts  

## Customization

### Change Contact Information
Edit in `frontend/src/App.jsx`:
- GitHub: https://github.com/woldemaria
- TikTok: https://www.tiktok.com/@woldemary
- YouTube: https://www.youtube.com/@WoldemaryAbi
- Facebook: https://www.facebook.com/woldemariam.abi.techane
- Phone: +251920001617

### Add More Projects
Edit `backend/api/views.py` in the `projects_list` function

### Change Colors/Styling
Edit `frontend/tailwind.config.js` and `frontend/src/index.css`

## Performance Optimization

- Frontend: Built with Vite for fast HMR and optimized production builds
- Backend: Uses Django's efficient ORM and REST Framework caching
- Images: Optimize and serve via CDN in production
- Database: Migrate to PostgreSQL for production workloads

## Security Notes

- Change SECRET_KEY in production
- Set DEBUG=False in production
- Use HTTPS in production
- Implement rate limiting for contact form
- Add CSRF token validation
- Use environment variables for sensitive data

## Testing

### Backend Tests
```bash
python manage.py test api
```

### Frontend Tests (with Vitest)
```bash
npm run test
```

## Support & Contact

- GitHub: https://github.com/woldemaria
- Email: (Add your email)
- Phone: +251920001617

---

Built with ❤️ by Woldemariam Abi | 2026
