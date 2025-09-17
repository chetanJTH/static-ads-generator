'use client'

import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Kraftey ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered image processing services, including our background removal tool and image upscaler.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Images and Files</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you use our image processing services, we temporarily process the images you upload to provide our AI-powered background removal and upscaling services. These images are processed on our secure servers and are automatically deleted after processing is complete.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information about how you interact with our services, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Performance and error logs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you create an account, we may collect your email address and profile information from third-party authentication providers (such as Google).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide and improve our AI image processing services</li>
              <li>Process and enhance your uploaded images</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Communicate with you about our services</li>
              <li>Ensure the security and integrity of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>All data transmission is encrypted using SSL/TLS protocols</li>
              <li>Images are processed on secure servers and deleted immediately after processing</li>
              <li>We do not store your processed images permanently</li>
              <li>Regular security audits and monitoring</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Images:</strong> Uploaded images are automatically deleted from our servers within 24 hours of processing or immediately after download, whichever comes first.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Usage Data:</strong> We retain anonymized usage statistics for up to 2 years to improve our services.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Account Data:</strong> Account information is retained until you request deletion or close your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use third-party services to enhance our platform:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>Google Analytics:</strong> For website analytics (anonymized data)</li>
              <li><strong>Google AdSense:</strong> For displaying relevant advertisements</li>
              <li><strong>Cloudinary:</strong> For secure image storage and processing</li>
              <li><strong>Authentication Providers:</strong> For secure user authentication</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar technologies to improve your experience on our website. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2"><strong>Email:</strong> privacy@kraftey.com</p>
              <p className="text-gray-600 mb-2"><strong>Website:</strong> <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact Form</Link></p>
              <p className="text-gray-600"><strong>Address:</strong> Kraftey Privacy Team, [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
