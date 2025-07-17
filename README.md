# Ringba Middleware Proxy on Vercel

This middleware API injects a randomized age value (65-75) into webhook POST requests before forwarding them to Ringba RTB URL.

## Project Structure

```
vercel-ringba-proxy/
├── api/
│   └── forward.js
└── package.json
```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect and deploy the function

3. **Your API endpoint will be:**
   ```
   https://your-project-name.vercel.app/api/forward
   ```

## Usage Example

```bash
curl -X POST https://your-project-name.vercel.app/api/forward \
  -H "Content-Type: application/json" \
  -d '{
    "CID": "1234567890",
    "publisherInboundCallId": "abc123",
    "zipcode": "90210"
  }'
```

## Features

- Accepts POST requests only
- Injects random age between 65-75
- Forwards to Ringba RTB URL
- Preserves original fields or uses defaults
- Returns Ringba's response

## Debugging

- View logs in Vercel: **Deployments > Logs**
- Check payload includes `age` field before forwarding
- Verify Ringba accepts custom fields