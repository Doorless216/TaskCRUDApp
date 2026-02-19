# TodoList App - Full Stack CRUD Application

A complete full-stack todo list application with a **React + TypeScript + Vite** frontend and **ASP.NET Core** backend, deployed to **Azure Static Web Apps** and **Azure App Service**.

---

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Environment Setup](#environment-setup)
- [Azure Deployment](#azure-deployment)
- [CORS & API Configuration](#cors--api-configuration)
- [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
TeamProj/
├── frontend/                          # React + Vite frontend
│   ├── src/
│   │   ├── api.ts                    # API client (reads VITE_API_BASE_URL)
│   │   ├── App.tsx
│   │   └── pages/
│   │       └── TodoListItemsPages.tsx
│   ├── .env.local                    # Local dev env (http://localhost:5081)
│   ├── .env.production               # Production env (/api)
│   └── package.json
│
├── backend/                           # ASP.NET Core API
│   └── TodoList/
│       ├── Program.cs                # App configuration (includes CORS fix)
│       ├── Controllers/
│       │   └── TodoListItemsController.cs
│       ├── Properties/
│       │   └── launchSettings.json   # Ports: 5081 (HTTP), 7274 (HTTPS)
│       └── appsettings.json
│
└── .github/workflows/
    └── azure-static-web-apps-blue-rock-0a91f240f.yml  # CI/CD pipeline
```

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Backend** | ASP.NET Core 10, Entity Framework Core |
| **Database** | SQL Server |
| **Deployment** | Azure Static Web Apps (frontend), Azure App Service (backend) |
| **CI/CD** | GitHub Actions |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ (for frontend)
- .NET 10 SDK (for backend)
- SQL Server (local or Docker)
- Git

### Start Backend

```bash
cd backend
dotnet run --project TodoList
```

Backend will start on:
- **HTTP**: `http://localhost:5081`
- **HTTPS**: `https://localhost:7274`

You should see:
```
Now listening on: http://localhost:5081
```

### Start Frontend (separate terminal)

```bash
cd frontend
npm install          # if needed
npm run dev
```

Frontend will start on `http://localhost:5173`

### Test Locally

1. Open browser to **http://localhost:5173**
2. You should see the Todo List page load
3. Try adding/editing/deleting items
4. Check browser console (F12) for any errors

**Frontend uses `.env.local` which points to `http://localhost:5081`**

---

## 🔧 Environment Setup

### Frontend Environment Variables

| File | Variable | Purpose |
|------|----------|---------|
| `.env.local` | `VITE_API_BASE_URL=http://localhost:5081` | Local dev API endpoint |
| `.env.production` | `VITE_API_BASE_URL=/api` | Production API endpoint (relative path) |

### How It Works

1. **Vite reads `.env.local`** during `npm run dev`
2. **GitHub Actions injects `VITE_API_BASE_URL`** from GitHub secret during build
3. **Frontend code** reads it via:
   ```typescript
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5081";
   ```

---

## 🌐 Azure Deployment

### Step 1: Set Up GitHub Secrets

Go to: **GitHub Repo** > Settings > **Secrets and variables** > **Actions** > **New repository secret**

Add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `API_BASE_URL` | Backend API URL | `https://app-todolist.azurewebsites.net` |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_BLUE_ROCK_0A91F240F` | (auto-created) | Already set up |

**Get your backend URL:**
1. Go to Azure Portal
2. Find your App Service (e.g., `app-TodoList`)
3. Copy the homepage URL: `https://app-todolist.azurewebsites.net`
4. Add to GitHub secret as `API_BASE_URL`

### Step 2: Push Changes to GitHub

```bash
git add .
git commit -m "fix: Configure CORS and environment-based API URLs"
git push
```

This triggers the GitHub Actions workflow automatically.

### Step 3: Monitor Deployment

1. Go to your repo on GitHub
2. Click **Actions** tab
3. Watch the `Azure Static Web Apps CI/CD` workflow
4. Wait for ✅ **Build and Deploy Job** to complete

### Step 4: Test Deployed App

Once deployed:
1. Azure Portal shows your Static Web App URL (e.g., `https://blue-rock-0a91f240f.azurestaticapps.net`)
2. Open that URL in browser
3. Test the todo list CRUD operations

---

## 🔐 CORS & API Configuration

### Why CORS Fix Was Needed

**Original problem:**
```csharp
app.UseHttpsRedirection();    // ❌ Redirects first
app.UseCors("AllowFrontend"); // ❌ Then applies CORS
```

CORS **preflight requests** (OPTIONS) were being redirected to HTTPS before CORS was applied → blocked.

### Current Fix (Program.cs)

```csharp
app.UseCors("AllowFrontend");     // ✅ Apply CORS first
app.UseHttpsRedirection();         // ✅ Then redirect
app.UseAuthorization();
app.MapControllers();
```

### CORS Policy

Allows requests from:
- **Local dev**: `http://localhost:5173`
- **Production**: Configured at Azure Static Web App level

```csharp
policy.WithOrigins("http://localhost:5173")
      .AllowAnyHeader()
      .AllowAnyMethod();
```

To add more origins (e.g., production):
```csharp
policy.WithOrigins("http://localhost:5173", "https://your-app.azurestaticapps.net")
```

---

## 🗄️ Database

### Connection String

Located in `backend/TodoList/appsettings.json`:
```json
"ConnectionStrings": {
  "TodoListDbConnection": "Server=localhost,1433;Database=CrudDemo2;User id=sa;Password=...;TrustServerCertificate=True;"
}
```

### Migrations

Auto-applied on startup via `Program.cs`:
```csharp
dbContext.Database.Migrate();
```

**Latest migration** (`20260204202804_renameColumns`):
- Renamed table: `TodoListItems` → `Tasks`
- Renamed column: `Name` → `Title`
- Renamed column: `IsComplete` → `IsCompleted`
- Removed column: `Description` (marked as ignored in DbContext)

---

## 🐛 Troubleshooting

### "Failed to fetch" error in frontend

**Cause:** Frontend can't connect to backend API

**Check:**
1. Is backend running? `http://localhost:5081/api/TodoListItems` should return `[]`
2. Is CORS allowing your frontend origin?
3. Is `.env.local` set correctly?

**Fix:**
```bash
# Kill old processes
taskkill /F /IM dotnet.exe

# Restart backend
cd backend && dotnet run --project TodoList
```

### CORS error in browser console

**Cause:** Backend doesn't allow frontend origin

**Check `Program.cs` CORS policy** and ensure your frontend URL is in `WithOrigins()`

### Port already in use

**Cause:** Another process is using port 5081 or 5173

**Fix:**
```bash
# Windows: find and kill process on port 5081
netstat -ano | findstr :5081
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5081
kill -9 <PID>
```

---

## 📝 API Endpoints

All endpoints return/accept JSON in the format:

```typescript
{
  id: number;
  name: string;
  description: string | null;
  isComplete: boolean;
}
```

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/TodoListItems` | List all items |
| `GET` | `/api/TodoListItems/{id}` | Get single item |
| `POST` | `/api/TodoListItems` | Create new item |
| `PUT` | `/api/TodoListItems/{id}` | Update item |
| `DELETE` | `/api/TodoListItems/{id}` | Delete item |

---

## 📚 Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors)

---

**Last Updated:** Feb 11, 2026
