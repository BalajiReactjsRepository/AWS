import React, { useState } from "react";

const SensorSelectComponent = (props) => {
  const { selectedSensors, setSelectedSensors, allSensors } = props;
  const [activeGroup, setActiveGroup] = useState("");

  const onClickOpenAccordian = (key) => {
    if (activeGroup === key) {
      setActiveGroup("");
    } else {
      setActiveGroup(key);
    }
  };

  const handleAddSensor = (sensor) => {
    setSelectedSensors((prev) => {
      const exists = prev.some((s) => s.sensorId === sensor._id);

      if (exists) {
        // remove it
        return prev.filter((s) => s.sensorId !== sensor._id);
      }

      // add it
      return [
        ...prev,
        {
          _id: "",
          sensorId: sensor._id,
          sensorName: sensor.sensorName,
        },
      ];
    });
  };

  return (
    <div className='station-profile-accordian-cont'>
      <h6 className='station-profile-accordian-heading'>Select Sensors</h6>
      <div
        className='accordion station-profile-accordian'
        defaultactivekey={activeGroup}
      >
        {allSensors.map((group) => (
          <div
            className='accordion-item station-profile-accordian-item'
            eventkey={group.make}
            key={group.make}
          >
            <h2 className='accordion-header station-profile-accordian-item-header'>
              <button
                className={`accordion-button station-profile-accordian-button ${
                  activeGroup === group.make ? "" : "collapsed"
                }`}
                type='button'
                aria-expanded={activeGroup === group.make}
                onClick={() => onClickOpenAccordian(group.make)}
              >
                <span className='accordion-title'>{group.make}</span>
              </button>
            </h2>
            {activeGroup === group.make ? (
              <div className='accordion-body custom-accordian-body'>
                {group.sensors.map((sensor) => (
                  <div className='form-check mb-2' key={sensor._id}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={sensor.id}
                      checked={selectedSensors.some(
                        (s) => s.sensorId === sensor._id,
                      )}
                      onChange={() => handleAddSensor(sensor)}
                    />
                    <label className='form-check-label' htmlFor={sensor._id}>
                      <div>
                        <strong>Sensor Name</strong>: {sensor.sensorName}
                      </div>
                      <div>
                        <strong>Type</strong>: {sensor.sensorType}
                      </div>
                      <div>
                        <strong>Model</strong>: {sensor.modelNo}
                      </div>
                      <div>
                        <strong>Parameter</strong>: {sensor.aliasName}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorSelectComponent;
