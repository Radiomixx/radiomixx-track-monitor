export default async function handler(req, res) {
  try {
    const response = await fetch("http://live.radiomixx.ro:8888/stats?sid=1&json=1");
    const data = await response.json();

    const currentSong = data.songtitle || "Unknown";

    res.status(200).json({
      nowPlaying: currentSong,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Shoutcast data" });
  }
}
