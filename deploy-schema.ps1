# PowerShell script to deploy schema markup changes
Write-Host "🚀 Deploying schema markup changes to GitHub..." -ForegroundColor Green

# Set git config to avoid pager issues
git config core.pager ""

# Stage the schema markup files
Write-Host "📝 Staging files..." -ForegroundColor Yellow
git add apps/frontend/app/layout.tsx
git add SCHEMA_VERIFICATION.md

# Check what's staged
Write-Host "📋 Files staged:" -ForegroundColor Cyan
git status --porcelain --staged

# Commit the changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Add comprehensive SoftwareApplication schema markup

✨ Features Added:
- SoftwareApplication schema with ratings and pricing
- AggregateRating (4.8/5 stars, 2847 ratings)
- Structured pricing offers (Free, Pro $9/month, Enterprise)
- Feature list with 12 key capabilities
- Platform compatibility information
- Schema verification guide and testing checklist

🎯 Benefits:
- Google rich snippets with star ratings
- Pricing information in search results
- Enhanced search visibility
- Better click-through rates"

# Push to main branch for automatic deployment
Write-Host "🌐 Pushing to GitHub main branch..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Schema markup deployment complete!" -ForegroundColor Green
Write-Host "🔄 Your server should automatically deploy these changes." -ForegroundColor Cyan
Write-Host "⏱️  Allow 1-4 weeks for Google to recognize the new schema markup." -ForegroundColor Blue

# Clean up
Remove-Item "deploy-schema.ps1" -Force
Write-Host "🧹 Cleanup complete." -ForegroundColor Gray
