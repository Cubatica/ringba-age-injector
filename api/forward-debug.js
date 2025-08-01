export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const randomAge = Math.floor(Math.random() * (75 - 65 + 1)) + 65;

  // Try different field names that Ringba might accept
  const payload = {
    CID: req.body.CID || "[tag:InboundNumber:Number-NoPlus]",
    exposeCallerId: "yes",
    publisherInboundCallId: req.body.publisherInboundCallId || "[Call:InboundCallId]",
    zipcode: req.body.zipcode || "[tag:Geo:ZipCode]",
    age: randomAge,
    tag1: randomAge.toString(),
    Tag1: randomAge.toString(),
    custom1: randomAge.toString(),
    Custom1: randomAge.toString(),
    userField1: randomAge.toString(),
    UserField1: randomAge.toString(),
    customData: { age: randomAge },
    tags: { age: randomAge }
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
    console.log("Ringba RTB response:", result);
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    // Return debug info
    res.status(200).json({
      sentPayload: payload,
      ringbaResponse: result,
      responseStatus: response.status
    });
  } catch (err) {
    console.error("Error forwarding to Ringba:", err);
    res.status(500).json({ error: "Failed to forward request" });
  }
}