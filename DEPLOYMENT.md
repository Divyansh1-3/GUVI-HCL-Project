# 🚀 Deployment Guide - SolveX AI Document Q&A System

## 🌐 **Deploy to Vercel (Recommended)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy Frontend**
```bash
cd frontend
vercel --prod
```

### **Step 4: Deploy Backend to Railway/Render**
Since Vercel doesn't support long-running Python processes, deploy backend separately:

#### **Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder
4. Add environment variables:
   - `OPENAI_API_KEY=your_key_here`
   - `DATABASE_URL=sqlite:///./document_qa.db`
   - `CHROMA_PERSIST_DIRECTORY=./chroma_db`

#### **Option B: Render**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🌐 **Deploy to Netlify + Railway**

### **Frontend (Netlify)**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/build`

### **Backend (Railway)**
1. Deploy backend to Railway as described above
2. Update frontend API URL to point to Railway backend

## 🌐 **Deploy to Heroku**

### **Step 1: Create Heroku App**
```bash
heroku create your-app-name
```

### **Step 2: Add Buildpacks**
```bash
heroku buildpacks:add heroku/python
heroku buildpacks:add heroku/nodejs
```

### **Step 3: Set Environment Variables**
```bash
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set DATABASE_URL=sqlite:///./document_qa.db
```

### **Step 4: Deploy**
```bash
git push heroku main
```

## 🌐 **Deploy to DigitalOcean App Platform**

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Configure:
   - **Frontend**: Node.js, build command: `cd frontend && npm run build`
   - **Backend**: Python, run command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🔧 **Environment Variables for Production**

Make sure to set these in your hosting platform:

```env
OPENAI_API_KEY=your_actual_openai_api_key
DATABASE_URL=sqlite:///./document_qa.db
CHROMA_PERSIST_DIRECTORY=./chroma_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAX_FILE_SIZE=10485760
UPLOAD_DIRECTORY=./uploads
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📱 **Quick Deploy Commands**

### **Vercel (Frontend Only)**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### **Railway (Backend)**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

## 🎯 **Recommended Deployment Strategy**

1. **Frontend**: Deploy to Vercel (free, fast, easy)
2. **Backend**: Deploy to Railway (free tier, supports Python)
3. **Database**: Use Railway's PostgreSQL or keep SQLite
4. **File Storage**: Use Railway's persistent storage

## 🔗 **After Deployment**

1. Update CORS settings in backend
2. Update API URLs in frontend
3. Test all functionality
4. Share your live demo link!

## 📋 **Checklist for Production**

- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] File upload limits appropriate
- [ ] Database persistence configured
- [ ] Error handling in place
- [ ] API documentation accessible
- [ ] Frontend builds successfully
- [ ] All features tested

---

**Your project will be live and accessible to anyone with the URL!** 🚀
