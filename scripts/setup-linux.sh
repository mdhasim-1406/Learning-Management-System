#!/bin/bash

################################################################################
# LMS Setup Script for Linux
# Automated setup for Learning Management System
# Supports: Ubuntu, Debian, Fedora, CentOS, Arch, and other Linux distributions
################################################################################

set -e  # Exit on first error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NODE_VERSION="18"
MONGO_PORT="27017"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        return 1
    fi
    return 0
}

################################################################################
# Prerequisite Checks
################################################################################

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local missing_reqs=0
    
    # Check if running as root for package installation
    if [[ $EUID -ne 0 ]] && command -v apt-get &> /dev/null; then
        print_warning "Not running as root. Some installation steps may require sudo."
    fi
    
    # Check for git
    if check_command git; then
        GIT_VERSION=$(git --version | awk '{print $3}')
        print_success "Git found: $GIT_VERSION"
    else
        print_error "Git is not installed"
        missing_reqs=1
    fi
    
    # Check Node.js
    if check_command node; then
        NODE_VERSION_INSTALLED=$(node --version)
        print_success "Node.js found: $NODE_VERSION_INSTALLED"
    else
        print_warning "Node.js not found, will attempt installation"
    fi
    
    # Check npm
    if check_command npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_warning "npm not found, will attempt installation"
    fi
    
    # Check MongoDB
    if check_command mongod; then
        MONGO_VERSION=$(mongod --version | head -n 1 | awk '{print $NF}')
        print_success "MongoDB found: $MONGO_VERSION"
    else
        print_warning "MongoDB not found, will attempt installation"
    fi
    
    if [ $missing_reqs -eq 1 ]; then
        print_error "Please install missing prerequisites and try again"
        exit 1
    fi
}

################################################################################
# Detect Linux Distribution
################################################################################

detect_distro() {
    print_header "Detecting Linux Distribution"
    
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$ID
        DISTRO_VERSION=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        DISTRO=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
    elif [ -f /etc/lsb-release ]; then
        DISTRO=$(grep DISTRIB_ID /etc/lsb-release | cut -d'=' -f2 | tr '[:upper:]' '[:lower:]')
    else
        DISTRO="unknown"
    fi
    
    print_success "Distribution: ${DISTRO^^} ${DISTRO_VERSION:-}"
}

################################################################################
# Install Node.js and npm
################################################################################

install_nodejs() {
    print_header "Installing Node.js v${NODE_VERSION} and npm"
    
    if check_command node && check_command npm; then
        print_success "Node.js and npm already installed"
        return 0
    fi
    
    case "$DISTRO" in
        ubuntu|debian)
            install_nodejs_ubuntu
            ;;
        fedora|rhel|centos)
            install_nodejs_fedora
            ;;
        arch|manjaro)
            install_nodejs_arch
            ;;
        opensuse*)
            install_nodejs_opensuse
            ;;
        *)
            print_warning "Unsupported distribution for automatic Node.js installation"
            print_info "Please visit: https://nodejs.org/en/download/"
            return 1
            ;;
    esac
}

install_nodejs_ubuntu() {
    print_info "Installing Node.js via NodeSource Repository..."
    
    if ! check_command curl; then
        print_warning "curl not found, installing..."
        sudo apt-get update
        sudo apt-get install -y curl
    fi
    
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    print_success "Node.js installed: $(node --version)"
    print_success "npm installed: $(npm --version)"
}

install_nodejs_fedora() {
    print_info "Installing Node.js via dnf..."
    
    sudo dnf module install nodejs:${NODE_VERSION} -y
    
    print_success "Node.js installed: $(node --version)"
    print_success "npm installed: $(npm --version)"
}

install_nodejs_arch() {
    print_info "Installing Node.js via pacman..."
    
    sudo pacman -S nodejs npm --noconfirm
    
    print_success "Node.js installed: $(node --version)"
    print_success "npm installed: $(npm --version)"
}

install_nodejs_opensuse() {
    print_info "Installing Node.js via zypper..."
    
    sudo zypper install nodejs npm -y
    
    print_success "Node.js installed: $(node --version)"
    print_success "npm installed: $(npm --version)"
}

################################################################################
# Install MongoDB
################################################################################

install_mongodb() {
    print_header "Installing MongoDB"
    
    if check_command mongod; then
        print_success "MongoDB already installed: $(mongod --version | head -n 1)"
        return 0
    fi
    
    case "$DISTRO" in
        ubuntu|debian)
            install_mongodb_ubuntu
            ;;
        fedora|rhel|centos)
            install_mongodb_fedora
            ;;
        arch|manjaro)
            install_mongodb_arch
            ;;
        *)
            print_warning "Unsupported distribution for automatic MongoDB installation"
            print_info "Please visit: https://docs.mongodb.com/manual/administration/install-on-linux/"
            return 1
            ;;
    esac
    
    # Start MongoDB
    if check_command systemctl; then
        print_info "Starting MongoDB service..."
        sudo systemctl start mongod
        sudo systemctl enable mongod
        sleep 2
        
        if sudo systemctl is-active --quiet mongod; then
            print_success "MongoDB started and enabled"
        else
            print_warning "Failed to start MongoDB service"
        fi
    fi
}

install_mongodb_ubuntu() {
    print_info "Installing MongoDB via apt..."
    
    # Add MongoDB GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    
    # Add MongoDB repository
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    # Install MongoDB
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    
    print_success "MongoDB installed: $(mongod --version | head -n 1)"
}

install_mongodb_fedora() {
    print_info "Installing MongoDB via dnf..."
    
    sudo dnf install -y mongodb-org
    
    print_success "MongoDB installed: $(mongod --version | head -n 1)"
}

install_mongodb_arch() {
    print_info "Installing MongoDB via pacman..."
    
    sudo pacman -S mongodb-bin --noconfirm
    
    print_success "MongoDB installed: $(mongod --version | head -n 1)"
}

################################################################################
# Setup Project
################################################################################

setup_project() {
    print_header "Setting Up Project"
    
    # Check if in correct directory
    if [ ! -f "$PROJECT_DIR/package.json" ] && [ ! -d "$PROJECT_DIR/server" ]; then
        print_error "Not in correct directory. Expected LMS root directory."
        exit 1
    fi
    
    # Install backend dependencies
    print_info "Installing backend dependencies..."
    cd "$PROJECT_DIR/server"
    npm install
    print_success "Backend dependencies installed"
    
    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    cd "$PROJECT_DIR/client"
    npm install
    print_success "Frontend dependencies installed"
    
    cd "$PROJECT_DIR"
}

################################################################################
# Create Environment Files
################################################################################

create_env_files() {
    print_header "Creating Environment Files"
    
    # Create root .env file
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        print_info "Creating .env file..."
        cat > "$PROJECT_DIR/.env" << 'EOF'
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-super-secret-key-change-in-production-12345
PORT=5000
NODE_ENV=development
EOF
        print_success ".env file created"
    else
        print_success ".env file already exists"
    fi
}

################################################################################
# Seed Database
################################################################################

seed_database() {
    print_header "Seeding Database"
    
    print_info "Checking MongoDB connection..."
    
    # Wait for MongoDB to be ready
    local attempts=0
    local max_attempts=10
    
    while [ $attempts -lt $max_attempts ]; do
        if mongosh --eval "db.adminCommand('ping')" --quiet &>/dev/null; then
            print_success "MongoDB is ready"
            break
        fi
        attempts=$((attempts + 1))
        print_info "Waiting for MongoDB... ($attempts/$max_attempts)"
        sleep 1
    done
    
    if [ $attempts -eq $max_attempts ]; then
        print_warning "MongoDB might not be responding. Continuing anyway..."
    fi
    
    # Run seed script
    cd "$PROJECT_DIR/server"
    print_info "Running seed script..."
    npm run seed
    
    print_success "Database seeded"
}

################################################################################
# Display Summary
################################################################################

display_summary() {
    print_header "Setup Complete!"
    
    cat << 'EOF'

✓ All prerequisites installed and configured
✓ Project dependencies installed
✓ Database seeded with test data

Next Steps:
1. Start MongoDB (if not already running):
   sudo systemctl start mongod

2. Start Backend Server (in Terminal 1):
   cd server
   npm start

3. Start Frontend Server (in Terminal 2):
   cd client
   npm run dev

4. Open your browser and visit:
   http://localhost:5173

Login Credentials:
  Email: alex.learner@company.com
  Password: password123

Other Test Accounts:
  - Trainer: john.trainer@company.com / password123
  - Admin: admin@company.com / password123

For complete documentation, see:
- README.md
- SETUP.md
- WALKTHROUGH.md

EOF

    print_success "Thank you for using LMS!"
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "Learning Management System - Linux Setup"
    echo ""
    
    # Run setup steps
    check_prerequisites
    echo ""
    
    detect_distro
    echo ""
    
    install_nodejs
    echo ""
    
    install_mongodb
    echo ""
    
    setup_project
    echo ""
    
    create_env_files
    echo ""
    
    seed_database
    echo ""
    
    display_summary
}

# Run main function
main "$@"
