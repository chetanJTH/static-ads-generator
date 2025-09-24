import Header from '@/components/Header'

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Creating Transparent Images for Web Design
            </h1>
            <p className="text-xl text-gray-600">
              Master the art of creating transparent images for professional web design
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>Transparent images are crucial for modern web design and user experience.</p>
          </div>
        </div>
      </article>
    </div>
  )
}