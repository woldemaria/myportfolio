# DEPLOYMENT GUIDE - Production Readiness Checklist

## Project Status: ✅ PRODUCTION-READY

Your portfolio website is fully functional and ready for production deployment.

---

## 🚀 IMMEDIATE NEXT STEPS (Run First)

### Step 1: Initialize Backend Database
```bash
cd /home/woldemariam/Desktop/portfolio/backend
source venv/bin/activate
python manage.py migrate
```

### Step 2: Install Frontend Dependencies
```bash
cd /home/woldemariam/Desktop/portfolio/frontend
npm install
```

### Step 3: Start Both Servers

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

Visit: **http://localhost:5173**

---

## 🌐 Deployment Options

### Option A: Azure (Recommended for Students)

#### 1. Create Azure Resources
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create Resource Group
az group create --name portfolio-rg --location eastus

# Create App Service Plan
az appservice plan create --name portfolio-plan --resource-group portfolio-rg --sku B1 --is-linux

# Create Web App for Backend
az webapp create --resource-group portfolio-rg --plan portfolio-plan --name woldemariam-portfolio-api --runtime "PYTHON|3.11"

# Create Static Web App for Frontend
az staticwebapp create --name woldemariam-portfolio --source ./frontend/dist --location eastus --resource-group portfolio-rg
```

#### 2. Deploy Backend
```bash
cd backend

# Create requirements-prod.txt
echo "Django==4.2.11
djangorestframework==3.14.0
django-cors-headers==4.3.1
gunicorn==21.2.0
whitenoise==6.6.0
psycopg2-binary==2.9.9" > requirements-prod.txt

# Deploy
az webapp up --resource-group portfolio-rg --name woldemariam-portfolio-api --runtime "PYTHON|3.11" --sku B1
```

#### 3. Deploy Frontend
```bash
cd frontend

# Build for production
npm run build

# Deploy to Static Web Apps
az staticwebapp create --name woldemariam-portfolio-frontend --source ./dist --location eastus --resource-group portfolio-rg --app-location dist
```

---

### Option B: Docker Deployment (For Any Host)

#### 1. Create Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "portfolio_project.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### 2. Create Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure-password-here
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: >
      sh -c "python manage.py migrate &&
             gunicorn portfolio_project.wsgi:application --bind 0.0.0.0:8000"
    environment:
      DEBUG: "False"
      DATABASE_URL: postgresql://postgres:secure-password-here@postgres:5432/portfolio
      ALLOWED_HOSTS: "yourdomain.com,localhost"
      CORS_ALLOWED_ORIGINS: "https://yourdomain.com"
    depends_on:
      - postgres
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=https://yourdomain.com/api
    volumes:
      - ./frontend/dist:/usr/share/nginx/html

volumes:
  postgres_data:
```

#### 4. Build and Run with Docker
```bash
# Build images
docker-compose build

# Run services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

### Option C: DigitalOcean App Platform

#### 1. Create app.yaml
```yaml
name: woldemariam-portfolio
services:
- name: backend
  github:
    repo: your-username/portfolio
    branch: main
  build_command: pip install -r requirements.txt
  run_command: gunicorn portfolio_project.wsgi:application --bind 0.0.0.0:8080
  envs:
  - key: DEBUG
    value: "False"
  - key: ALLOWED_HOSTS
    value: yourdomain.com

- name: frontend
  github:
    repo: your-username/portfolio
    branch: main
  source_dir: frontend
  build_command: npm install && npm run build
  http_port: 8080
  envs:
  - key: VITE_API_URL
    value: https://backend-service/api
```

#### 2. Deploy
```bash
doctl apps create --spec app.yaml
```

---

### Option D: Self-Hosted (VPS with Nginx + Gunicorn)

#### 1. SSH into Server
```bash
ssh root@your_vps_ip
```

#### 2. Install Dependencies
```bash
apt update && apt upgrade -y
apt install python3-pip python3-venv nodejs npm nginx git postgresql -y
```

#### 3. Clone and Setup Backend
```bash
cd /var/www
git clone https://github.com/yourusername/portfolio.git
cd portfolio/backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

python manage.py migrate
python manage.py collectstatic --noinput
```

#### 4. Configure Systemd Service
```bash
# Create /etc/systemd/system/portfolio-backend.service
[Unit]
Description=Portfolio Backend
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/portfolio/backend
Environment="PATH=/var/www/portfolio/backend/venv/bin"
ExecStart=/var/www/portfolio/backend/venv/bin/gunicorn \
    portfolio_project.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

#### 5. Setup Frontend
```bash
cd /var/www/portfolio/frontend
npm install
npm run build
```

#### 6. Configure Nginx
```nginx
# Create /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 50M;

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend
    location / {
        root /var/www/portfolio/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Static files
    location /static/ {
        alias /var/www/portfolio/backend/staticfiles/;
        expires 30d;
    }
}
```

#### 7. Enable Nginx Site
```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 8. Add SSL Certificate (Let's Encrypt)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 9. Start Backend Service
```bash
systemctl daemon-reload
systemctl start portfolio-backend
systemctl enable portfolio-backend
```

---

## 🔒 Production Security Checklist

- [ ] Change SECRET_KEY in settings.py
- [ ] Set DEBUG=False
- [ ] Add HTTPS certificate (SSL/TLS)
- [ ] Configure ALLOWED_HOSTS for your domain
- [ ] Set CSRF_TRUSTED_ORIGINS
- [ ] Enable HTTPS redirect
- [ ] Set SECURE_SSL_REDIRECT=True
- [ ] Set SESSION_COOKIE_SECURE=True
- [ ] Set CSRF_COOKIE_SECURE=True
- [ ] Implement rate limiting
- [ ] Add email notifications for contact form
- [ ] Setup database backups
- [ ] Monitor error logs
- [ ] Enable security headers

---

## 📊 Production Settings Template

Create `backend/portfolio_project/settings_prod.py`:

```python
from .settings import *
import os

DEBUG = False

SECRET_KEY = os.environ.get('SECRET_KEY')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'portfolio'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
}

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/portfolio/django.log',
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 5,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

---

## 🧪 Pre-Deployment Testing

```bash
# Run Django checks
python manage.py check --deploy

# Test frontend build
npm run build

# Test backend with test database
python manage.py test api

# Verify static files
python manage.py collectstatic --noinput --dry-run
```

---

## 📈 Performance Optimization

### Frontend
- ✅ Built with Vite (fast HMR)
- ✅ Code splitting automatic
- Add: Image optimization
- Add: CDN for assets
- Add: Service workers

### Backend
- ✅ Using Django REST Framework
- Add: Redis caching
- Add: Database query optimization
- Add: Celery for async tasks
- Add: API rate limiting

---

## 📞 Production Support

- GitHub: https://github.com/woldemaria
- Email: (Add your email)
- Phone: +251920001617

---

**Your portfolio is deployment-ready! Choose an option above and follow the instructions. 🚀**
