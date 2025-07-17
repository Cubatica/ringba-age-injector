export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const randomAge = Math.floor(Math.random() * (75 - 65 + 1)) + 65;

  // Standard Ringba fields only
  const payload = {
    CID: req.body.CID || "[tag:InboundNumber:Number-NoPlus]",
    exposeCallerId: "yes",
    publisherInboundCallId: req.body.publisherInboundCallId || "[Call:InboundCallId]",
    zipcode: req.body.zipcode || "[tag:Geo:ZipCode]"
  };

  // Try adding age as URL parameter
  const urlParams = new URLSearchParams({
    age: randomAge.toString(),
    tag1: randomAge.toString(),
    custom_age: randomAge.toString()
  });

  const ringbaUrl = `https://rtb.ringba.com/v1/production/4376312840a84bec890323f97a8885b7.json?${urlParams}`;

  console.log("Forwarded payload:", JSON.stringify(payload));
  console.log("URL with parameters:", ringbaUrl);

  try {
    const response = await fetch(ringbaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.text();
    console.log("Ringba RTB response:", result);
    console.log("Response status:", response.status);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error forwarding to Ringba:", err);
    res.status(500).json({ error: "Failed to forward request" });
  }
}