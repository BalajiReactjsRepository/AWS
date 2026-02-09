import React from "react";
import "./dashboard.css";
import { useStationProfile } from "../../Context/usercontext";

const Footer = ({ showSidebar }) => {
  const { isRjProfile, isKaranataka } = useStationProfile();
  return (
    <footer
      className="footer-container"
      style={{ width: showSidebar ? "80%" : "100%" }}
    >
      <div>
        Copyright © {new Date().getFullYear()}{" "}
        <a
          // style={{ textDecoration: "none", color: "black" }}
          href="https://www.azistaindustries.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {isRjProfile || isKaranataka
            ? "Maintain by Azista Industries Pvt. Ltd."
            : "Azista Industries Pvt. Ltd."}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
