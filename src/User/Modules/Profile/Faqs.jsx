import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus, FaMinus } from 'react-icons/fa';
const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const items = [
    {
      title: 'What is Lorem Ipsum?',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s.",
    },
    {
      title: 'Why do we use it?',
      content:
        'It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      title: 'Where does it come from?',
      content:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.',
    },
    {
      title: '1914 translation by H. Rackham',
      content:
        'This translation by H. Rackham from 1914 remains a widely used version of the Lorem Ipsum text.',
    },
    {
      title: 'What is Lorem Ipsum?',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s.",
    },
    {
      title: 'Why do we use it?',
      content:
        'It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      title: 'Where does it come from?',
      content:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.',
    },
    {
      title: '1914 translation by H. Rackham',
      content:
        'This translation by H. Rackham from 1914 remains a widely used version of the Lorem Ipsum text.',
    },
  ];

  return (
    <>
      <div className='accordion' id='faqAccordion'>
        {items.map((item, index) => (
          <div className='accordion-item border-0 border-bottom' key={index}>
            <h2 className='accordion-header'>
              <button
                className='accordion-button d-flex justify-content-between align-items-center bg-white shadow-none p-0 py-2'
                type='button'
                onClick={() => toggleAccordion(index)}
                style={{ boxShadow: 'none' }}>
                {item.title}
                <span className='ms-auto acc-icon-btn'>
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className={`accordion-collapse collapse ${
                openIndex === index ? 'show' : ''
              }`}>
              <div className='accordion-body p-0 pb-2 my-0'>{item.content}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
                  .accordion-button::after {
                      display: none !important;
                  }
              `}</style>
    </>
  );
};

export default Faqs;
