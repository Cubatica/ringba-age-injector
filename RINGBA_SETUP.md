# Ringba RingTree Setup Guide

## Steps to Implement in Ringba

1. **Deploy your middleware first**
   - Deploy to Vercel (you should have a URL like: `https://ringba-age-injector.vercel.app/api/forward`)

2. **In Ringba Dashboard:**
   
   ### Option A: If using RingTree Targets
   - Go to **Targets** → **RingTree Targets**
   - Find your target or create a new one
   - In the **Webhook URL** field, replace the direct Ringba RTB URL with:
     ```
     https://ringba-age-injector.vercel.app/api/forward
     ```

   ### Option B: If using Call Flows
   - Go to **Call Flows** → Select your flow
   - Find the **Webhook** node or **HTTP Request** node
   - Update the URL to:
     ```
     https://ringba-age-injector.vercel.app/api/forward
     ```

3. **Configure the Webhook Settings:**
   - **Method**: POST
   - **Content Type**: application/json
   - **Headers**: None required (middleware handles this)

4. **Map Your Fields:**
   The middleware expects these fields (it will use defaults if not provided):
   ```json
   {
     "CID": "[tag:InboundNumber:Number-NoPlus]",
     "publisherInboundCallId": "[Call:InboundCallId]", 
     "zipcode": "[Geo:ZipCode]"
   }
   ```

## Data Flow

1. **Call comes in** → Ringba receives the call
2. **Ringba sends webhook** → Your Vercel middleware at `/api/forward`
3. **Middleware adds age** → Injects random age (65-75)
4. **Forwards to RTB** → Sends to `https://rtb.ringba.com/v1/production/4376312840a84bec890323f97a8885b7.json`
5. **Returns response** → Middleware returns Ringba's response back

## Testing

1. **Test with Ringba's Test Tool:**
   - In Ringba, use the "Test" button on your target
   - Check Vercel logs to see the injected payload

2. **Check Vercel Logs:**
   - Go to your Vercel dashboard
   - Click on your project
   - Go to **Functions** → **Logs**
   - You'll see the payload with the injected age

## Important Notes

- The middleware always adds `exposeCallerId: "yes"`
- Age is randomized between 65-75 on each request
- Original Ringba RTB URL is hardcoded in the middleware
- If you need to change the RTB URL, update `/api/forward.js`

## Troubleshooting

- **No age in final payload**: Check if Ringba's RTB accepts custom fields
- **Webhook fails**: Verify your Vercel deployment is live
- **Missing data**: Ensure field mappings in Ringba match expected fields