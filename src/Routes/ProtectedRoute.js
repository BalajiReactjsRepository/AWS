import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = (props) => {
  const tokenKey = process.env.REACT_APP_JWT_TOKEN;
  const jwtToken = Cookies.get(tokenKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) {
      navigate('/login');
    }
  }, [jwtToken, navigate]);

  if (!jwtToken) {
    return null;
  }

  return props.children ?? <Outlet />;
};

export default ProtectedRoute;
