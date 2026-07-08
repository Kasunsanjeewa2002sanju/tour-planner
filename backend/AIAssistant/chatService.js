const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let localData = {
  destinations: [],
  contacts: [],
  reportText: ""
};

let model;

/**
 * Feeds all data from your specific files into a local searchable index
 */
async function loadContext() {
  try {
    console.log("📂 Feeding local data into AI Assistant...");
    
    const assetsPath = path.resolve(__dirname, "../../frontend/src/assets");
    const pdfPath = path.join(assetsPath, "MonthlyTouritsArrivalsReport-May-2026-Final-1.pdf");
    const csvDestinationsPath = path.join(assetsPath, "Destination Reviews (final).csv");
    const csvAirbnbPath = path.join(assetsPath, "airbnb_plus_personal_contacts.csv");

    // 1. Feed Destinations CSV
    if (fs.existsSync(csvDestinationsPath)) {
      const data = fs.readFileSync(csvDestinationsPath, "utf-8");
      localData.destinations = parse(data, { columns: true, skip_empty_lines: true, bom: true });
      console.log(`✓ Loaded ${localData.destinations.length} Destination records.`);
    }

    // 2. Feed Airbnb Contacts CSV
    if (fs.existsSync(csvAirbnbPath)) {
      const data = fs.readFileSync(csvAirbnbPath, "utf-8");
      localData.contacts = parse(data, { columns: true, skip_empty_lines: true, bom: true });
      console.log(`✓ Loaded ${localData.contacts.length} Airbnb records.`);
    }

    // 3. Feed PDF Report
    if (fs.existsSync(pdfPath)) {
      try {
        const pdf = require("pdf-parse");
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdf(dataBuffer);
        localData.reportText = pdfData.text;
        console.log(`✓ Fed Tourist Arrivals Report.`);
      } catch (e) { console.warn("⚠️ PDF skipping"); }
    }

    // Initialize Gemini (Free Tier)
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.includes("Ab8")) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("✨ Gemini AI fallback active.");
    }

    console.log("✅ Ready.");
  } catch (error) {
    console.error("❌ Error feeding data:", error);
  }
}

/**
 * Modern Search Logic (Case-insensitive)
 */
function searchLocalData(query) {
  const q = query.toLowerCase();
  
  // Search Destinations
  const dest = localData.destinations.find(d => 
    Object.values(d).some(v => String(v).toLowerCase().includes(q))
  );
  if (dest) {
    return `📍 Destination: ${dest.Destination || "Unknown"}
District: ${dest.District || "N/A"}
Timespan: ${dest.Timespan || "N/A"}
Review: "${dest.Review || "No review available"}"`;
  }

  // Search Airbnb
  const air = localData.contacts.find(c => 
    Object.values(c).some(v => String(v).toLowerCase().includes(q))
  );
  if (air) {
    return `🏠 Property: ${air.name || "Unknown"}
Guests: ${air.numberOfGuests || "N/A"}
Type: ${air.roomType || "N/A"}
Stars: ${air.stars || "N/A"}`;
  }

  // Search PDF
  if (localData.reportText.toLowerCase().includes(q)) {
    const idx = localData.reportText.toLowerCase().indexOf(q);
    return `📊 From Report: "...${localData.reportText.substring(Math.max(0, idx - 100), idx + 200)}..."`;
  }

  return null;
}

async function getChatResponse(userMessages) {
  const lastQuery = userMessages[userMessages.length - 1].content;

  // 1. Try LOCAL SEARCH first
  const localAnswer = searchLocalData(lastQuery);
  if (localAnswer) {
    return "I found this in our records:\n\n" + localAnswer;
  }

  // 2. AI Fallback
  if (model) {
    try {
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: "Use this context: " + localData.reportText.substring(0, 1000) }] },
          { role: "model", parts: [{ text: "Understood." }] },
        ],
      });
      const result = await chat.sendMessage(lastQuery);
      return result.response.text();
    } catch (e) {
      return "I couldn't find a direct match. Try searching for a specific place name or property!";
    }
  }

  return "I couldn't find a match in the records. Try checking the spelling of the destination or property name!";
}

module.exports = { loadContext, getChatResponse };
