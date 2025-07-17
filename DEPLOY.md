# Deployment Instructions

## Option 1: Deploy using Vercel CLI (Recommended)

Since you have Vercel CLI installed, you can deploy directly:

```bash
# Make sure you're in the project directory
cd /mnt/d/unik_api_forward/vercel-ringba-proxy

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? (e.g., ringba-middleware)
# - In which directory is your code located? ./
# - Want to override settings? N
```

Your API will be available at:
```
https://[your-project-name].vercel.app/api/forward
```

## Option 2: Deploy via GitHub

1. Create a new GitHub repository
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [Vercel Dashboard](https://vercel.com/dashboard)
4. Click "New Project"
5. Import your GitHub repository
6. Deploy!

## Test Your Deployment

```bash
curl -X POST https://your-project-name.vercel.app/api/forward \
  -H "Content-Type: application/json" \
  -d '{
    "CID": "1234567890",
    "publisherInboundCallId": "test123",
    "zipcode": "90210"
  }'
```

The response should include the randomized age (65-75) in the forwarded payload.