# 🚀 Quick Deployment Guide for Screenshot Organizer

## Your Docker Hub Username: `abhi40647`

---

## ⚡ FASTEST WAY - Use Automated Script

```powershell
cd screenshot-organizer
.\build-and-deploy.ps1 abhi40647
```

This will:
- ✅ Build both Docker images
- ✅ Push to Docker Hub
- ✅ Deploy to Kubernetes
- ✅ Show you the access URL

---

## 📝 MANUAL DEPLOYMENT (Step by Step)

### Step 1: Build Docker Images

```powershell
cd screenshot-organizer

# Build Backend
cd backend
docker build -t abhi40647/screenshot-organizer-backend:latest .

# Build Frontend
cd ../frontend
docker build -t abhi40647/screenshot-organizer-frontend:latest .

cd ..
```

### Step 2: Login to Docker Hub

```powershell
docker login
# Username: abhi40647
# Password: [your password]
```

### Step 3: Push Images

```powershell
docker push abhi40647/screenshot-organizer-backend:latest
docker push abhi40647/screenshot-organizer-frontend:latest
```

### Step 4: Deploy to Kubernetes

```powershell
# Make sure you're in the right context
kubectl config current-context

# Deploy everything
kubectl apply -f k8s/persistent-volume.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

### Step 5: Check Status

```powershell
# Wait for pods to be ready
kubectl get pods -w

# Check services
kubectl get svc
```

### Step 6: Access Your App

#### If using Minikube:
```powershell
minikube service frontend-service
```

#### If using Docker Desktop:
```powershell
kubectl get svc frontend-service
# Look for the NodePort (e.g., 80:30080/TCP)
# Open: http://localhost:30080
```

---

## 🔍 Quick Commands

```powershell
# View all resources
kubectl get all

# View logs
kubectl logs -l tier=backend
kubectl logs -l tier=frontend

# Restart deployment
kubectl rollout restart deployment backend-deployment
kubectl rollout restart deployment frontend-deployment

# Delete everything
kubectl delete -f k8s/
```

---

## ✅ Your Images on Docker Hub

After pushing, your images will be available at:
- https://hub.docker.com/r/abhi40647/screenshot-organizer-backend
- https://hub.docker.com/r/abhi40647/screenshot-organizer-frontend

---

## 🎯 Expected Result

Once deployed, you should see:
- 2 backend pods running
- 2 frontend pods running
- Backend service (ClusterIP)
- Frontend service (NodePort)
- Persistent volume for data storage

Access the app and you'll be able to:
- ✅ Create an account
- ✅ Login
- ✅ Upload screenshots
- ✅ OCR text extraction
- ✅ Search screenshots
- ✅ Auto-tagging

---

## 🆘 Troubleshooting

### Pods not starting?
```powershell
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Can't access the app?
```powershell
# Try port forwarding
kubectl port-forward svc/frontend-service 8080:80
# Then open: http://localhost:8080
```

### Need to rebuild?
```powershell
# Rebuild and push
docker build -t abhi40647/screenshot-organizer-backend:latest ./backend
docker push abhi40647/screenshot-organizer-backend:latest

# Restart deployment
kubectl rollout restart deployment backend-deployment
```

---

## 📞 Need More Help?

Check the detailed guides:
- `STEP_BY_STEP_DEPLOYMENT.md` - Complete walkthrough
- `KUBERNETES_DEPLOYMENT.md` - Technical reference
