# 📸 Screenshot Organizer

Ever taken a screenshot and then spent ages trying to find it later? Yeah, me too. That's why I built this.

Screenshot Organizer is a smart app that helps you upload, organize, and search through your screenshots like a boss. It uses OCR to read the text in your images, automatically tags them, and even detects duplicates so you're not hoarding the same meme 47 times.

## ✨ What It Does

- **Upload Screenshots** - Drag, drop, done. Your screenshots are stored safely.
- **OCR Magic** - Extracts text from images automatically using Tesseract.js, so you can search for that code snippet you screenshotted last week.
- **Smart Tagging** - Automatically tags your screenshots based on what's in them (code, error, meme, etc.).
- **Search Everything** - Full-text search across all your screenshots. Find anything in seconds.
- **Duplicate Detection** - Uses perceptual hashing to spot duplicates, even if they're slightly different.
- **Beautiful Gallery** - Browse your screenshots in a clean, filterable gallery view.

## 🛠️ Built With

**Backend:**
- Node.js & Express - The backbone
- Tesseract.js - OCR text extraction
- Sharp - Image processing
- SQLite - Lightweight database

**Frontend:**
- React - UI framework
- Vite - Lightning-fast dev server
- TailwindCSS - Styling that doesn't make you cry

**Deployment:**
- Docker - Containerization
- Kubernetes - Orchestration (because why not?)

## 🚀 Getting Started

### Running Locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and start uploading!

### Running with Docker

```bash
# Build images
docker build -t abhi40647/screenshot-organizer-backend:latest ./backend
docker build -t abhi40647/screenshot-organizer-frontend:latest ./frontend

# Run with docker-compose (if you have a compose file)
# Or run containers individually
```

### Deploying to Kubernetes

Want to go full cloud-native? Check out [STEP_BY_STEP_DEPLOYMENT.md](STEP_BY_STEP_DEPLOYMENT.md) for detailed Kubernetes deployment instructions.

Quick version:
```bash
# Build and load images
docker build -t abhi40647/screenshot-organizer-backend:latest ./backend
docker build -t abhi40647/screenshot-organizer-frontend:latest ./frontend

# Load into Kubernetes (Minikube example)
minikube image load abhi40647/screenshot-organizer-backend:latest
minikube image load abhi40647/screenshot-organizer-frontend:latest

# Deploy
kubectl apply -f k8s/

# Access the app
minikube service frontend-service
```

## 📡 API Endpoints

- `POST /api/screenshots` - Upload a new screenshot
- `GET /api/screenshots` - Get all screenshots (supports filters)
- `GET /api/screenshots/:id` - Get a specific screenshot
- `DELETE /api/screenshots/:id` - Delete a screenshot
- `GET /api/search?q=query` - Search screenshots by text content

## 🤔 Why I Built This

I take a lot of screenshots - code snippets, error messages, funny tweets, you name it. But finding them later? Nightmare. I wanted something that could actually understand what's in my screenshots and let me search through them like I search through my code.

Plus, I wanted to learn more about OCR, image processing, and Kubernetes deployments. This project scratches all those itches.

## 🐛 Known Issues

- OCR works best with clear, high-contrast text
- Large images might take a moment to process
- Duplicate detection isn't perfect (but it's pretty good!)

## 🤝 Contributing

Found a bug? Have an idea? PRs are welcome! This is a learning project, so don't be shy.

## 📝 License

MIT - Do whatever you want with it.

---

**Built by [@Ohyesabhi28](https://github.com/Ohyesabhi28)**

Made with ☕ and probably too much Stack Overflow
