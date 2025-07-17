export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const randomAge = Math.floor(Math.random() * (75 - 65 + 1)) + 65;
  
  // Area code to zipcode mapping (sample major cities)
  const areaCodeToZipcode = {
    // California
    "213": "90012", "310": "90210", "323": "90028", "424": "90405",
    "562": "90802", "626": "91101", "714": "92701", "760": "92008",
    "818": "91401", "858": "92122", "909": "91730", "949": "92614",
    // Florida  
    "305": "33139", "407": "32801", "561": "33401", "786": "33139",
    "813": "33602", "954": "33301",
    // New York
    "212": "10001", "347": "11201", "516": "11501", "631": "11701",
    "718": "11201", "917": "10001",
    // Texas
    "214": "75201", "469": "75201", "512": "78701", "713": "77002",
    "832": "77002", "972": "75201",
    // Illinois
    "312": "60601", "773": "60601", "847": "60201",
    // Pennsylvania
    "215": "19102", "267": "19102", "412": "15213", "724": "15213",
    // Arizona
    "480": "85281", "602": "85001", "623": "85301",
    // Delaware
    "302": "19901",
    // Default
    "default": "90210"
  };
  
  // Extract area code from CID (first 3 digits)
  const cid = req.body.CID || "";
  const areaCode = cid.substring(0, 3);
  const generatedZipcode = areaCodeToZipcode[areaCode] || areaCodeToZipcode["default"];
  
  console.log("CID:", cid, "Area Code:", areaCode, "Generated Zipcode:", generatedZipcode);
  console.log("Request ID:", req.body.publisherInboundCallId, "Timestamp:", new Date().toISOString());

  // Include all required fields for Ringba RTB
  const payload = {
    CID: req.body.CID || "[tag:InboundNumber:Number-NoPlus]",
    exposeCallerId: req.body.exposeCallerId || "yes",
    publisherInboundCallId: req.body.publisherInboundCallId || "[Call:InboundCallId]",
    zipcode: req.body.zipcode || generatedZipcode,  // Use generated zipcode from area code
    age: randomAge.toString()  // Always inject the random age
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
    
    // Parse and log the response to see what Ringba actually received
    try {
      const parsedResult = JSON.parse(result);
      console.log("Parsed RTB response:", JSON.stringify(parsedResult, null, 2));
    } catch (e) {
      console.log("Could not parse RTB response as JSON");
    }
    
    res.status(200).send(result);
  } catch (err) {
    console.error("Error forwarding to Ringba:", err);
    res.status(500).json({ error: "Failed to forward request" });
  }
}