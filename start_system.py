#!/usr/bin/env python3
"""
SolveX AI System Startup Script
This script will start both the backend and frontend services
"""

import subprocess
import time
import sys
import os
import signal
import threading
from pathlib import Path

class SystemStarter:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.running = True
        
    def start_backend(self):
        """Start the backend server"""
        print("🚀 Starting backend server...")
        try:
            # Change to backend directory and start uvicorn
            backend_cmd = [
                sys.executable, "-m", "uvicorn", 
                "main:app", 
                "--reload", 
                "--host", "127.0.0.1", 
                "--port", "8000"
            ]
            
            self.backend_process = subprocess.Popen(
                backend_cmd,
                cwd="backend",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True
            )
            
            print("✅ Backend server started on http://127.0.0.1:8000")
            return True
            
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
            return False
    
    def start_frontend(self):
        """Start the frontend server"""
        print("🚀 Starting frontend server...")
        try:
            # Change to frontend directory and start npm
            frontend_cmd = ["npm", "start"]
            
            self.frontend_process = subprocess.Popen(
                frontend_cmd,
                cwd="frontend",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True
            )
            
            print("✅ Frontend server started on http://localhost:3000")
            return True
            
        except Exception as e:
            print(f"❌ Failed to start frontend: {e}")
            return False
    
    def check_services(self):
        """Check if services are running"""
        print("\n🔍 Checking services...")
        
        # Check backend
        try:
            import requests
            response = requests.get("http://127.0.0.1:8000", timeout=5)
            if response.status_code == 200:
                print("✅ Backend is responding")
            else:
                print(f"⚠️ Backend responded with status: {response.status_code}")
        except Exception as e:
            print(f"❌ Backend not responding: {e}")
        
        # Check frontend
        try:
            import requests
            response = requests.get("http://localhost:3000", timeout=5)
            if response.status_code == 200:
                print("✅ Frontend is responding")
            else:
                print(f"⚠️ Frontend responded with status: {response.status_code}")
        except Exception as e:
            print(f"❌ Frontend not responding: {e}")
    
    def cleanup(self):
        """Clean up processes"""
        print("\n🛑 Shutting down services...")
        
        if self.backend_process:
            self.backend_process.terminate()
            print("✅ Backend stopped")
        
        if self.frontend_process:
            self.frontend_process.terminate()
            print("✅ Frontend stopped")
    
    def run(self):
        """Main run method"""
        print("🎯 SolveX AI System Startup")
        print("=" * 50)
        
        # Check if we're in the right directory
        if not Path("backend").exists() or not Path("frontend").exists():
            print("❌ Please run this script from the project root directory")
            return 1
        
        # Start backend
        if not self.start_backend():
            return 1
        
        # Wait a bit for backend to start
        print("⏳ Waiting for backend to initialize...")
        time.sleep(5)
        
        # Start frontend
        if not self.start_frontend():
            self.cleanup()
            return 1
        
        # Wait for frontend to start
        print("⏳ Waiting for frontend to initialize...")
        time.sleep(10)
        
        # Check services
        self.check_services()
        
        print("\n🎉 SolveX AI System is running!")
        print("📋 Access points:")
        print("   • Frontend: http://localhost:3000")
        print("   • Backend API: http://127.0.0.1:8000")
        print("   • API Documentation: http://127.0.0.1:8000/docs")
        print("\n💡 Press Ctrl+C to stop the system")
        
        try:
            # Keep the script running
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Shutdown requested...")
            self.cleanup()
            print("✅ System stopped successfully")
        
        return 0

def main():
    starter = SystemStarter()
    return starter.run()

if __name__ == "__main__":
    sys.exit(main())
