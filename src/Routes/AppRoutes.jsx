// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../NotFound/index";

import { AdminRoutes } from "./AdminRoutes";
import { UserRoutes } from "./UserRoutes";
import Login from "../Authentication/Login ";

function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      {/* Protected Section */}
      <Route path='/' element={<ProtectedRoute />}>
        {UserRoutes} {/*  ← imported user routes */}
        {AdminRoutes} {/* ← imported admin routes */}
        {/* Catch-all for logged-in users */}
        <Route path='*' element={<Navigate to='/not-found' />} />
      </Route>

      <Route path='/not-found' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
