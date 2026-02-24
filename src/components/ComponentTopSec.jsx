import React from "react";
//import { Button } from "antd";
import { Link } from "react-router-dom";

import SearchBar from "./SearchBar";
import AddBtn from "./AddBtn";
import DownloadBtn from "./DownloadBtn";
//import fileIcon from "../images/file-import.png";
import { LuRefreshCw } from "react-icons/lu";
import "./components.css";
import Button from "react-bootstrap/Button";

const ComponentTopSec = (props) => {
  const {
    searchText,
    setSearchText,
    to,
    label,
    handleDownload,
    paginatedData,
    importBtn,
    profiles,
    profileId,
    onChangeProfile,
    showAddBtn = true,
    showDownloadBtn = true,
    refreshBtn = false,
    refreshFun = () => {},
  } = props;

  return (
    <div className='component-top-sec'>
      <SearchBar value={searchText} setFun={setSearchText} />
      <div className='d-flex'>
        {importBtn && (
          <select
            className='form-select mapping-drop-input me-3'
            value={profileId}
            onChange={onChangeProfile}
          >
            <option value=''>Select Profile</option>
            {profiles.map((p) => (
              <option key={p._id} value={p._id}>
                {p.profileName}
              </option>
            ))}
          </select>
        )}
        {showAddBtn && (
          <Link to={to}>
            <AddBtn label={label} />
          </Link>
        )}
        {refreshBtn && (
          <Button variant='primary' onClick={refreshFun}>
            <LuRefreshCw /> Refresh
          </Button>
        )}
        {/* {importBtn && (
          <Link to="import-station">
            <Button
              primary="true"
              icon={
                <img src={fileIcon} alt="import" style={{ width: ".8rem" }} />
              }
              style={{
                marginRight: 8,
                height: "2.4rem",
                cursor: "pointer",
                borderRadius: "2rem",
                color: "#256DF0",
                border: "2px solid #B9B9B9",
              }}
            >
              Import Station
            </Button>
          </Link>
        )} */}
        {showDownloadBtn && (
          <DownloadBtn handleDownload={handleDownload} data={paginatedData} />
        )}
      </div>
    </div>
  );
};

export default ComponentTopSec;
