// Simple test script for contact form
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Email',
  message: 'Testing email service',
  category: 'general'
}

console.log('Testing contact form...')
console.log('Data:', testData)

fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data)
})
.catch(error => {
  console.error('Error:', error)
})
