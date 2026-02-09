import React from 'react';
import { MdOutlineZoomIn } from 'react-icons/md';

import { MdOutlineZoomOut } from 'react-icons/md';
import { TbZoomReset } from 'react-icons/tb';

const ZoomCtrlComp = ({ setZoomFactor }) => {
  // --- Handle zoom controls ---
  const handleZoomIn = () => {
    // const minPoints = 10; // Minimum number of data points to show (prevent zooming in beyond 10 points)

    // // Calculate new end point
    // const newEnd = Math.max(zoomRange.end - 50, zoomRange.start + minPoints);
    // setZoomRange({
    //   start: zoomRange.start,
    //   end: newEnd,
    // });
    // console.log(`incraseing zomm ${zoomFactor}`);
    setZoomFactor((prev) => prev + 1); // Increase zoom factor
  };

  const handleZoomOut = () => {
    // setZoomRange((prev) => {
    //   const newEnd = Math.min(prev.end + 50, chartData.length);
    //   return { ...prev, end: newEnd };
    // });
    setZoomFactor((prev) => Math.max(prev - 1, 1)); // Decrease zoom factor
  };

  // --- Reset Zoom ---
  const resetZoom = () => {
    // setZoomRange({ start: 0, end: 100 });
    setZoomFactor(10);
  };
  return (
    <div
      className='d-flex justify-content-between align-self-end align-items-center fs-4 px-2 my-2 border border-1'
      style={{ width: '100px', cursor: 'pointer' }}>
      <div className='border-end'>
        <MdOutlineZoomIn onClick={handleZoomIn} />
      </div>
      <div className='border-end'>
        <MdOutlineZoomOut onClick={handleZoomOut} />
      </div>
      <div className='fs-5'>
        <TbZoomReset onClick={resetZoom} />
      </div>
    </div>
  );
};

export default ZoomCtrlComp;
