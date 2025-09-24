import Header from '@/components/Header'

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Content Creation Strategies for Small Businesses
            </h1>
            <p className="text-xl text-gray-600">
              Learn how to create engaging content that drives results for your small business
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>Content creation is essential for small businesses to connect with their audience and drive growth.</p>
          </div>
        </div>
      </article>
    </div>
  )
}