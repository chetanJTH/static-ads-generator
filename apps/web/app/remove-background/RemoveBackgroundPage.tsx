'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BackgroundRemover from '../../components/BackgroundRemover'

const faqs = [
  {
    question: "How to remove background from an image?",
    answer: "Simply upload your image using our drag-and-drop tool, click 'Remove Background', and our AI will automatically detect and remove the background in seconds. Download your image with a transparent background as a PNG file."
  },
  {
    question: "Is it free to remove backgrounds?",
    answer: "Yes! Our background removal tool is completely free to use. You can remove backgrounds from unlimited images without any cost or watermarks."
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPEG, PNG, and WebP image formats. The output is always a high-quality PNG file with a transparent background."
  },
  {
    question: "How accurate is the AI background removal?",
    answer: "Our AI uses advanced machine learning models trained on millions of images to provide highly accurate background removal. It works best with clear subjects and good contrast."
  },
  {
    question: "Can I use the images commercially?",
    answer: "Yes, you can use the processed images for any purpose, including commercial use. You retain all rights to your images."
  }
]

const useCases = [
  {
    title: "Product Photos",
    description: "Create clean product images for eCommerce stores, catalogs, and marketing materials.",
    icon: "🛍️"
  },
  {
    title: "Profile Pictures",
    description: "Remove distracting backgrounds from portraits and headshots for professional use.",
    icon: "👤"
  },
  {
    title: "Social Media",
    description: "Create eye-catching posts and stories with transparent backgrounds for layering.",
    icon: "📱"
  },
  {
    title: "Marketing Ads",
    description: "Prepare product images for banner ads, social media campaigns, and promotional materials.",
    icon: "📢"
  }
]

export default function RemoveBackgroundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Remove Image Backgrounds 
              <span className="text-blue-600"> Instantly with AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload any image and our AI will automatically remove the background in seconds. 
              Free, fast, and HD quality results every time.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-8">
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% Free
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                HD Quality
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant Results
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No Watermarks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Background Remover Tool */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackgroundRemover />
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Use Case
            </h2>
            <p className="text-xl text-gray-600">
              From eCommerce to social media, our background remover works for all your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about removing backgrounds with AI
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
      
      <Footer />
    </div>
  )
}

