import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./components.css";

const SearchBar = ({ value, setFun }) => {
  return (
    <div className="search-bar">
      <SearchOutlined className="search-icon" />
      <Input
        id="component-search"
        className="search-input unfiled-input"
        placeholder="Search here"
        value={value}
        onChange={(e) => setFun(e.target.value)}
        maxLength={50}
      />
    </div>
  );
};

export default SearchBar;
