/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../User/Modules/Sidebar";

import Footer from "../User/Modules/Footer";

import { useStationProfile } from "../Context/usercontext";
import NavbarModule from "../components/NavbarComps/Navbar";

const UserLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const navigate = useNavigate();

  const { setIsRjProfile, setIsKaranataka } = useStationProfile();

  const userData = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_ADMIN_KEY),
  );

  const { profileDetailsList = [], accessiblePortals = [] } = userData;

  const dropDownMenu = accessiblePortals?.includes("ADM")
    ? [
        {
          key: "admin",
          label: <span onClick={() => navigate("/admin")}>Admin Portal</span>,
        },
      ]
    : [];

  useEffect(() => {
    if (!profileDetailsList.length) {
      setIsRjProfile(false);
      setIsKaranataka(false);
      return;
    }

    const isRjProfile = profileDetailsList.every((p) =>
      p.profileName?.toLowerCase().includes("nhp-rj"),
    );

    const isKarnataka = profileDetailsList.every((p) =>
      p.profileName?.toLowerCase().includes("wrd-karnatak"),
    );

    setIsRjProfile(isRjProfile);
    setIsKaranataka(isKarnataka);
  }, [profileDetailsList]);

  return (
    <div className='webpage'>
      <section
        className={
          showSidebar ? "displaySidebar" : "displaySidebar hideSidebar"
        }
      >
        <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </section>
      <section className={`mainCont ${showSidebar ? "" : "fullWidth"}`}>
        <NavbarModule
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
          dropDownMenu={dropDownMenu}
        />
        <Outlet />
        <Footer showSidebar={showSidebar} />
      </section>
    </div>
  );
};

export default UserLayout;
