import React, { useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "./help.css";

const FaqManuals = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  const items = [
    {
      title: "What is Lorem Ipsum?",
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s.`,
    },
    {
      title: "Why do we use it?",
      content:
        "It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      title: "Where does it come from?",
      content:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
    {
      title: "1914 translation by H. Rackham",
      content:
        "This translation by H. Rackham from 1914 remains a widely used version of the Lorem Ipsum text.",
    },
    {
      title: "What is Lorem Ipsum?",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s.",
    },
    {
      title: "Why do we use it?",
      content:
        "It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      title: "Where does it come from?",
      content:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
    {
      title: "1914 translation by H. Rackham",
      content:
        "This translation by H. Rackham from 1914 remains a widely used version of the Lorem Ipsum text.",
    },
    {
      title: "What is Lorem Ipsum?",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s.",
    },
    {
      title: "Why do we use it?",
      content:
        "It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      title: "Where does it come from?",
      content:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.",
    },
    {
      title: "1914 translation by H. Rackham",
      content:
        "This translation by H. Rackham from 1914 remains a widely used version of the Lorem Ipsum text. vdhgvd vhf ivyhfj gruihvn fuierhv reiuryh erwafvihd dsvjhdsvnd vijdshv dsvjdshvidsj vdishvd vdsiuvhdsiv dsjbv8dhnvdsvihdsv dvusdhvn dvdsiuvhd vsdjvhdsvn dsjvychvn dsvisdyuvjn dsvdfubjfmd vbf9b ujfdm fivujfsd vdsvdsuivfdbjfdm bfj mvdfvkfdiubhfdo  dfhvnrvdfvsfd vdfuvjd vsdivhn vdsvds vdivdhvndsvadsyidsv siuvhydsjnsdivydsvn dkjysdndsidsuds vdsihdsjn sdjvydsvhbsdvhydsvhds vsdiuhvdsnvdsivysdv dsivhdsvd sijdhidsn dsihds dsjhdsuhvdsjv dshdyvds dsjhgdc sdciduhds cSDugchsdcb Sjh",
    },
  ];

  return (
    <div className="accordion custom-accordion-faq" id="faqAccordion">
      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header">
            <button
              className="accordion-button custom-accordion-btn"
              type="button"
              onClick={() => toggleAccordion(index)}
            >
              <span className="accordion-title">{item.title}</span>
              <span className="acc-icon-btn">
                {openIndex === index ? (
                  <MinusOutlined style={{ color: "#fff", fontSize: "14px" }} />
                ) : (
                  <PlusOutlined style={{ color: "#fff", fontSize: "14px" }} />
                )}
              </span>
            </button>
          </h2>
          {openIndex === index && (
            <div className="accordion-body">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqManuals;
