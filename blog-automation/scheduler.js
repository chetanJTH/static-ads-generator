const cron = require('node-cron');
const BlogAutomation = require('./blog-generator');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class BlogScheduler {
  constructor() {
    this.blogAutomation = new BlogAutomation();
    this.logFile = path.join(__dirname, 'automation.log');
    this.isRunning = false;
  }

  // Log messages with timestamp
  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Append to log file
    fs.appendFileSync(this.logFile, logMessage);
  }

  // Generate and deploy blog post
  async generateAndDeploy() {
    if (this.isRunning) {
      this.log('Blog generation already in progress, skipping...', 'WARN');
      return;
    }

    this.isRunning = true;
    
    try {
      this.log('Starting daily blog post generation...');
      
      // Generate new blog post
      const blogPost = await this.blogAutomation.generateDailyPost();
      this.log(`Generated blog post: "${blogPost.title}"`);

      // Git operations to deploy
      await this.deployChanges(blogPost);
      
      this.log('Blog post successfully generated and deployed!', 'SUCCESS');
      
    } catch (error) {
      this.log(`Error in blog generation: ${error.message}`, 'ERROR');
      console.error(error);
    } finally {
      this.isRunning = false;
    }
  }

  // Deploy changes to GitHub
  async deployChanges(blogPost) {
    return new Promise((resolve, reject) => {
      const commands = [
        'cd ..',
        `git add apps/frontend/app/blog/${blogPost.slug}/`,
        'git add apps/frontend/app/blog/BlogPage.tsx',
        `git commit -m "feat: Add automated blog post - ${blogPost.title}"`,
        'git push origin main'
      ];

      const command = commands.join(' && ');
      
      this.log('Deploying changes to GitHub...');
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.log(`Git deployment error: ${error.message}`, 'ERROR');
          reject(error);
          return;
        }
        
        if (stderr) {
          this.log(`Git stderr: ${stderr}`, 'WARN');
        }
        
        this.log('Successfully deployed to GitHub');
        this.log(`Git output: ${stdout}`);
        resolve(stdout);
      });
    });
  }

  // Start the scheduler
  start() {
    this.log('Starting blog automation scheduler...');
    
    // Schedule daily blog post at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      this.log('Daily blog post trigger activated');
      await this.generateAndDeploy();
    }, {
      scheduled: true,
      timezone: "America/New_York" // Adjust to your timezone
    });

    // Optional: Schedule for testing (every hour during development)
    // Uncomment for testing purposes
    /*
    cron.schedule('0 * * * *', async () => {
      this.log('Hourly test trigger activated');
      await this.generateAndDeploy();
    });
    */

    this.log('Blog scheduler started successfully!');
    this.log('Daily posts scheduled for 9:00 AM EST');
    
    // Keep the process running
    process.on('SIGINT', () => {
      this.log('Shutting down blog scheduler...');
      process.exit(0);
    });
  }

  // Manual trigger for testing
  async triggerNow() {
    this.log('Manual blog generation triggered');
    await this.generateAndDeploy();
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      logFile: this.logFile,
      nextRun: 'Daily at 9:00 AM EST'
    };
  }
}

// Export for use as module
module.exports = BlogScheduler;

// CLI usage
if (require.main === module) {
  const scheduler = new BlogScheduler();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.start();
      break;
      
    case 'now':
      scheduler.triggerNow()
        .then(() => {
          console.log('Manual blog generation completed');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Manual blog generation failed:', error);
          process.exit(1);
        });
      break;
      
    case 'status':
      console.log(scheduler.getStatus());
      break;
      
    default:
      console.log(`
Blog Automation Scheduler

Usage:
  node scheduler.js start    - Start the daily scheduler
  node scheduler.js now      - Generate a blog post immediately
  node scheduler.js status   - Show scheduler status

The scheduler will automatically generate and deploy a new blog post daily at 9:00 AM EST.
      `);
  }
}
