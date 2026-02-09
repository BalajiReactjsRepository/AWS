import React from 'react';
import ProfileBar from '../Modules/Profile/ProfileBar';
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div className='mainContInfo'>
      <h5 className='mb-4'>Account</h5>
      <div className='row'>
        <div className='col-5 col-md-3 col-xl-2 bar-cont'>
          <ProfileBar />
        </div>
        <div className='col-7 col-md-9 col-xl-9'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
