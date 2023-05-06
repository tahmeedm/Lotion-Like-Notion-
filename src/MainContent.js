//FILE: ./src/MainContent.js
import React, { useState, useEffect } from "react";
import "./index.css";

// A simple Card component to display the obituary
function ObituaryCard({ imageUrl, name, obituaryText, obituarySpeechUrl }) {
  const playSpeech = () => {
    const audio = new Audio(obituarySpeechUrl);
    audio.play();
  };

  return (
    <div className="obituary-card">
      <img src={imageUrl} alt={`${name}'s profile`} className="profile-image" />
      <h2 className="name">{name}</h2>
      <p className="obituary-text">{obituaryText}</p>
      <button className="play-speech" onClick={playSpeech}>
        Play Speech
      </button>
    </div>
  );
}

function MainContent() {
  const [obituaries, setObituaries] = useState([]);

  useEffect(() => {
    fetchObituaries();
  }, []);

  const fetchObituaries = async () => {
    // Replace this URL with the actual cloudinary API URL to fetch obituaries
    const apiUrl = "https://api.cloudinary.com/v1_1/your_cloud_name/resource_list/obituaries";
    const response = await fetch(apiUrl);
    const data = await response.json();
    setObituaries(data.resources);
  };

  return (
    <div className="main-content">
      {obituaries.map((obituary) => (
        <ObituaryCard
          key={obituary.public_id}
          imageUrl={obituary.secure_url}
          name={obituary.context.custom.name}
          obituaryText={obituary.context.custom.obituary_text}
          obituarySpeechUrl={obituary.context.custom.obituary_speech_url}
        />
      ))}
    </div>
  );
}

export default MainContent;




