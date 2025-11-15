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

  const randomAge = Math.floor(Math.random() * (76 - 72 + 1)) + 72;
  
  // Comprehensive US area code to zipcode mapping
  const areaCodeToZipcode = {
    // Alabama
    "205": "35203", "251": "36602", "256": "35801", "334": "36104", "659": "35203", "938": "35801",
    // Alaska
    "907": "99501",
    // Arizona
    "480": "85281", "520": "85701", "602": "85001", "623": "85301", "928": "86001",
    // Arkansas
    "479": "72701", "501": "72201", "870": "72401",
    // California
    "209": "95201", "213": "90012", "279": "95401", "310": "90210", "323": "90028", "341": "94501",
    "408": "95101", "415": "94102", "424": "90405", "442": "92101", "510": "94601", "530": "95814",
    "559": "93701", "562": "90802", "619": "92101", "626": "91101", "628": "94102", "650": "94301",
    "657": "92801", "661": "93301", "669": "95101", "707": "94590", "714": "92701", "747": "91301",
    "760": "92008", "805": "93001", "818": "91401", "831": "93901", "840": "90201", "858": "92122",
    "909": "91730", "916": "95814", "925": "94501", "949": "92614", "951": "92501",
    // Colorado
    "303": "80202", "719": "80901", "720": "80202", "970": "80521",
    // Connecticut
    "203": "06510", "475": "06510", "860": "06103", "959": "06103",
    // Delaware
    "302": "19901",
    // Florida
    "239": "33901", "305": "33139", "321": "32801", "352": "34601", "386": "32114", "407": "32801",
    "561": "33401", "689": "32801", "727": "33701", "754": "33301", "772": "34950", "786": "33139",
    "813": "33602", "850": "32301", "863": "33801", "904": "32202", "941": "34236", "954": "33301",
    // Georgia
    "229": "31701", "404": "30303", "470": "30303", "478": "31201", "678": "30303", "706": "30601",
    "762": "30601", "770": "30303", "912": "31401", "943": "30303",
    // Hawaii
    "808": "96813",
    // Idaho
    "208": "83701", "986": "83701",
    // Illinois
    "217": "62701", "224": "60201", "309": "61601", "312": "60601", "331": "60101", "618": "62901",
    "630": "60101", "708": "60101", "773": "60601", "779": "61101", "815": "61101", "847": "60201",
    "872": "60601",
    // Indiana
    "219": "46301", "260": "46801", "317": "46201", "463": "46201", "574": "46601", "765": "47901",
    "812": "47401", "930": "47401",
    // Iowa
    "319": "52401", "515": "50301", "563": "52001", "641": "50001", "712": "51501",
    // Kansas
    "316": "67201", "620": "67801", "785": "66601", "913": "66101",
    // Kentucky
    "270": "42101", "364": "40201", "502": "40201", "606": "40601", "859": "40501",
    // Louisiana
    "225": "70801", "318": "71101", "337": "70501", "504": "70112", "985": "70360",
    // Maine
    "207": "04101",
    // Maryland
    "227": "20601", "240": "20601", "301": "20601", "410": "21201", "443": "21201", "667": "21201",
    // Massachusetts
    "339": "02101", "351": "02101", "413": "01001", "508": "02301", "617": "02101", "774": "02301",
    "781": "02101", "857": "02101", "978": "01801",
    // Michigan
    "231": "49601", "248": "48001", "269": "49001", "313": "48201", "517": "48901", "586": "48001",
    "616": "49501", "734": "48101", "810": "48401", "906": "49801", "947": "48001", "989": "48601",
    // Minnesota
    "218": "55801", "320": "56301", "507": "55901", "612": "55401", "651": "55101", "763": "55401",
    "952": "55401",
    // Mississippi
    "228": "39501", "601": "39201", "662": "38601", "769": "39201",
    // Missouri
    "314": "63101", "417": "65801", "573": "65201", "636": "63001", "660": "64001", "816": "64101",
    // Montana
    "406": "59101",
    // Nebraska
    "308": "68901", "402": "68101", "531": "68101",
    // Nevada
    "702": "89101", "725": "89101", "775": "89501",
    // New Hampshire
    "603": "03101",
    // New Jersey
    "201": "07001", "551": "07001", "609": "08601", "640": "08601", "732": "08901", "848": "08901",
    "856": "08101", "862": "07001", "908": "07901", "973": "07001",
    // New Mexico
    "505": "87101", "575": "88001",
    // New York
    "212": "10001", "315": "13201", "332": "10001", "347": "11201", "516": "11501", "518": "12201",
    "585": "14601", "607": "13901", "631": "11701", "646": "10001", "680": "13201", "716": "14201",
    "718": "11201", "838": "12201", "845": "10901", "914": "10601", "917": "10001", "929": "11201",
    "934": "11501",
    // North Carolina
    "252": "27801", "336": "27101", "704": "28201", "743": "27101", "828": "28801", "910": "28301",
    "919": "27601", "980": "28201", "984": "27601",
    // North Dakota
    "701": "58501",
    // Ohio
    "216": "44101", "220": "44101", "234": "44301", "283": "45201", "330": "44301", "380": "44101",
    "419": "43601", "440": "44101", "513": "45201", "567": "43601", "614": "43201", "740": "43701",
    "937": "45401",
    // Oklahoma
    "405": "73101", "539": "74101", "580": "73501", "918": "74101",
    // Oregon
    "458": "97401", "503": "97201", "541": "97401", "971": "97201",
    // Pennsylvania
    "215": "19102", "223": "17101", "267": "19102", "272": "17101", "412": "15213", "445": "19102",
    "484": "19001", "570": "17701", "610": "19001", "717": "17101", "724": "15213", "814": "16501",
    "878": "15213",
    // Rhode Island
    "401": "02901",
    // South Carolina
    "803": "29201", "843": "29401", "854": "29401", "864": "29601",
    // South Dakota
    "605": "57101",
    // Tennessee
    "423": "37401", "615": "37201", "629": "37201", "731": "38301", "865": "37901", "901": "38101",
    "931": "37040",
    // Texas
    "210": "78201", "214": "75201", "254": "76701", "281": "77001", "325": "79601", "346": "77001",
    "361": "78401", "409": "77701", "430": "75201", "432": "79701", "469": "75201", "512": "78701",
    "682": "76101", "713": "77002", "726": "78201", "737": "78701", "806": "79101", "817": "76101",
    "830": "78801", "832": "77002", "903": "75701", "915": "79901", "936": "77301", "940": "76201",
    "945": "75201", "956": "78501", "972": "75201", "979": "77801",
    // Utah
    "385": "84101", "435": "84701", "801": "84101",
    // Vermont
    "802": "05601",
    // Virginia
    "276": "24201", "434": "22901", "540": "22401", "571": "22301", "703": "22301", "757": "23501",
    "804": "23219", "826": "23219", "948": "22301",
    // Washington
    "206": "98101", "253": "98401", "360": "98501", "425": "98001", "509": "99201", "564": "98501",
    // West Virginia
    "304": "25301", "681": "25301",
    // Wisconsin
    "262": "53001", "274": "53201", "414": "53201", "534": "53201", "608": "53701", "715": "54701",
    "920": "54301",
    // Wyoming
    "307": "82001",
    // Washington DC
    "202": "20001", "771": "20001",
    // US Territories
    "340": "00801", // US Virgin Islands
    "670": "96910", // Northern Mariana Islands
    "671": "96910", // Guam
    "684": "96799", // American Samoa
    "787": "00901", // Puerto Rico
    "939": "00901", // Puerto Rico
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
    zipcode: "[tag:Geo:ZipCode|tag:User:zipcode|tag:User:Zip]",  // Always pass through Ringba tags
    age: req.body.age || randomAge.toString()  // Use req.body.age if provided, otherwise use randomAge
  };

  console.log("Forwarded payload:", JSON.stringify(payload));

  try {
    const response = await fetch(
      "https://rtb.ringba.com/v1/production/7f8a0e20448a47e091435d432004f044.json",
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
    
    // Cache the response
    if (requestId) {
      recentRequests.set(requestId, result);
      
      // Clean up old entries after 30 seconds
      setTimeout(() => {
        recentRequests.delete(requestId);
      }, 30000);
      
      // Prevent memory leak - keep only last 100 requests
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
