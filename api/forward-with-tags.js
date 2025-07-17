// Simple in-memory cache to track recent requests
const recentRequests = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  // Check for duplicate request
  const requestId = req.body.publisherInboundCallId;
  if (requestId && recentRequests.has(requestId)) {
    console.log("Duplicate request detected, returning cached response:", requestId);
    return res.status(200).send(recentRequests.get(requestId));
  }

  const randomAge = Math.floor(Math.random() * (75 - 65 + 1)) + 65;
  
  // Extract area code and get zipcode (simplified for demo)
  const cid = req.body.CID || "";
  const areaCode = cid.substring(0, 3);
  const zipcode = req.body.zipcode || getZipcodeForAreaCode(areaCode);
  
  // OPTION 1: Append age and zipcode to the call ID for visibility in Ringba
  const enhancedCallId = `${requestId}_AGE${randomAge}_ZIP${zipcode}`;
  
  // Include all required fields for Ringba RTB
  const payload = {
    CID: req.body.CID,
    exposeCallerId: req.body.exposeCallerId || "yes",
    publisherInboundCallId: enhancedCallId,  // Enhanced with age/zip for visibility
    zipcode: zipcode,
    age: randomAge.toString()
  };

  console.log("Forwarded payload:", JSON.stringify(payload));

  try {
    const response = await fetch(
      "https://rtb.ringba.com/v1/production/4376312840a84bec890323f97a8885b7.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.text();
    
    // Cache the response
    if (requestId) {
      recentRequests.set(requestId, result);
      setTimeout(() => recentRequests.delete(requestId), 30000);
      if (recentRequests.size > 100) {
        const firstKey = recentRequests.keys().next().value;
        recentRequests.delete(firstKey);
      }
    }
    
    res.status(200).send(result);
  } catch (err) {
    console.error("Error forwarding to Ringba:", err);
    res.status(500).json({ error: "Failed to forward request" });
  }
}

function getZipcodeForAreaCode(areaCode) {
  const mapping = {
    "302": "19901",
    "213": "90012",
    "212": "10001",
    // ... add more as needed
  };
  return mapping[areaCode] || "90210";
}