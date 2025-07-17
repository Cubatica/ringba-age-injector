# Ringba Webhook Configuration

## The Issue
Ringba RTB is expecting an "age" field as a required parameter. Your middleware adds the age, but Ringba needs to include the age field in its initial webhook request.

## Solution
In your Ringba webhook configuration, you need to add the age field to the Body:

```json
{
  "CID": "[tag:InboundNumber:Number-NoPlus]",
  "exposeCallerId": "yes",
  "publisherInboundCallId": "[Call:InboundCallId]",
  "zipcode": "[tag:Geo:ZipCode]",
  "age": ""
}
```

## Why This Works
1. Ringba sends webhook with empty "age" field
2. Your middleware receives it
3. Middleware replaces empty "age" with random value (65-75)
4. Middleware forwards to RTB with the required age field
5. RTB accepts it because age is now present

## Alternative: Use a Placeholder
If Ringba validates that age must have a value, use a placeholder:

```json
{
  "CID": "[tag:InboundNumber:Number-NoPlus]",
  "exposeCallerId": "yes",
  "publisherInboundCallId": "[Call:InboundCallId]",
  "zipcode": "[tag:Geo:ZipCode]",
  "age": "0"
}
```

Your middleware will replace "0" with the random age (65-75).