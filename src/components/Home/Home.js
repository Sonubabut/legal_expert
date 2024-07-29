import React from 'react';
import './Home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-animation">
        {/* Add your animation here */}
        <img src={"https://test.digitalt3.com/wp-content/uploads/2024/05/land-page_01.png"} alt="Legal AI" className="logo" style={{ width: "400px", height: "300px"}} />
        <h1>Empowering Legal Professionals with AI!</h1>
        <p>Deliver Legal Solutions with Our AWS and SambaNova Powered Expert</p>
      </div>
    </div>
  );
};

export default HomePage;
