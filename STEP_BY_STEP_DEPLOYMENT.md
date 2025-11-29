# Screenshot Organizer - Complete Kubernetes Deployment Guide

## 📋 Prerequisites

### 1. Install Required Software

- ✅ **Docker Desktop for Windows** - [Download here](https://www.docker.com/products/docker-desktop)
  - Enable Kubernetes in Docker Desktop settings → Kubernetes → Enable Kubernetes
- ✅ **kubectl** - Usually installed with Docker Desktop
- ✅ **Node.js (LTS)** - [Download here](https://nodejs.org/)
- ✅ **(Optional) Minikube** - Alternative to Docker Desktop Kubernetes

### 2. Verify Installation

```powershell
# Check Docker
docker --version

# Check kubectl
kubectl version --client

# Check Node.js
node --version
```

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: Test App Locally (Optional but Recommended)

```powershell
cd screenshot-organizer

# Test Backend
cd backend
npm install
npm run dev
# Visit http://localhost:3000/api/health

# Test Frontend (in new terminal)
cd ../frontend
npm install
npm run dev
# Visit http://localhost:5173
```

Press `Ctrl+C` to stop both servers.

---

### STEP 2: Create Docker Hub Account

1. Go to https://hub.docker.com
2. Sign up for free account
3. Remember your username (you'll need it!)

---

### STEP 3: Build Docker Images

**Replace `YOUR-USERNAME` with your actual Docker Hub username!**

```powershell
cd screenshot-organizer

# Build Backend Image
cd backend
docker build -t YOUR-USERNAME/screenshot-organizer-backend:latest .

# Build Frontend Image
cd ../frontend
docker build -t YOUR-USERNAME/screenshot-organizer-frontend:latest .

cd ..
```

**Example:** If your username is `john123`:
```powershell
docker build -t john123/screenshot-organizer-backend:latest .
```

---

### STEP 4: Test Docker Images Locally

```powershell
# Test Backend
docker run --rm -p 3000:3000 YOUR-USERNAME/screenshot-organizer-backend:latest
# Visit http://localhost:3000/api/health
# Press Ctrl+C to stop

# Test Frontend
docker run --rm -p 8080:80 YOUR-USERNAME/screenshot-organizer-frontend:latest
# Visit http://localhost:8080
# Press Ctrl+C to stop
```

---

### STEP 5: Push Images to Docker Hub

```powershell
# Login to Docker Hub
docker login
# Enter your username and password

# Push Backend
docker push YOUR-USERNAME/screenshot-organizer-backend:latest

# Push Frontend
docker push YOUR-USERNAME/screenshot-organizer-frontend:latest
```

---

### STEP 6: Update Kubernetes Manifests

**IMPORTANT:** Edit these files and replace `myuser` with your Docker Hub username:

1. Open `k8s/backend-deployment.yaml`
   - Line 21: Change `image: myuser/screenshot-organizer-backend:latest`
   - To: `image: YOUR-USERNAME/screenshot-organizer-backend:latest`

2. Open `k8s/frontend-deployment.yaml`
   - Line 21: Change `image: myuser/screenshot-organizer-frontend:latest`
   - To: `image: YOUR-USERNAME/screenshot-organizer-frontend:latest`

**OR use PowerShell to replace automatically:**

```powershell
# Replace 'myuser' with your actual username
$username = "YOUR-USERNAME"

(Get-Content k8s/backend-deployment.yaml) -replace 'myuser/', "$username/" | Set-Content k8s/backend-deployment.yaml
(Get-Content k8s/frontend-deployment.yaml) -replace 'myuser/', "$username/" | Set-Content k8s/frontend-deployment.yaml
```

---

### STEP 7: Choose Your Kubernetes Environment

#### Option A: Using Docker Desktop Kubernetes (Recommended for Windows)

```powershell
# Check if Kubernetes is enabled in Docker Desktop
kubectl config current-context
# Should show: docker-desktop

# If not, switch to it
kubectl config use-context docker-desktop
```

#### Option B: Using Minikube

```powershell
# Start Minikube
minikube start

# Check status
minikube status

# Set context
kubectl config use-context minikube
```

---

### STEP 8: Deploy to Kubernetes

```powershell
cd screenshot-organizer

# 1. Create Persistent Storage
kubectl apply -f k8s/persistent-volume.yaml

# 2. Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# 3. Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

---

### STEP 9: Verify Deployment

```powershell
# Check all resources
kubectl get all

# Check deployments
kubectl get deployments

# Check pods (wait until all show READY 1/1 or 2/2)
kubectl get pods

# Check services
kubectl get svc
```

**Expected Output:**
```
NAME                                      READY   STATUS    RESTARTS   AGE
pod/backend-deployment-xxxxx-xxxxx        1/1     Running   0          2m
pod/backend-deployment-xxxxx-xxxxx        1/1     Running   0          2m
pod/frontend-deployment-xxxxx-xxxxx       1/1     Running   0          2m
pod/frontend-deployment-xxxxx-xxxxx       1/1     Running   0          2m

NAME                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/backend-service    ClusterIP   10.96.xxx.xxx   <none>        3000/TCP       2m
service/frontend-service   NodePort    10.96.xxx.xxx   <none>        80:30080/TCP   2m
```

---

### STEP 10: Access Your Application

#### If Using Docker Desktop:

```powershell
# Get the NodePort
kubectl get svc frontend-service

# Look for PORT(S) column, e.g., 80:30080/TCP
# The number after the colon (30080) is your NodePort

# Open in browser:
# http://localhost:30080
```

#### If Using Minikube:

**Method 1: Automatic (Easiest)**
```powershell
minikube service frontend-service
# This automatically opens your browser to the correct URL!
```

**Method 2: Manual**
```powershell
# Get Minikube IP
minikube ip
# Example output: 192.168.49.2

# Get NodePort
kubectl get svc frontend-service
# Example: 80:32750/TCP means NodePort is 32750

# Open in browser:
# http://192.168.49.2:32750
```

**⚠️ IMPORTANT:** Use `http://` NOT `https://`

---

## 🔍 TROUBLESHOOTING

### Issue 1: Pods Not Starting

```powershell
# Check pod status
kubectl get pods

# If status is not "Running", describe the pod
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>
```

**Common fixes:**
- Image pull error → Check Docker Hub username in deployment files
- CrashLoopBackOff → Check logs for application errors

### Issue 2: Can't Access Application

```powershell
# Verify service exists
kubectl get svc frontend-service

# Check if pods are ready
kubectl get pods -l tier=frontend

# Test backend directly
kubectl port-forward svc/backend-service 3001:3000
# Visit http://localhost:3001/api/health

# Test frontend directly
kubectl port-forward svc/frontend-service 8080:80
# Visit http://localhost:8080
```

### Issue 3: Image Pull Errors (Local Images)

If you didn't push to Docker Hub and want to use local images:

**For Minikube:**
```powershell
# Build images inside Minikube
eval $(minikube docker-env)

cd screenshot-organizer/backend
docker build -t YOUR-USERNAME/screenshot-organizer-backend:latest .

cd ../frontend
docker build -t YOUR-USERNAME/screenshot-organizer-frontend:latest .

# Update deployments to use local images
# Add this line under 'image:' in both deployment files:
# imagePullPolicy: Never

kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Issue 4: Database/Uploads Not Persisting

```powershell
# Check persistent volume
kubectl get pv
kubectl get pvc

# Describe PVC
kubectl describe pvc backend-pvc
```

---

## 📊 USEFUL COMMANDS

### View Logs
```powershell
# Backend logs
kubectl logs -l tier=backend

# Frontend logs
kubectl logs -l tier=frontend

# Follow logs (live)
kubectl logs -f <pod-name>
```

### Scale Application
```powershell
# Scale backend to 3 replicas
kubectl scale deployment backend-deployment --replicas=3

# Scale frontend to 3 replicas
kubectl scale deployment frontend-deployment --replicas=3
```

### Update Application
```powershell
# After making code changes and building new images:
docker build -t YOUR-USERNAME/screenshot-organizer-backend:v2 ./backend
docker push YOUR-USERNAME/screenshot-organizer-backend:v2

# Update deployment
kubectl set image deployment/backend-deployment backend=YOUR-USERNAME/screenshot-organizer-backend:v2

# Or restart deployment
kubectl rollout restart deployment backend-deployment
```

### Delete Everything
```powershell
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment backend-deployment frontend-deployment
kubectl delete service backend-service frontend-service
kubectl delete pvc backend-pvc
kubectl delete pv backend-pv
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Docker Desktop installed and running
- [ ] kubectl working
- [ ] Docker Hub account created
- [ ] Backend image built and pushed
- [ ] Frontend image built and pushed
- [ ] Kubernetes manifests updated with your username
- [ ] All pods showing "Running" status
- [ ] Services created successfully
- [ ] Application accessible in browser
- [ ] Can create account and login
- [ ] Can upload screenshots
- [ ] OCR text extraction working

---

## 🎯 QUICK DEPLOYMENT SCRIPT

Use the automated script:

```powershell
cd screenshot-organizer
.\build-and-deploy.ps1 YOUR-USERNAME
```

This script does everything automatically!

---

## 📞 NEED HELP?

If you encounter issues:

1. Check pod status: `kubectl get pods`
2. Check logs: `kubectl logs <pod-name>`
3. Describe pod: `kubectl describe pod <pod-name>`
4. Check services: `kubectl get svc`
5. Try port-forwarding: `kubectl port-forward svc/frontend-service 8080:80`

---

## 🎉 CONGRATULATIONS!

Your Screenshot Organizer is now running on Kubernetes!

**Next Steps:**
- Try uploading screenshots
- Test the OCR functionality
- Search through your screenshots
- Scale the application
- Monitor the logs
