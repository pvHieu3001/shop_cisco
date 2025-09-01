# Frontend API Configuration

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
VITE_EXTERNAL_BASE_API=http://103.27.237.41:8080
VITE_ADMIN_BASE_URL=http://103.27.237.41:3000
VITE_ADMIN_BASE_IMAGE_URL=http://103.27.237.41:8080/upload

# Development (optional)
VITE_DEV_BASE_API=http://localhost:8080
VITE_DEV_ADMIN_BASE_URL=http://localhost:3000
```

## API Endpoints

The frontend will make requests to:

- **Backend API**: `http://103.27.237.41:8080`
- **Image Uploads**: `http://103.27.237.41:8080/upload`

## Form Data Format

When creating/updating categories, the frontend sends:

```javascript
const formData = new FormData()
formData.append('name', 'Category Name')
formData.append('status', 'true') // or 'false'
formData.append('parentId', '1') // optional
formData.append('imageFile', file) // optional
```

## Debugging

To debug API requests:

1. Open browser developer tools
2. Check Network tab
3. Look for requests to `/api/v1/category`
4. Verify FormData contents in console logs
