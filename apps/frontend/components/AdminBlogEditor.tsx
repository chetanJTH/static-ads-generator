'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  status: string
  published_at: string
  view_count: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

interface AdminBlogEditorProps {
  post?: BlogPost | null
  onClose?: () => void
  onSave?: () => void
}

export default function AdminBlogEditor({ post, onClose, onSave }: AdminBlogEditorProps) {
  console.log('🔄 AdminBlogEditor render')
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'AI Tools',
    tags: post?.tags || [],
    author: post?.author || 'Kraftey Team',
    status: post?.status || 'draft',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    meta_keywords: post?.meta_keywords || ''
  })

  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Health', 'Gym', 'High-Converting'])
  const [selectedTags, setSelectedTags] = useState<string[]>(['marketing', 'video', 'conversion'])
  const [newTag, setNewTag] = useState('')
  const quillRef = useRef<any>(null)
  const editorRef = useRef<any>(null)
  const contentRef = useRef<string>(formData.content) // Keep editor content in ref, not state
  
  console.log('📝 Form data title:', formData.title)
  console.log('🎯 Editor ref exists:', !!editorRef.current)
  console.log('📄 Content ref:', contentRef.current)

  // Memoized title change handler
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    console.log('📝 Title input changed:', title)
    setFormData(prev => ({
      ...prev,
      title,
      slug: !post ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : prev.slug,
      meta_title: !prev.meta_title ? title : prev.meta_title
    }))
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Get content from Quill editor or ref
      const content = editorRef.current 
        ? editorRef.current.root.innerHTML 
        : contentRef.current
      
      const url = post ? `/api/blog/posts/${post.slug}` : '/api/blog/posts'
      const method = post ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          content: content,
          tags: selectedTags,
          category: selectedCategories[0] || 'AI Tools'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setStatus({ type: 'success', message: '✅ Blog post saved successfully!' })
        if (onSave) onSave()
        if (!post) clearForm()
      } else {
        const errorData = await response.json()
        setStatus({ type: 'error', message: '❌ Error: ' + (errorData.detail || 'Failed to save post') })
      }
    } catch (error) {
      setStatus({ type: 'error', message: '❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error') })
    } finally {
      setSaving(false)
    }
  }

  const clearForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'AI Tools',
      tags: [],
      author: 'Kraftey Team',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    })
    setSelectedCategories([])
    setSelectedTags([])
    contentRef.current = '' // Clear content ref
    if (editorRef.current) {
      editorRef.current.setContents([])
    }
  }

  const addCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== category))
  }

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  // Initialize Quill.js editor - only once!
  useEffect(() => {
    console.log('🚀 Quill useEffect running')
    console.log('🔍 Window exists:', typeof window !== 'undefined')
    console.log('🔍 Quill exists:', typeof window !== 'undefined' && !!window.Quill)
    console.log('🔍 quillRef exists:', !!quillRef.current)
    console.log('🔍 editorRef exists:', !!editorRef.current)
    
    if (typeof window !== 'undefined' && window.Quill && quillRef.current && !editorRef.current) {
      console.log('✅ Initializing Quill editor')
      
      // Clear any leftover content and toolbars
      quillRef.current.innerHTML = ''
      
      // Remove any existing Quill toolbars from the document
      const existingToolbars = document.querySelectorAll('.ql-toolbar')
      existingToolbars.forEach(toolbar => {
        if (toolbar.parentNode === quillRef.current?.parentNode) {
          toolbar.remove()
        }
      })
      
      // Initialize Quill only if it doesn't exist
      const quill = new window.Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'font': ['Inter', 'Georgia', 'Helvetica', 'Times New Roman', 'Arial', 'Comic Sans', 'Courier New', 'Verdana'] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
          ]
        },
        placeholder: 'Write your blog post content here...'
      })

      // Set initial content
      if (formData.content) {
        console.log('📄 Setting initial content:', formData.content)
        quill.root.innerHTML = formData.content
      }

      // Listen for content changes - store in ref, don't update state
      quill.on('text-change', () => {
        const content = quill.root.innerHTML
        console.log('📝 Quill content changed:', content)
        contentRef.current = content // Store in ref, no re-render
      })

      editorRef.current = quill
      console.log('✅ Quill editor initialized and stored in ref')
    } else {
      console.log('❌ Quill initialization skipped')
    }

    // Cleanup only on unmount
    return () => {
      console.log('🧹 Quill cleanup')
      if (editorRef.current) {
        // Destroy the Quill instance properly
        editorRef.current = null
      }
      if (quillRef.current) {
        // Clear the container
        quillRef.current.innerHTML = ''
      }
    }
  }, []) // Empty dependency array - only run once

  if (onClose) {
    // Modal version
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {post ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {renderForm()}
          </div>
        </div>
      </div>
    )
  }

  // Full page version
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📝 Advanced Blog Editor</h1>
              <p className="mt-2 text-gray-600">Create and manage your blog posts with Quill.js rich text editor</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={clearForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg ${
            status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {status.message}
          </div>
        )}

        {renderForm()}
      </div>
    </div>
  )

  // Memoized form component to prevent re-renders
  function renderForm() {
    console.log('🔄 AdminBlogForm render')
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                onFocus={() => console.log('🎯 Title input focused')}
                onBlur={() => console.log('👋 Title input blurred')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                required
                placeholder="Enter your blog post title..."
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div 
                ref={quillRef}
                className="border border-gray-300 rounded-md quill-editor"
                style={{ height: '500px' }}
                onFocus={() => console.log('🎯 Quill editor focused')}
                onBlur={() => console.log('👋 Quill editor blurred')}
              />
              <style jsx>{`
                .quill-editor .ql-editor {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .quill-editor .ql-editor .ql-font-Inter {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .quill-editor .ql-editor .ql-font-Georgia {
                  font-family: Georgia, 'Times New Roman', serif;
                }
                .quill-editor .ql-editor .ql-font-Helvetica {
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                }
                .quill-editor .ql-editor .ql-font-Times\\ New\\ Roman {
                  font-family: 'Times New Roman', Times, serif;
                }
                .quill-editor .ql-editor .ql-font-Arial {
                  font-family: Arial, sans-serif;
                }
                .quill-editor .ql-editor .ql-font-Comic\\ Sans {
                  font-family: 'Comic Sans MS', cursive;
                }
                .quill-editor .ql-editor .ql-font-Courier\\ New {
                  font-family: 'Courier New', Courier, monospace;
                }
                .quill-editor .ql-editor .ql-font-Verdana {
                  font-family: Verdana, Geneva, sans-serif;
                }
              `}</style>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="blog-post-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Brief description of your post..."
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addCategory(e.target.value)
                    e.target.value = ''
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Add Category</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Background Removal">Background Removal</option>
                <option value="eCommerce">eCommerce</option>
                <option value="Photography">Photography</option>
                <option value="Marketing">Marketing</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Design">Design</option>
                <option value="Social Media">Social Media</option>
                <option value="SEO">SEO</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(newTag)
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addTag(newTag)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SEO title (defaults to post title)"
                    maxLength={60}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.meta_title.length}/60 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SEO description (defaults to excerpt)"
                    maxLength={160}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.meta_description.length}/160 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </form>
    )
  }
}