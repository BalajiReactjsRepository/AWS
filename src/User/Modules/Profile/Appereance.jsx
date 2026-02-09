import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

import './profile.css';

const Appereance = () => {
  const [language, setLanguage] = useState('en');
  const adjustFontSize = (change) => {
    let root = document.documentElement;
    let currentSize = parseInt(
      getComputedStyle(root).getPropertyValue('--global-font-size')
    );
    let newSize = currentSize + change;

    if (newSize >= 10 && newSize <= 20) {
      root.style.setProperty('--global-font-size', newSize + 'px');
    }
  };

  const resetDefaults = () => {
    setLanguage('en');
    document.documentElement.style.setProperty('--global-font-size', '16px');
  };

  return (
    <div>
      <h6>Appearance</h6>
      <span className='mb-1 d-block' style={{ fontSize: '0.8rem' }}>
        Language
      </span>
      <div className='col-12 col-md-6 col-lg-3' style={{ marginTop: '20px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
          Select Language
        </span>
        <Form.Select
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
          style={{ fontWeight: '600', marginLeft: '10px' }}>
          <option value='en'>English</option>
          {/* <option value='hi'>हिन्दी</option>
          <option value='ta'>தமிழ்</option>
          <option value='te'>తెలుగు</option> */}
        </Form.Select>
      </div>

      <span className='mt-3 mb-1 d-block' style={{ fontSize: '0.8rem' }}>
        Font Size
      </span>

      <div className='font-size-btns'>
        <button className='decreaseBtn' onClick={() => adjustFontSize(-1)}>
          A<sup>-</sup>
        </button>
        <button className='resetBtn' onClick={resetDefaults}>
          A
        </button>
        <button className='increaseBtn' onClick={() => adjustFontSize(1)}>
          A<sup>+</sup>
        </button>
      </div>
    </div>
  );
};

export default Appereance;
