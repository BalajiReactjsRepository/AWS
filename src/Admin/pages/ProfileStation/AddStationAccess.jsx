import React, { useEffect, useState } from "react";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";

const AddStationAccess = () => {
  const [station, setStation] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [profileId, setProfileId] = useState("");
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [accessedStations, setAccessedStations] = useState([]);

  const { store } = useStore();
  const profiles = store.profiles;

  const { action } = useParams();

  useEffect(() => {
    if (!profileId) return;

    const formData = new FormData();
    formData.append("profileId", profileId);
    apiCaller({
      // setLoading,
      apiCall: () =>
        api.post(`/Admin/ShowStationAccess/GetStationList`, formData),
      onSuccess: (result) => setData(result ?? []),
    });
  }, [profileId, userId]);

  useEffect(() => {
    apiCaller({
      apiCall: () => api("/Admin/User/GetUsersList"),
      onSuccess: (result) => setUsers(result),
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(station);
    }, 500);

    return () => clearTimeout(timer);
  }, [station]);

  const handleSearch = (e) => {
    setStation(e.target.value);
  };

  const handleUserId = (e) => {
    const { value } = e.target;
    if (!value) setProfileId("");
    setUserId(value);
  };

  // const handleStationAccess = (stationId, checked) => {
  //   if (checked) {
  //     setAccessedStations((prev) => [...prev, stationId]);
  //   } else {
  //     setAccessedStations((prev) => prev.filter((id) => id !== stationId));
  //   }
  // };

  const handleStationAccess = (stationId, checked) => {
    console.log(stationId);
    // 👉 SELECT ALL
    if (stationId === "0") {
      if (checked) {
        const allIds = data.filter((s) => s._id !== "0").map((s) => s._id);
        setAccessedStations(["0", ...allIds]);
      } else {
        setAccessedStations([]);
      }
      return;
    }

    // 👉 NORMAL SELECT
    if (checked) {
      setAccessedStations((prev) => {
        const updated = [...prev.filter((id) => id !== "0"), stationId];

        const totalStations = data.filter((s) => s._id !== "0").length;

        // if all selected → auto select "All"
        if (updated.length === totalStations) {
          return ["0", ...updated];
        }

        return updated;
      });
    } else {
      // remove station + "All"
      setAccessedStations((prev) =>
        prev.filter((id) => id !== stationId && id !== "0"),
      );
    }
  };

  const handleStationProfile = async () => {
    const url = `/Admin/ShowStationAccess/CreateStationAccess`;
    const stationIds = accessedStations.includes("0")
      ? data.filter((s) => s._id !== "0").map((s) => s._id)
      : accessedStations;
    const body = {
      UserId: userId,
      ProfileId: profileId,
      StationId: stationIds,
    };

    apiCaller({
      apiCall: () => api.post(url, body),
      showSuccess: true,
    });
  };

  const filteredStations = data.filter((s) =>
    s.stationName?.toLowerCase().includes(debouncedValue.toLowerCase()),
  );

  console.log(accessedStations, "balaji");
  return (
    <>
      <div className='d-flex'>
        <select
          className='form-select mapping-drop-input profileVal me-3'
          value={userId}
          onChange={handleUserId}
        >
          <option value=''>Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        {/* {userId && (
          <div className='bg-primary text-light profileVal me-3'>
            {users.find((u) => u._id === userId)?.name}
          </div>
        )} */}
        {userId && (
          <select
            className='form-select mapping-drop-input profileVal me-3'
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          >
            <option value=''>Select Profile</option>
            {profiles.map((p) => (
              <option key={p._id} value={p._id}>
                {p.profileName}
              </option>
            ))}
          </select>
        )}
        {/* {profileId && (
          <div className='bg-primary text-light profileVal'>
            {profiles.find((u) => u._id === profileId)?.profileName}
          </div>
        )} */}
      </div>
      <div className='search-bar my-3 ps-3'>
        <SearchOutlined className='search-icon' />
        <Input
          id='component-search'
          className='search-input unfiled-input'
          placeholder='Search Stations...'
          value={station}
          onChange={handleSearch}
          maxLength={50}
        />
      </div>
      <div className='addStationAccessCont hide-scrollbar'>
        {filteredStations?.map((station, i) => (
          <div
            key={i}
            className='stations-tabs d-flex justify-content-between align-items-center w-100'
          >
            <div className=''>
              <p className='mb-0 station-info'>
                {station.stationName} - {station.stationId}
              </p>
              <p className='mb-0 station-info'>{station.district}</p>
              <p className='mb-0 station-info'>{station.state}</p>
            </div>
            {/* <Form.Group
              className='checkStation'
              type='checkbox'
              checked={accessedStations.includes(station._id)}
              checked={
                station._id === "0"
                  ? accessedStations.includes("0")
                  : accessedStations.includes("0") ||
                    accessedStations.includes(station._id)
              }
              id={station._id}
              onChange={(e) =>
                handleStationAccess(station._id, e.target.checked)
              }
            >
              <Form.Check type='checkbox' className='custom-form-check-input' />
            </Form.Group> */}
            <Form.Group className='checkStation'>
              <Form.Check
                type='checkbox'
                className='custom-form-check-input'
                checked={
                  station._id === "0"
                    ? accessedStations.includes("0")
                    : accessedStations.includes("0") ||
                      accessedStations.includes(station._id)
                }
                onChange={(e) =>
                  handleStationAccess(station._id, e.target.checked)
                }
              />
            </Form.Group>
          </div>
        ))}
      </div>
      {action !== "view-station" && (
        <div className='text-end mt-2'>
          <Button
            variant='secondary'
            className='position-relative z-2'
            type='submit'
            onClick={handleStationProfile}
            disabled={accessedStations?.length === 0}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
};

export default AddStationAccess;
