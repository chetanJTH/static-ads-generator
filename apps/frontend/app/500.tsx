'use client'

export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Server Error
          </h2>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. We're working to fix this issue.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            
            <a
              href="/"
              className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Error ID: {new Date().getTime()}</p>
        </div>
      </div>
    </div>
  )
}
