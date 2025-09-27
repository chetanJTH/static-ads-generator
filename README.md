# Notion Blog Editor

A simple blog editor that uses the Notion API to create and manage blog posts with rich content including text, images, and tables.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your Integration
1. Your Notion integration token is already configured in `config.js`
2. Create a database in Notion for your blog posts
3. Share the database with your integration
4. Update the `databaseId` in `config.js` with your database ID

### 3. Test the Connection
```bash
npm test
```

### 4. Run the Application
```bash
npm start
```

## Features

- ✅ Create new blog posts
- ✅ Add rich text content
- ✅ Insert images with captions
- ✅ Create tables
- ✅ Search and retrieve existing posts
- ✅ Update page properties

## Usage Examples

### Create a Blog Post
```javascript
import NotionBlogEditor from './notion-api.js'

const blogEditor = new NotionBlogEditor()

// Create a new post
const post = await blogEditor.createBlogPost(
  'My Blog Post Title',
  'This is the content of my blog post.\n\nIt supports multiple paragraphs.'
)
```

### Add an Image
```javascript
await blogEditor.addImageToPage(
  'page-id-here',
  'https://example.com/image.jpg',
  'Image caption'
)
```

### Add a Table
```javascript
const headers = ['Name', 'Age', 'City']
const rows = [
  ['John Doe', '25', 'New York'],
  ['Jane Smith', '30', 'Los Angeles']
]
await blogEditor.addTableToPage('page-id-here', headers, rows)
```

## Getting Page/Database IDs

1. Open your Notion page/database
2. Copy the URL: `https://notion.so/workspace/Page-Title-abc123def456`
3. The ID is the last part: `abc123def456`

## Troubleshooting

- **Unauthorized Error**: Make sure you've shared your page/database with the integration
- **Object Not Found**: Check that your page/database ID is correct
- **Invalid Request**: Verify your integration token is valid

## Next Steps

1. Create a web interface for the blog editor
2. Add authentication for multiple users
3. Implement content scheduling
4. Add export functionality