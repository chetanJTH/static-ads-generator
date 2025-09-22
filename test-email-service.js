// Test script for the email service
// Run this with: node test-email-service.js

const testContactForm = async () => {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message to verify the email service is working correctly.',
    category: 'general'
  }

  try {
    console.log('Testing contact form API...')
    console.log('Sending test data:', testData)
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Test successful!')
      console.log('Response:', result.message)
      console.log('Check info.kraftey@gmail.com for the notification email')
      console.log('Check test@example.com for the auto-reply email')
    } else {
      console.log('❌ Test failed!')
      console.log('Error:', result.error)
      if (result.details) {
        console.log('Details:', result.details)
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
    console.log('Make sure the development server is running on localhost:3000')
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testContactForm()
}

module.exports = { testContactForm }
