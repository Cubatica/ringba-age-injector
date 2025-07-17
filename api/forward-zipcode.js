export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const randomAge = Math.floor(Math.random() * (75 - 65 + 1)) + 65;

  // SOLUTION: Put age in the zipcode field since Ringba accepts it
  // Format: "zipcode-age" e.g., "90210-72"
  const originalZipcode = req.body.zipcode || "";
  const zipcodeWithAge = originalZipcode ? `${originalZipcode}-${randomAge}` : randomAge.toString();

  const payload = {
    CID: req.body.CID || "[tag:InboundNumber:Number-NoPlus]",
    exposeCallerId: "yes",
    publisherInboundCallId: req.body.publisherInboundCallId || "[Call:InboundCallId]",
    zipcode: zipcodeWithAge  // This will be like "90210-72" or just "72" if no zipcode
  };

  console.log("Forwarded payload with age in zipcode:", JSON.stringify(payload));

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
    res.status(200).send(result);
  } catch (err) {
    console.error("Error forwarding to Ringba:", err);
    res.status(500).json({ error: "Failed to forward request" });
  }
}