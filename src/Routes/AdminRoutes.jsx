import React from "react";
import { Navigate, Route } from "react-router-dom";

import AdminLayout from "../Layouts/AdminLayout";

import RoleMaster from "../Admin/pages/Master/RoleMaster";
import ManageMenu from "../Admin/pages/Master/ManageMenu";
import RoleMatrix from "../Admin/pages/Master/RoleMatrix";
import ManageProfile from "../Admin/pages/ProfileStation/ManageProfile";
import ManageStation from "../Admin/pages/ProfileStation/ManageStation";
//import ManageNotifications from "../Admin/pages/NotificationAlert/ManageNotifications";
//import ManageBannersAds from "../Admin/pages/NotificationAlert/ManageBannersAds";
//import NotificationsAlertForm from "../Admin/pages/NotificationAlert/NotificationsAlertForm";

import ManageSensor from "../Admin/pages/Sensorparameterconfig/ManageSensor";
import SensorParameterMapping from "../Admin/pages/Sensorparameterconfig/SensorParameterMap";
import ManageUser from "../Admin/pages/Master/ManageUser";
import ClientConfig from "../Admin/pages/Master/ClientConfig";
//import FaqManuals from "../Admin/pages/Help-Support/FaqManuals";
//import CustomerSuport from "../Admin/pages/Help-Support/CustomerSuport";
import RoleMasterAction from "../Admin/pages/Master/RoleMasterAction";
import ManageUserActions from "../Admin/pages/Master/ManageUserActions";
import ClientConfigActions from "../Admin/pages/Master/ClientConfigActions";
import ManageSensorAction from "../Admin/pages/Sensorparameterconfig/ManageSensorAction";
import ParameterMappingAction from "../Admin/pages/Sensorparameterconfig/ParameterMappingAction";
import ManageMenuForm from "../Admin/pages/Master/ManageMenuForm";
import ProfileForm from "../Admin/pages/ProfileStation/ProfileForm";
import StationForm from "../Admin/pages/ProfileStation/StationForm";
import StationImportForm from "../Admin/pages/ProfileStation/StationImportForm";
import StationImportHistrory from "../Admin/pages/ProfileStation/StationImportHistrory";
import UploadBackup from "../Admin/pages/Backups/UploadBackup";
import DataCompleteReport from "../Admin/pages/Reports/DataCompleteReport";
import DataQualityReport from "../Admin/pages/Reports/DataQualityReport";
import MissingDataReport from "../Admin/pages/Reports/MissingDataReport";
import Reports from "../Admin/pages/Reports/GeneralReports/Reports";
import MainContextProvider from "../Context/AdminContextProvider";
import UnitController from "../Admin/pages/Master/UnitController";
import UnitControllerAction from "../Admin/pages/Master/UnitControllerAction";
import DataQuality from "../Admin/pages/DataQuality";
import ManageStationAccess from "../Admin/pages/ProfileStation/ManageStationAccess";
import ParameterSensor from "../Admin/pages/Master/ParameterSensor";
import ParameterSensorAction from "../Admin/pages/Master/ParameterSensorAction";

export const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <MainContextProvider>
        <AdminLayout />
      </MainContextProvider>
    }
  >
    <Route index element={<Navigate to="master/manage-menu" />} />

    {/* master Routes */}
    <Route path="master">
      <Route path="manage-menu">
        <Route index element={<ManageMenu />} />
        <Route path=":action" element={<ManageMenuForm />} />
      </Route>
      <Route path="role-master">
        <Route index element={<RoleMaster />} />
        <Route path=":action" element={<RoleMasterAction />} />
      </Route>
      <Route path="manage-user">
        <Route index element={<ManageUser />} />
        <Route path=":action" element={<ManageUserActions />} />
      </Route>
      <Route path="role-matrix" element={<RoleMatrix />} />
      <Route path="client-config">
        <Route index element={<ClientConfig />} />
        <Route path=":action" element={<ClientConfigActions />} />
      </Route>
      <Route path="manage-unit">
        <Route index element={<UnitController />} />
        <Route path=":action" element={<UnitControllerAction />} />
      </Route>
      <Route path="parameter-in-sensor">
        <Route index element={<ParameterSensor />} />
        <Route path=":action" element={<ParameterSensorAction />} />
      </Route>
    </Route>

    {/* sensorparameter-configuration Routes */}
    <Route path="sensor-parameter-configuration">
      <Route path="manage-sensor">
        <Route index element={<ManageSensor />} />
        <Route path=":action" element={<ManageSensorAction />} />
      </Route>

      <Route path="sensor-parameter-mapping">
        <Route index element={<SensorParameterMapping />} />
        <Route path=":action" element={<ParameterMappingAction />} />
      </Route>
    </Route>

    {/* profile & station Routes */}
    <Route path="profile-station">
      <Route path="manage-profile">
        <Route index element={<ManageProfile />} />
        <Route path=":action" element={<ProfileForm />} />
      </Route>

      <Route path="manage-station">
        <Route index element={<ManageStation />} />
        <Route path=":action" element={<StationForm />} />
        <Route path="import-station" element={<StationImportForm />} />
        <Route
          path="import-station/history"
          element={<StationImportHistrory />}
        />
      </Route>
      <Route path="manage-station-access" element={<ManageStationAccess />} />
    </Route>

    {/* Report Routes */}
    <Route path="report">
      <Route path="general-report" element={<Reports />} />
      <Route path="data-completness-report" element={<DataCompleteReport />} />
      <Route path="data-quality-report" element={<DataQualityReport />} />
      <Route path="data-missing-report" element={<MissingDataReport />} />
    </Route>

    {/* Backup Routes */}
    <Route path="mange-backup">
      <Route path="upload-backup" element={<UploadBackup />} />
    </Route>

    <Route path="data-quality">
      <Route path="data-quality" element={<DataQuality />} />
    </Route>
  </Route>
);

/* Notification & Alert Routes */

/* <Route path="/notification-alert">
            <Route path="manage-notifications">
              <Route index element={<ManageNotifications />} />
              <Route path=":action" element={<NotificationsAlertForm />} />
            </Route>

            <Route path="manage-banners" element={<ManageBannersAds />} />
          </Route> */

/* Help & Support Routes */

/* <Route path="/help-support">
            <Route path="faq-manual" element={<FaqManuals />} />
            <Route path="customer-support" element={<CustomerSuport />} />
          </Route> */
