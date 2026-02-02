# LMS Setup Guide

Complete setup instructions for the Learning Management System (LMS) on Linux and Windows.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Linux Setup](#linux-setup)
3. [Windows Setup](#windows-setup)
4. [macOS Setup](#macos-setup)
5. [Manual Setup (All Platforms)](#manual-setup-all-platforms)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Global Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v5.0 or higher (local or Atlas connection)
- **Git**: v2.0 or higher
- **RAM**: Minimum 2GB
- **Disk Space**: Minimum 500MB

### Checking Your Versions

```bash
node --version      # Should be v18+
npm --version       # Should be v9+
git --version       # Should be v2+
mongod --version    # Should be v5+
```

---

## Linux Setup

### Quick Setup (One Command)

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/mdhasim-1406/Learning-Management-System/main/scripts/setup-linux.sh
chmod +x setup-linux.sh
./setup-linux.sh
```

### Step-by-Step Setup

#### 1. Clone Repository

```bash
git clone https://github.com/mdhasim-1406/Learning-Management-System.git
cd Learning-Management-System
```

#### 2. Install MongoDB

**Debian/Ubuntu:**
```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongod --version
```

**Fedora/RedHat/CentOS:**
```bash
# Install MongoDB
sudo dnf install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Arch Linux:**
```bash
# Install MongoDB
sudo pacman -S mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Install Node.js & npm

**Using NodeSource Repository (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Using NVM (Recommended for all Linux distributions):**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
source ~/.bashrc

# Install Node.js v18
nvm install 18
nvm use 18

# Verify
node --version
npm --version
```

#### 4. Setup Project

```bash
# Install dependencies
cd server
npm install

cd ../client
npm install

cd ..
```

#### 5. Seed Database

```bash
cd server
npm run seed
```

#### 6. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Access the Application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Windows Setup

### Quick Setup (One Command)

```powershell
# Download and run the setup script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/mdhasim-1406/Learning-Management-System/main/scripts/setup-windows.bat" -OutFile "setup-windows.bat"
.\setup-windows.bat
```

### Step-by-Step Setup

#### 1. Clone Repository

```powershell
git clone https://github.com/mdhasim-1406/Learning-Management-System.git
cd Learning-Management-System
```

#### 2. Install MongoDB

**Option A: Using Chocolatey (Recommended)**

```powershell
# Install Chocolatey (if not already installed)
# Run PowerShell as Administrator and paste:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb-community -y

# Start MongoDB
net start MongoDB
```

**Option B: Manual Installation**

1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Follow the installation wizard
4. MongoDB will be installed as a Windows Service and start automatically

**Option C: MongoDB Atlas (Cloud)**

1. Visit: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGO_URI` in `.env` file

#### 3. Install Node.js & npm

1. Download from: https://nodejs.org/ (v18 LTS or higher)
2. Run the installer
3. Follow the installation wizard
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### 4. Setup Project

```powershell
# Install dependencies
cd server
npm install

cd ../client
npm install

cd ..
```

#### 5. Seed Database

```powershell
cd server
npm run seed
```

#### 6. Start Services

**PowerShell Terminal 1 - Backend:**
```powershell
cd server
npm start
```

**PowerShell Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

**Access the Application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## macOS Setup

### Quick Setup

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Install Node.js
brew install node

# Clone and setup project
git clone https://github.com/mdhasim-1406/Learning-Management-System.git
cd Learning-Management-System

cd server && npm install && cd ../client && npm install && cd ..
cd server && npm run seed

# Start services (in separate terminals)
cd server && npm start
cd client && npm run dev
```

---

## Manual Setup (All Platforms)

### Prerequisites Check

```bash
# Check Node.js
node --version        # v18.0.0 or higher

# Check npm
npm --version         # v9.0.0 or higher

# Check Git
git --version         # v2.0.0 or higher

# Check MongoDB (if installed locally)
mongod --version      # v5.0.0 or higher
```

### Step 1: Clone Repository

```bash
git clone https://github.com/mdhasim-1406/Learning-Management-System.git
cd Learning-Management-System
```

### Step 2: Setup Environment Variables

Create `.env` file in root directory:

```env
# Backend Configuration
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-super-secret-key-change-in-production-12345
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-in-production-12345
PORT=5000
NODE_ENV=development
```

### Step 3: Install Dependencies

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install

cd ..
```

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
# Linux/macOS
mongod

# Windows (if installed as service)
net start MongoDB

# Or if MongoDB is installed but not as service
mongod --dbpath /path/to/data/directory
```

**MongoDB Atlas (Cloud):**
No action needed if using connection string in `.env`

### Step 5: Seed Database

```bash
cd server
npm run seed
```

**Expected Output:**
```
MongoDB Connected: localhost
Cleared existing data...
Created 15 users
Created 6 courses
Created 10 articles
Created 6 quizzes

✓ Seed data created successfully!

Login credentials (all use password: password123):
```

### Step 6: Start Backend Server

```bash
cd server
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 7: Start Frontend Server

**In a new terminal:**
```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 1689 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Verification

### 1. Check MongoDB Connection

```bash
mongosh
# or
mongo

# In MongoDB shell:
show databases
exit
```

### 2. Check Backend Health

```bash
curl http://localhost:5000/health
# or visit: http://localhost:5000 in browser
```

### 3. Access Frontend

Open browser and visit: http://localhost:5173

### 4. Test Login

**Credentials:**
- Email: `alex.learner@company.com`
- Password: `password123`

**Other test accounts:**
- Trainer: `john.trainer@company.com` / `password123`
- Admin: `admin@company.com` / `password123`

### 5. Test Course Enrollment

1. Log in as learner
2. Go to "Courses"
3. Click on "React Fundamentals"
4. Click "Enroll"
5. Click "Start Learning"
6. You should see lesson content

### 6. Test Quiz

1. Complete at least one lesson
2. Click "Take Quiz"
3. Answer questions
4. Submit quiz
5. View results

---

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
```bash
# Check if MongoDB is running
# Linux/macOS
ps aux | grep mongod

# Windows
tasklist | findstr mongod

# Start MongoDB if not running
# Linux/macOS
mongod

# Windows
net start MongoDB
```

### Node Modules Installation Issues

**Error:** `npm ERR! code E...`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000` or `::: 5173`

**Solutions:**
```bash
# Find process using port 5000 (Linux/macOS)
lsof -i :5000
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm start    # Backend
# For frontend, update vite.config.js
```

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Frontend Build Issues

**Error:** `Module not found` or `import error`

**Solution:**
```bash
cd client
npm install

# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run dev
```

### GitHub Clone Issues

**Error:** `Permission denied (publickey)`

**Solution:**
```bash
# Use HTTPS instead of SSH
git clone https://github.com/mdhasim-1406/Learning-Management-System.git

# Or configure SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"
# Add public key to GitHub settings
```

### Environment Variable Issues

**Error:** `Cannot find module` or `undefined variable`

**Solution:**
```bash
# Verify .env file exists in root directory
ls -la .env

# Check .env contents
cat .env

# Update .env if needed
nano .env    # Linux/macOS
# or
notepad .env # Windows
```

### Windows-Specific Issues

**Issue:** Powershell execution policy error

**Solution:**
```powershell
# Set execution policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run PowerShell as Administrator
```

**Issue:** npm commands not found

**Solution:**
```powershell
# Close and reopen PowerShell after installing Node.js
# Or add Node to PATH manually

# Verify Node installation
node --version
npm --version
```

---

## Development Workflow

### Starting Fresh Development Session

**Linux/macOS:**
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend
cd server && npm start

# Terminal 3 - Start Frontend
cd client && npm run dev
```

**Windows:**
```powershell
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm run dev

# MongoDB starts automatically as service
```

### Updating Dependencies

```bash
# Update npm packages
cd server && npm update
cd ../client && npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

### Running Tests

```bash
# Backend tests (if available)
cd server
npm test

# Frontend tests (if available)
cd client
npm test
```

---

## Production Deployment

### Build Frontend for Production

```bash
cd client
npm run build

# Output: client/dist/
```

### Environment Variables for Production

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms
JWT_SECRET=use-strong-random-secret-key-minimum-32-chars
PORT=5000
NODE_ENV=production
```

### Start Backend in Production

```bash
cd server
npm run build    # If TypeScript is used
npm start
```

---

## Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm start` | Start backend server |
| `npm run seed` | Seed database with test data |
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `npm test` | Run tests |
| `npm audit` | Check security vulnerabilities |
| `mongod` | Start MongoDB (local) |
| `mongosh` | Open MongoDB shell |

---

## Support & Help

- **Issues**: https://github.com/mdhasim-1406/Learning-Management-System/issues
- **Documentation**: See README.md and WALKTHROUGH.md
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/

---

## Next Steps After Setup

1. ✅ Verify all services are running
2. ✅ Log in with demo credentials
3. ✅ Explore course catalog
4. ✅ Enroll in a course
5. ✅ Complete lessons
6. ✅ Take quiz
7. ✅ View dashboard

---

**Document Version**: 1.0  
**Last Updated**: February 1, 2026  
**Platform Support**: Linux, Windows, macOS
