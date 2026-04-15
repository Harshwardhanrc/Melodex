const TOKEN = "YOUR_ACCESS_TOKEN_HERE"; // 🔥 paste token here

function getTrackId(url) {
    return url.split("/track/")[1].split("?")[0];
}

async function analyze() {

    const link = document.getElementById("link").value;

    if (!link.includes("track")) {
        alert("Enter valid Spotify track link");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("result").style.display = "none";
    document.getElementById("result").style.opacity = "0";

    const trackId = getTrackId(link);

    try {

        const res = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: { "Authorization": "Bearer " + TOKEN }
        });

        const data = await res.json();

        const energy = data.energy;
        const tempo = data.tempo;
        const valence = data.valence;
        const danceability = data.danceability;
        const acousticness = data.acousticness;

        console.log(data);

        let mood;

        if (energy > 0.75 && tempo > 120 && danceability > 0.6) {
            mood = "Energetic";
        } 
        else if (valence > 0.65 && energy > 0.5) {
            mood = "Happy";
        } 
        else if (valence < 0.4 && acousticness > 0.5) {
            mood = "Sad";
        } 
        else if (energy < 0.4 && acousticness > 0.6) {
            mood = "Calm";
        } 
        else {
            mood = "Happy";
        }

        const captions = {
            "Energetic": "Perfect for workouts ",
            "Happy": "Lifts your mood instantly ",
            "Calm": "Relax and chill ",
            "Sad": "For emotional moments "
        };
        document.body.style.background =
            mood === "Energetic" ? "linear-gradient(135deg,#ff4d4d,#ff9966)" :
            mood === "Happy" ? "linear-gradient(135deg,#facc15,#fde68a)" :
            mood === "Sad" ? "linear-gradient(135deg,#1e3a8a,#3b82f6)" :
            "linear-gradient(135deg,#0f172a,#1e293b)";

        document.getElementById("loading").style.display = "none";
        document.getElementById("result").style.display = "block";

        document.getElementById("mood").innerText = mood;
        document.getElementById("caption").innerText = captions[mood];

        setTimeout(() => {
            document.getElementById("result").style.opacity = "1";
        }, 100);

    } catch (err) {
        alert("Error fetching data. Token may be expired.");
        console.log(err);
    }
}