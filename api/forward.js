export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const randomAge = Math.floor(Math.random() * (75 - 65 + 1)) + 65;

  const payload = {
    CID: req.body.CID || "[tag:InboundNumber:Number-NoPlus]",
    exposeCallerId: "yes",
    publisherInboundCallId: req.body.publisherInboundCallId || "[Call:InboundCallId]",
    zipcode: req.body.zipcode || "[Geo:ZipCode]",
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
    res.status(200).send(result);
  } catch (err) {
    console.error("Error forwarding to Ringba:", err);
    res.status(500).json({ error: "Failed to forward request" });
  }
}