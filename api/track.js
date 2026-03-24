import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 1. Fetch Shoutcast data
    const response = await fetch("http://live.radiomixx.ro:8888/stats?sid=1&json=1");
    const data = await response.json();

    const currentSong = data.songtitle || "Unknown";

    // 2. Path către history.json
    const historyPath = path.join(process.cwd(), "history.json");

    // 3. Citim istoricul existent
    let history = [];
    try {
      const fileData = fs.readFileSync(historyPath, "utf8");
      history = JSON.parse(fileData);
    } catch (err) {
      history = [];
    }

    // 4. Adăugăm melodia curentă în istoric
    history.push({
      song: currentSong,
      time: new Date().toISOString()
    });

    // 5. Limităm istoricul la 10.000 melodii
    if (history.length > 10000) {
      history = history.slice(history.length - 10000);
    }

    // 6. Salvăm istoricul actualizat
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

    // 7. Detectăm repetările
    const repeatCount = history.filter(entry => entry.song === currentSong).length;
    const isRepeated = repeatCount > 1;

    // 8. Trimitem răspunsul API
    res.status(200).json({
      nowPlaying: currentSong,
      isRepeated,
      repeatCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Shoutcast data" });
  }
}
