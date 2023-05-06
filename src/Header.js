//FILE ./src/Header.js
import React, { useState } from 'react';
import { processObituary } from './index.js';

const Header = ({ handleCreateObituary }) => {
  const [showForm, setShowForm] = useState(false);
  const [createdObituary, setCreatedObituary] = useState({
    name: '',
    dateOfBirth: '',
    dateOfDeath: '',
    image: '',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowForm(false);
    
    const processedObituary = await processObituary(createdObituary);
    handleCreateObituary(processedObituary);
    
    setCreatedObituary({
      name: '',
      dateOfBirth: '',
      dateOfDeath: '',
      image: '',
    });
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleChange = (event) => {
    setCreatedObituary({ ...createdObituary, [event.target.name]: event.target.value });
  };

  const handleImageUpload = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCreatedObituary({ ...createdObituary, image: e.target.result });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleImageValidation = (event) => {
    event.target.setCustomValidity('Please upload an image.');
  };

  return (
    <header className="header-container">
      <h1 className="header-left">The Last Show</h1>
      <button
        className="header-button"
        onClick={() => setShowForm(true)}
        style={{ fontSize: '28px', padding: '20px' }}
      >
        Create New Obituary
      </button>
        {showForm && (
        <div className="popup">
          <form onSubmit={handleFormSubmit}>
            {/* ... (the rest of your form elements) */}
            <label htmlFor="image-upload" style={{ display: 'block' }}>
              Upload an image:
            </label>
            <input
              type="file"
              id="image-upload"
              name="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              required
              onInvalid={handleImageValidation}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            <br />
            <img
              src={createdObituary.image || 'https://via.placeholder.com/200'}
              alt="Placeholder"
              width="200"
              height="200"
              style={{ marginBottom: '10px' }}
            />
            <br />
            <label htmlFor="name">Person's Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={createdObituary.name}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              required
              value={createdObituary.dateOfBirth}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="dateOfDeath">Date of Death:</label>
            <input
              type="date"
              id="dateOfDeath"
              name="dateOfDeath"
              required
              value={createdObituary.dateOfDeath}
              onChange={handleChange}
            />
            <br />
            
            <button type="submit" style={{ fontSize: '24px' }}>
              Create
            </button>
            <button onClick={handleFormClose} style={{ fontSize: '24px' }}>
              Cancel
            </button>

          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
