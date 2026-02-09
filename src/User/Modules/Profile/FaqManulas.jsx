import React, { useState } from 'react';

import './profile.css';
import Manuals from './Manuals';
import Faqs from './Faqs';

const FaqManulas = () => {
  const [currentForm, setCurrentForm] = useState('faqs');

  return (
    <div className='w-100'>
      <div>
        <h6>FAQ’s and Manuals</h6>
        <select
          className='faqs-select'
          value={currentForm}
          onChange={(e) => setCurrentForm(e.target.value)}>
          <option value='faqs'>Frequently Asked Questions</option>
          <option value='manuals'>Manuals</option>
        </select>
      </div>
      <div className='acc-container'>
        {currentForm === 'faqs' ? <Faqs /> : <Manuals />}
      </div>
    </div>
  );
};

export default FaqManulas;
