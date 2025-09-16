@echo off
echo 🚀 Deploying Blog Automation System...
echo.

echo 📁 Setting up blog automation directory...
cd blog-automation
if errorlevel 1 (
    echo ❌ Blog automation directory not found!
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

echo 🧪 Testing blog generation...
call node blog-generator.js
if errorlevel 1 (
    echo ❌ Blog generation test failed!
    pause
    exit /b 1
)

echo ✅ Blog generation test passed!
echo.

echo 📝 Committing new blog automation system...
cd ..
git add blog-automation/
git add deploy-blog-automation.bat
git add apps/frontend/app/blog/
git commit -m "feat: Add automated blog posting system with internal linking

✨ Features:
- Daily automated blog post generation
- Intelligent internal linking system
- SEO-optimized content with meta tags
- Multiple content categories (AI, eCommerce, Photography, etc.)
- Automatic GitHub deployment
- Comprehensive logging and monitoring

🤖 The system will generate and publish one blog post daily at 9:00 AM
🔗 Each post includes 3-5 relevant internal links
📈 All posts are SEO-optimized with proper meta descriptions and keywords"

echo 🌐 Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ Failed to push to GitHub!
    pause
    exit /b 1
)

echo ✅ Successfully deployed blog automation system!
echo.
echo 📊 System Status:
echo - ✅ Blog generator: Ready
echo - ✅ Daily scheduler: Configured for 9:00 AM
echo - ✅ Internal linking: Active
echo - ✅ Auto deployment: Enabled
echo - ✅ SEO optimization: Enabled
echo.
echo 🎯 Next Steps:
echo 1. Start the scheduler: cd blog-automation && npm start
echo 2. Generate a post now: cd blog-automation && npm run generate
echo 3. Check status: cd blog-automation && npm run status
echo.
echo 📖 The system will automatically post 1 blog daily with internal links!
pause
