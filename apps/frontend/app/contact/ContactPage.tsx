'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useState } from 'react'

const contactOptions = [
  {
    title: 'General Support',
    description: 'Questions about using our tools or technical issues',
    icon: '💬',
    email: 'support@kraftey.com',
    response: 'Within 24 hours'
  },
  {
    title: 'Enterprise Sales',
    description: 'Custom solutions for large organizations',
    icon: '🏢',
    email: 'enterprise@kraftey.com',
    response: 'Within 4 hours'
  },
  {
    title: 'Partnerships',
    description: 'Integration opportunities and collaborations',
    icon: '🤝',
    email: 'partnerships@kraftey.com',
    response: 'Within 48 hours'
  },
  {
    title: 'Media & Press',
    description: 'Press inquiries and media requests',
    icon: '📰',
    email: 'press@kraftey.com',
    response: 'Within 24 hours'
  }
]

const faqs = [
  {
    question: "How do I get help with using Kraftey tools?",
    answer: "For general support questions, email us at support@kraftey.com or use the contact form below. We typically respond within 24 hours."
  },
  {
    question: "Do you offer custom solutions for enterprises?",
    answer: "Yes! We provide custom integrations, on-premise deployments, and white-label solutions for large organizations. Contact our enterprise team for details."
  },
  {
    question: "Can I integrate Kraftey tools into my application?",
    answer: "Absolutely! We offer API access and custom integrations. Reach out to partnerships@kraftey.com to discuss your specific needs."
  },
  {
    question: "How can I report a bug or suggest a feature?",
    answer: "We love feedback! Send bug reports and feature suggestions to support@kraftey.com with as much detail as possible."
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in
              <span className="text-blue-600"> Touch</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Have questions, need support, or want to explore enterprise solutions? 
              We're here to help and would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Contact Method
            </h2>
            <p className="text-xl text-gray-600">
              Select the option that best matches your inquiry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactOptions.map((option, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{option.description}</p>
                <a
                  href={`mailto:${option.email}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {option.email}
                </a>
                <div className="text-xs text-gray-500 mt-2">
                  Response: {option.response}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Support</option>
                  <option value="enterprise">Enterprise Sales</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="press">Media & Press</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your inquiry"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Other Ways to Connect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-blue-100">hello@kraftey.com</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                <p className="text-blue-100">Available on our website</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🐦</div>
                <h3 className="text-lg font-semibold text-white mb-2">Social Media</h3>
                <p className="text-blue-100">@kraftey on all platforms</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}





