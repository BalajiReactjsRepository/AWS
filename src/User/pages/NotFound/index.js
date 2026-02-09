import React from 'react';
import { Link } from 'react-router-dom';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';

import './index.css';

const NotFoundPage = () => {
  return (
    <div id='root'>
      <div className='not-found-container'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className=''>
              <div className='form-input-content text-center error-page'>
                <h1 className='error-text fw-bold my-5'>404</h1>
                <h4>
                  <BsFillExclamationTriangleFill className='text-warning' />
                  The page you were looking for is not found!
                </h4>
                <p className='my-3'>
                  You may have mistyped the address or the page may have moved.
                </p>
                <div>
                  <Link className='btn btn-danger' to='/'>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
