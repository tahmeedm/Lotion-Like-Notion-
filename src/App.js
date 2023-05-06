//FILE: ./src/App.js
import React, { useState } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

function App() {
  const [obituaries, setObituaries] = useState([]);

  const handleCreateObituary = (obituary) => {
    setObituaries((prevState) => [...prevState, obituary]);
  };

  const handleDeleteObituary = (index) => {
    setObituaries((prevState) => {
      const updatedObituaries = [...prevState];
      updatedObituaries.splice(index, 1);
      return updatedObituaries;
    });
  };

  return (
    <div>
      <Header handleCreateObituary={handleCreateObituary} />
      <MainContent obituaries={obituaries} handleDeleteObituary={handleDeleteObituary} />
      <Footer />
    </div>
  );
}

export default App;


