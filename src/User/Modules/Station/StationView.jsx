import React, { useEffect, useRef } from "react";
import { FaCircle } from "react-icons/fa";
import MapEmbed from "../../../components/MapEmbed";

import stationDummyImage from "../../../images/UserImages/dummystation.png";

const StationView = ({ stationData, district }) => {
  const timeRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toString();
      }
      requestAnimationFrame(updateTime);
    };

    requestAnimationFrame(updateTime);

    // Cleanup
    return () => cancelAnimationFrame(updateTime);
  }, [timeRef]);

  return (
    <div className='row'>
      <div className='col-12  d-flex justify-content-between'>
        <div className='d-flex align-items-start'>
          <FaCircle
            style={{ marginTop: "0.4rem" }}
            size='11'
            fill={stationData.stationStatus === "Yes" ? "#00FF09" : "#FF0000"}
          />
          <h6 className='section-heading ms-2'>
            {stationData.stationName}
            <br />
            <span className='location-id'>{stationData.stationId}</span>
          </h6>
        </div>

        <span className='mb-2 side-heading' ref={timeRef}>
          {new Date().toString()}
        </span>
      </div>

      <div className='col-md-8 col-xl-9'>
        <MapEmbed locations={[stationData]} height={"13.6rem"} Zoom={5} />
      </div>

      <div className='col-sm-12 col-md-4 col-xl-3 mt-3 mt-md-0 d-flex justify-content-md-end'>
        <div className='location-cont'>
          <img
            src={stationData.stationImg || stationDummyImage}
            alt='station img'
            className='locationImg'
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <div className='location-details'>
            <span
              style={{
                fontSize: ".8rem",
                marginBottom: "0",
                color: "rgba(255, 255, 255, 0.64)",
              }}
            >
              Station Location
            </span>
            <p
              className='text-white'
              style={{
                fontSize: "0.9rem",
                marginBottom: "0",
              }}
            >
              {stationData.stationName} , {district}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationView;
