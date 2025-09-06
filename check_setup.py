#!/usr/bin/env python3
"""
SolveX AI - Complete Setup Checker
Mission UpSkill India Hackathon
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_python():
    """Check Python installation"""
    print("🐍 Checking Python...")
    try:
        result = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Python: {result.stdout.strip()}")
            return True
        else:
            print("❌ Python not working properly")
            return False
    except Exception as e:
        print(f"❌ Python not found: {e}")
        return False

def check_node():
    """Check Node.js installation"""
    print("📦 Checking Node.js...")
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js: {result.stdout.strip()}")
            return True
        else:
            print("❌ Node.js not working properly")
            return False
    except Exception as e:
        print(f"❌ Node.js not found: {e}")
        return False

def check_npm():
    """Check npm installation"""
    print("📦 Checking npm...")
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm: {result.stdout.strip()}")
            return True
        else:
            print("❌ npm not working properly")
            return False
    except Exception as e:
        print(f"❌ npm not found: {e}")
        return False

def check_env_file():
    """Check .env file configuration"""
    print("🔧 Checking .env file...")
    
    if not os.path.exists('.env'):
        print("❌ .env file not found")
        return False
    
    try:
        with open('.env', 'r') as f:
            content = f.read()
        
        if 'OPENAI_API_KEY=your_openai_api_key_here' in content:
            print("❌ API key not configured (still using placeholder)")
            return False
        
        if 'OPENAI_API_KEY=sk-' in content:
            print("✅ API key is configured")
            return True
        else:
            print("❌ API key format looks incorrect")
            return False
            
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return False

def check_project_structure():
    """Check if all required files exist"""
    print("📁 Checking project structure...")
    
    required_files = [
        'requirements.txt',
        'package.json',
        'frontend/package.json',
        'backend/main.py',
        'Dockerfile',
        'docker-compose.yml',
        'README.md'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    else:
        print("✅ All required files present")
        return True

def check_dependencies():
    """Check if dependencies are installed"""
    print("📦 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import fastapi
        import openai
        import chromadb
        print("✅ Python dependencies installed")
    except ImportError as e:
        print(f"❌ Python dependencies missing: {e}")
        return False
    
    # Check Node.js dependencies
    if os.path.exists('frontend/node_modules'):
        print("✅ Node.js dependencies installed")
        return True
    else:
        print("❌ Node.js dependencies not installed")
        return False

def test_openai_api():
    """Test OpenAI API connection"""
    print("🤖 Testing OpenAI API...")
    
    try:
        from dotenv import load_dotenv
        import openai
        
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key or api_key == 'your_openai_api_key_here':
            print("❌ API key not configured")
            return False
        
        client = openai.OpenAI(api_key=api_key)
        
        # Simple test request
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, this is a test."}],
            max_tokens=10
        )
        
        print("✅ OpenAI API connection successful!")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {str(e)}")
        return False

def main():
    """Main setup checker"""
    print("🎯 SolveX AI - Complete Setup Check")
    print("=" * 50)
    
    checks = [
        ("Python", check_python),
        ("Node.js", check_node),
        ("npm", check_npm),
        (".env file", check_env_file),
        ("Project structure", check_project_structure),
        ("Dependencies", check_dependencies),
        ("OpenAI API", test_openai_api)
    ]
    
    results = {}
    for name, check_func in checks:
        try:
            results[name] = check_func()
        except Exception as e:
            print(f"❌ {name} check failed: {e}")
            results[name] = False
        print()
    
    # Summary
    print("📊 Setup Summary:")
    print("-" * 30)
    
    passed = 0
    total = len(results)
    
    for name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name:20} {status}")
        if result:
            passed += 1
    
    print("-" * 30)
    print(f"Overall: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 All checks passed! SolveX AI is ready to run!")
        print("🚀 Start the application with: npm run dev")
        return 0
    else:
        print(f"\n⚠️  {total - passed} issues need to be fixed")
        print("📋 Check the failed items above and fix them")
        return 1

if __name__ == "__main__":
    sys.exit(main())

