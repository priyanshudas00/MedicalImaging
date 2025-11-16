# Medical Imaging Agent Frontend

A React-based frontend for the Medical Imaging AI Agent application.

## Deployment to Netlify

### Option 1: Direct Netlify Deployment

1. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Sign up or log in
   - Click "New site from Git" or "Deploy manually"

2. **Deploy from Git (Recommended):**
   - Push your code to GitHub
   - Connect your GitHub repository to Netlify
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
     - Node version: 18

3. **Deploy Manually:**
   - Drag and drop the `build` folder to Netlify's deployment area

### Option 2: GitHub Pages (Alternative)

If you prefer GitHub Pages:

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://your-username.github.io/medical-imaging-agent"
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Environment Variables

For production deployment, you may need to configure environment variables for API endpoints:

- `REACT_APP_API_BASE_URL`: Your backend API URL (e.g., `https://your-backend.herokuapp.com`)

## Features

- Image upload and analysis
- Chat interface for medical queries
- Analysis results display
- Medical reports and educational content
- Responsive design

## Technologies Used

- React 18
- Axios for API calls
- CSS for styling
- Netlify for deployment

## Local Development

```bash
npm install
npm start
```

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.
