'use client'

import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Terms and Conditions</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By accessing and using Kraftey's AI-powered image processing services ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kraftey provides AI-powered image processing services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Background removal from images</li>
              <li>AI-powered image upscaling and enhancement</li>
              <li>Image quality improvement</li>
              <li>Related image processing tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Acceptable Use</h3>
            <p className="text-gray-600 leading-relaxed mb-4">You agree to use our services only for lawful purposes and in accordance with these terms. You must not:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Upload images that violate copyright, trademark, or other intellectual property rights</li>
              <li>Process images containing illegal, harmful, or offensive content</li>
              <li>Use our services to create misleading or deceptive content</li>
              <li>Attempt to reverse engineer or compromise our AI algorithms</li>
              <li>Use automated tools to abuse our service limits</li>
              <li>Upload images containing personal information of others without consent</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Ownership</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You retain all rights to the images you upload. By using our service, you grant us a temporary license to process your images solely for the purpose of providing our services. We do not claim ownership of your content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Limitations</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Limits</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may impose reasonable limits on your use of our services, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>File size limitations</li>
              <li>Number of images processed per day</li>
              <li>Processing time limits</li>
              <li>Storage duration limits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Availability</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              While we strive to provide reliable service, we do not guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue our services at any time with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your privacy is important to us. Please review our <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link> to understand how we collect, use, and protect your information.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Image Processing:</strong> Images uploaded for processing are automatically deleted from our servers within 24 hours or immediately after download, whichever comes first.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Kraftey platform, including its AI algorithms, design, and functionality, is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of our service without explicit permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our services are provided "as is" without any warranties, express or implied. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>The accuracy or quality of processed images</li>
              <li>Uninterrupted or error-free service</li>
              <li>Compatibility with all devices or browsers</li>
              <li>That our service will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To the maximum extent permitted by law, Kraftey shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing and Payment</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Free Services:</strong> Basic image processing services are provided free of charge with certain limitations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Premium Services:</strong> Advanced features may require payment. All fees are non-refundable unless otherwise stated. We reserve the right to change pricing with reasonable notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may terminate or suspend your access to our services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the updated terms on our website. Your continued use of our services after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2"><strong>Email:</strong> legal@kraftey.com</p>
              <p className="text-gray-600 mb-2"><strong>Website:</strong> <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact Form</Link></p>
              <p className="text-gray-600"><strong>Address:</strong> Kraftey Legal Team, [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
