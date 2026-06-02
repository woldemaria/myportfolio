# QUICK START GUIDE - Woldemariam Abi Portfolio

## ✅ All Files Created Successfully

Your complete production-ready portfolio website has been scaffolded in:
```
/home/woldemariam/Desktop/portfolio/
```

## 🚀 EXACT COMMANDS TO RUN (Copy & Paste)

### Terminal 1: Backend Setup (Django)
```bash
cd /home/woldemariam/Desktop/portfolio/backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver 0.0.0.0:8000
```

**Expected Output:**
```
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

### Terminal 2: Frontend Setup (React + Vite)
```bash
cd /home/woldemariam/Desktop/portfolio/frontend

npm install

npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 📋 What Was Created

### Backend Structure (Django + DRF)
```
backend/
├── portfolio_project/
│   ├── __init__.py
│   ├── settings.py           # CORS configured for localhost:5173
│   ├── urls.py               # Routes to /api/
│   └── wsgi.py
├── api/
│   ├── __init__.py
│   ├── admin.py              # Django admin for contact messages
│   ├── apps.py
│   ├── models.py             # ContactMessage model
│   ├── serializers.py        # Validation schemas
│   ├── views.py              # API endpoints
│   └── urls.py               # API routes
├── manage.py
├── requirements.txt
├── db.sqlite3                # Created after migrate
└── venv/                     # Created after python3 -m venv venv
```

### Frontend Structure (React + Tailwind)
```
frontend/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main component (full implementation)
│   ├── index.css             # Global Tailwind styles
│   └── App.css               # Component styles
├── public/
├── index.html                # HTML entry point
├── package.json              # Dependencies configured
├── vite.config.js
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js
└── node_modules/             # Created after npm install
```

## 🔌 API Endpoints

### Get all projects
```
GET http://127.0.0.1:8000/api/projects
```
Returns 3 real software engineering projects with tech stack and GitHub links.

### Submit contact form
```
POST http://127.0.0.1:8000/api/contact
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your@email.com",
  "message": "Your message here"
}
```

## 🎨 Frontend Features Implemented

✅ **Hero Section**
  - Professional introduction as "Woldemariam Abi - Software Engineering Student"
  - Call-to-action buttons (View Projects, Get In Touch)
  - Social media links (GitHub, TikTok, YouTube, Facebook)
  - Contact phone number

✅ **Projects Section**
  - Fetches from `/api/projects` on component mount
  - Displays 3 projects in responsive grid
  - Hover animations with smooth transitions
  - Tech stack badges
  - GitHub links

✅ **Contact Form**
  - Name, Email, Message fields
  - Form validation (client-side shown, server-side enforced)
  - Loading state during submission
  - Success message display
  - Error handling with user feedback
  - Auto-clears on success

✅ **Design**
  - Dark theme with blue accents
  - Fully responsive (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Professional styling with Tailwind CSS
  - Fixed navigation bar

## 🔐 Backend Features Implemented

✅ **CORS Middleware**
  - Configured to allow localhost:5173
  - Also allows localhost:3000, 127.0.0.1:5173

✅ **Contact API (`/api/contact`)**
  - Accepts POST requests
  - Validates name (min 2 chars), email, message (min 10 chars)
  - Saves to SQLite database
  - Logs to console with formatted output
  - Returns success/error response

✅ **Projects API (`/api/projects`)**
  - Returns 3 hardcoded real projects:
    1. E-Commerce API Platform
    2. Task Management Dashboard
    3. Weather Finder Application
  - Each project has: title, description, tech_stack (array), github_link
  - No mock data generators

✅ **Database**
  - SQLite for development
  - ContactMessage model stores: name, email, message, created_at, ip_address
  - Accessible via Django admin at /admin/

## 📊 Tech Stack

**Frontend:**
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.4.1
- React DOM 18.2.0

**Backend:**
- Django 4.2.11
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- Python 3.10+

**Deployment Ready:**
- Gunicorn
- Can deploy to Azure, AWS, Heroku, DigitalOcean

## 🎯 First Time Running

1. **Open Terminal 1:**
   ```bash
   cd /home/woldemariam/Desktop/portfolio/backend
   source venv/bin/activate
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Open Terminal 2:**
   ```bash
   cd /home/woldemariam/Desktop/portfolio/frontend
   npm run dev
   ```

3. **Visit:** http://localhost:5173

4. **Test:**
   - Fill out contact form and submit
   - Watch backend terminal for logged message
   - View projects load from API
   - Click social media links

## 🔍 Verification Checklist

After running both servers:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend runs at http://127.0.0.1:8000
- [ ] Hero section displays with social links
- [ ] Projects section shows 3 projects fetched from API
- [ ] Contact form sends data and shows success message
- [ ] Backend console shows formatted contact message
- [ ] Navigation links scroll smoothly
- [ ] Mobile responsive on different screen sizes

## 🛠️ If You Need to Rebuild

**Clear and reinstall backend:**
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Clear and reinstall frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Social Media & Contact (Already Integrated)

- GitHub: https://github.com/woldemaria
- TikTok: https://www.tiktok.com/@woldemary
- YouTube: https://www.youtube.com/@WoldemaryAbi
- Facebook: Woldemariam Abi Techane
- Phone: +251920001617
- Telegram: @myusernamewolde

## 🎓 Next Steps for Production

1. **Change SECRET_KEY** in `backend/portfolio_project/settings.py`
2. **Set DEBUG=False** for production
3. **Use PostgreSQL** instead of SQLite
4. **Add HTTPS** certificate
5. **Deploy to Azure/AWS** using deployment guides in README.md
6. **Add email notifications** for contact form
7. **Implement rate limiting** for API

## ❓ Troubleshooting

**Backend won't start:**
- Make sure port 8000 is free: `lsof -i :8000`
- Activate venv: `source venv/bin/activate`
- Check Python version: `python --version` (should be 3.10+)

**Frontend won't start:**
- Make sure port 5173 is free: `lsof -i :5173`
- Clear npm cache: `npm cache clean --force`
- Ensure Node 18+: `node --version`

**CORS errors:**
- Check backend/portfolio_project/settings.py CORS_ALLOWED_ORIGINS
- Backend must be running
- Frontend must be on localhost:5173

**Can't import modules:**
- Ensure venv is activated (should see (venv) in terminal)
- Run `pip install -r requirements.txt` again

---

**Your portfolio is ready to run! Start with Terminal 1 and Terminal 2 commands above. 🚀**
