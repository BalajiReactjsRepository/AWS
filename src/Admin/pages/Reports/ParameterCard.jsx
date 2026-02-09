import React from "react";

const ParameterCard = ({ name, value }) => {
  return (
    <div className="parameter-card">
      <p>
        {name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())}
      </p>
      <strong>{value}</strong>
    </div>
  );
};

export default ParameterCard;
