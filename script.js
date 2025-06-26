const token = "YOUR_SPOTIFY_ACCESS_TOKEN"; // replace this

const moodToQuery = {
  happy: "happy vibes",
  sad: "sad songs",
  angry: "angry workout",
  anxious: "calm relaxing",
  romantic: "romantic hits"
};

async function fetchWebApi(endpoint, method) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method
  });
  return await res.json();
}

async function getPlaylistsByMood(mood) {
  const query = moodToQuery[mood] || "feel good";
  const result = await fetchWebApi(`v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=3`, 'GET');
  return result.playlists.items;
}

function detectMood(text) {
  const lower = text.toLowerCase();
  if (lower.includes("happy") || lower.includes("joy") || lower.includes("excited")) return "happy";
  if (lower.includes("sad") || lower.includes("depressed") || lower.includes("cry")) return "sad";
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious")) return "angry";
  if (lower.includes("anxious") || lower.includes("nervous") || lower.includes("worried")) return "anxious";
  if (lower.includes("love") || lower.includes("crush") || lower.includes("romantic")) return "romantic";
  return "happy";
}

async function generateMusic() {
  const input = document.getElementById("moodInput").value;
  const mood = detectMood(input);
  const playlists = await getPlaylistsByMood(mood);

  const output = playlists.map(pl => `
    🎧 <a href="${pl.external_urls.spotify}" target="_blank">${pl.name}</a>
  `).join("<br>");

  document.getElementById("playlist").innerHTML = output;
  document.getElementById("resultBox").style.display = "block";
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("moodInput").value = transcript;
    generateMusic();
  };
  recognition.start();
}
