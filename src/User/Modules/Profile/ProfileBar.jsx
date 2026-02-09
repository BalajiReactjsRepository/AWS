import React from "react";
import { Link, useLocation } from "react-router-dom";

import user from "../../../images/UserImages/profileBarIcons/user.png";
import activeUser from "../../../images/UserImages/profileBarIcons/user-active.png";
import language from "../../../images/UserImages/profileBarIcons/language-exchange.png";
import activeLanguage from "../../../images/UserImages/profileBarIcons/language-exchange-active.png";

import "./profile.css";

const ProfileBar = () => {
  const admin_key = process.env.REACT_APP_ADMIN_KEY;
  const userData = JSON.parse(localStorage.getItem(admin_key));

  const location = useLocation();
  const { pathname } = location;

  const barElements = [
    {
      id: 1,
      image: userData.userImage ? userData.userImage : user,
      activeImage: userData.userImage ? userData.userImage : activeUser,
      text: "Profile",
      link: "",
      activePath: "/profile",
    },
    // {
    //   id: 2,
    //   image: faqInfo,
    //   activeImage: activeFaqInfo,
    //   text: 'FAQ’s and Manuals',
    //   link: 'faq-manuals',
    //   activePath: '/profile/faq-manuals',
    // },
    {
      id: 3,
      image: language,
      activeImage: activeLanguage,
      text: "Appearance ",
      link: "appearance",
      activePath: "/profile/appearance",
    },
  ];

  //className='bar-cont'

  return (
    <>
      {barElements.map((e) => {
        const isActive = pathname === e.activePath;
        const linkStyle = {
          textDecoration: "none",
          color: isActive ? "#256df0" : "#000000",
          display: "flex",
          alignItems: "center",
        };

        return (
          <div key={e.id} className="col-12 bar-item-cont">
            <Link to={e.link} style={linkStyle}>
              <img
                className="bar-item-img"
                src={isActive ? e.activeImage : e.image}
                alt={e.text}
              />
              <span>{e.text}</span>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default ProfileBar;
