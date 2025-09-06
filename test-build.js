// Simple test to check if the build process works
const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Testing build process...');

try {
  // Change to frontend directory
  process.chdir(path.join(__dirname, 'frontend'));
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
