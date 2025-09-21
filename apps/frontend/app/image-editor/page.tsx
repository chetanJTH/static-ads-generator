'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PremiumGate from '../../components/PremiumGate'

export default function ImageEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <PremiumGate feature="Image Editor">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Advanced Image Editor</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Editor Canvas */}
              <div className="lg:col-span-2">
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an Image</h3>
                    <p className="text-gray-600">
                      Drag and drop an image here or click to browse
                    </p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choose Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Tools Panel */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Editing Tools</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      ✂️ Crop & Resize
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      🎨 Filters & Effects
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      🌟 Brightness & Contrast
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      🔄 Rotate & Flip
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      📝 Add Text
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      🖌️ Draw & Annotate
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors">
                      Remove Background
                    </button>
                    <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors">
                      Upscale Image
                    </button>
                    <button className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors">
                      Remove Watermark
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">🚧 Coming Soon!</h3>
              <p className="text-blue-800">
                Our advanced image editor is currently in development. 
                This feature will be available soon for Pro subscribers!
              </p>
            </div>
          </div>
        </PremiumGate>
      </div>

      <Footer />
    </div>
  )
}

