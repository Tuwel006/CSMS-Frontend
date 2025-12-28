# CSMS Frontend - Vercel Deployment

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Deploy via GitHub
1. Push code to GitHub repository
2. Connect repository to Vercel dashboard
3. Deploy automatically

## Environment Variables

Set these in Vercel dashboard:

```
VITE_API_URL=https://csms-api.vercel.app/api/v1
REACT_APP_CRICKET_API_KEY=74f14599-16d3-49d8-b32b-be5008bf741a
REACT_APP_CRICKET_API_HOST=cricket-live-data.p.rapidapi.com
```

## Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: Vite

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start:stg` - Staging server
- `npm run preview` - Preview production build