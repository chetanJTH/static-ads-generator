const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Kraftey Blog Automation System...\n');

// Check if frontend directory exists
const frontendPath = path.join(__dirname, '../apps/frontend/app/blog');
if (!fs.existsSync(frontendPath)) {
  console.error('❌ Frontend blog directory not found!');
  console.error('Expected path:', frontendPath);
  process.exit(1);
}

console.log('✅ Frontend blog directory found');

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Created logs directory');
}

// Create sample environment file
const envSample = `# Blog Automation Configuration
BLOG_TIMEZONE=America/New_York
DAILY_POST_TIME=09:00
AUTO_DEPLOY=true
GIT_AUTO_PUSH=true

# GitHub Configuration (optional)
GITHUB_TOKEN=your_github_token_here
REPO_OWNER=chetanJTH
REPO_NAME=static-ads-generator

# Notification Settings (optional)
SLACK_WEBHOOK_URL=
EMAIL_NOTIFICATIONS=false
`;

const envPath = path.join(__dirname, '.env.example');
fs.writeFileSync(envPath, envSample);
console.log('✅ Created .env.example file');

// Create systemd service file for Linux deployment
const serviceFile = `[Unit]
Description=Kraftey Blog Automation Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${__dirname}
ExecStart=/usr/bin/node scheduler.js start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`;

fs.writeFileSync(path.join(__dirname, 'kraftey-blog.service'), serviceFile);
console.log('✅ Created systemd service file');

// Create Windows batch file for easy startup
const batchFile = `@echo off
echo Starting Kraftey Blog Automation...
cd /d "${__dirname}"
npm start
pause
`;

fs.writeFileSync(path.join(__dirname, 'start-automation.bat'), batchFile);
console.log('✅ Created Windows startup script');

// Create README for the automation system
const readme = `# Kraftey Blog Automation System

This system automatically generates and publishes blog posts daily with intelligent internal linking.

## Features

- 🤖 **Automated Content Generation**: Creates SEO-optimized blog posts
- 🔗 **Smart Internal Linking**: Automatically adds relevant internal links
- ⏰ **Daily Scheduling**: Posts new content every day at 9:00 AM
- 🚀 **Auto Deployment**: Commits and pushes to GitHub automatically
- 📊 **Multiple Categories**: Covers AI tools, eCommerce, tutorials, and more
- 📈 **SEO Optimized**: Includes meta descriptions, keywords, and structured data

## Quick Start

### 1. Install Dependencies
\`\`\`bash
cd blog-automation
npm install
\`\`\`

### 2. Test Generation
\`\`\`bash
npm run test
\`\`\`

### 3. Generate a Post Now
\`\`\`bash
npm run generate
\`\`\`

### 4. Start Daily Scheduler
\`\`\`bash
npm start
\`\`\`

## Commands

- \`npm start\` - Start the daily scheduler
- \`npm run generate\` - Generate a blog post immediately
- \`npm run status\` - Check scheduler status
- \`npm test\` - Test the blog generator

## Configuration

### Scheduling
The system runs daily at 9:00 AM EST. To change this, edit the cron schedule in \`scheduler.js\`:

\`\`\`javascript
cron.schedule('0 9 * * *', async () => {
  // Change '0 9' to your preferred time (hour minute)
});
\`\`\`

### Content Topics
Add new blog topics in \`blog-generator.js\` in the \`blogTopics\` array.

### Internal Links
Update internal links in the \`internalLinks\` array to match your site structure.

## Deployment

### Linux/Server Deployment
1. Copy \`kraftey-blog.service\` to \`/etc/systemd/system/\`
2. Run: \`sudo systemctl enable kraftey-blog.service\`
3. Start: \`sudo systemctl start kraftey-blog.service\`

### Windows Deployment
Run \`start-automation.bat\` to start the scheduler.

### PM2 (Recommended)
\`\`\`bash
npm install -g pm2
pm2 start scheduler.js --name "blog-automation"
pm2 save
pm2 startup
\`\`\`

## Monitoring

Logs are written to \`automation.log\`. Monitor with:
\`\`\`bash
tail -f automation.log
\`\`\`

## Content Categories

The system generates content in these categories:
- AI Tools & Technology
- Background Removal Tutorials
- eCommerce Photography
- Marketing Strategies
- Design Tips
- Social Media Content
- SEO Optimization
- Business Growth

## Internal Linking Strategy

The system automatically adds 3-5 internal links per post to:
- Main tool pages (/remove-background, /ai-banner-generator)
- Pricing page (/pricing)
- Other blog posts
- Homepage (/)

This improves SEO and keeps users engaged on your site.

## Troubleshooting

### Common Issues

**Git Permission Denied**
- Ensure your GitHub credentials are configured
- Check SSH keys or use HTTPS with tokens

**Blog Directory Not Found**
- Verify the frontend path in \`blog-generator.js\`
- Ensure Next.js blog structure is correct

**Scheduler Not Running**
- Check system time and timezone
- Verify cron schedule format
- Check logs for error messages

## Support

For issues or questions, check the logs first:
\`\`\`bash
cat automation.log
\`\`\`

The system is designed to be robust and will retry failed operations.
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readme);
console.log('✅ Created README.md');

console.log('\n🎉 Blog Automation System Setup Complete!\n');
console.log('Next steps:');
console.log('1. cd blog-automation');
console.log('2. npm install');
console.log('3. npm run test (to test blog generation)');
console.log('4. npm run generate (to create a blog post now)');
console.log('5. npm start (to start daily automation)\n');

console.log('📁 Files created:');
console.log('- blog-generator.js (main content generator)');
console.log('- scheduler.js (daily automation)');
console.log('- package.json (dependencies)');
console.log('- setup.js (this file)');
console.log('- .env.example (configuration template)');
console.log('- kraftey-blog.service (Linux service)');
console.log('- start-automation.bat (Windows startup)');
console.log('- README.md (documentation)\n');

console.log('The system will generate SEO-optimized blog posts daily with intelligent internal linking!');
