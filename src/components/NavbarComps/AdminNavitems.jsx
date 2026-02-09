import { SearchOutlined } from "@ant-design/icons";

export const AdminLeftSection = () => {
  return (
    <div className="nav-search-container">
      <SearchOutlined className="search-icon" />
      <input
        type="search"
        id="global-search"
        className="search-input"
        placeholder="Search here"
        style={{ fontSize: "1rem" }}
        maxLength={50}
      />
    </div>
  );
};
