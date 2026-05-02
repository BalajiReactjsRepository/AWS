// // routes/UserRoutes.jsx

// import { Route } from "react-router-dom";

// import UserLayout from "../Layouts/UserLayout";

// import UserContextProvider from "../Context/UserContextProvider";

// import Home from "../User/pages/Home/Home";

// import StationSummary from "../User/Modules/Station/StationSummary";
// import StationDetails from "../User/Modules/Station/StationDetails";
// import Reports from "../User/pages/Reports/Reports";
// import ProfileLayout from "../User/pages/ProfileLayout";
// import Profile from "../User/Modules/Profile/Profile";
// import FaqManulas from "../User/Modules/Profile/FaqManulas";
// import Appereance from "../User/Modules/Profile/Appereance";

// import "../User/user.css";

// export const UserRoutes = (
//   <Route
//     element={
//       <UserContextProvider>
//         <UserLayout />
//       </UserContextProvider>
//     }
//   >
//     <Route path="/" element={<Home />} />
//     <Route path="/station">
//       <Route path="summary" element={<StationSummary />} />
//       <Route path="details" element={<StationDetails />} />
//     </Route>
//     <Route path="/reports" element={<Reports />} />
//     <Route path="/profile" element={<ProfileLayout />}>
//       <Route index element={<Profile />} />
//       <Route path="faq-manuals" element={<FaqManulas />} />
//       <Route path="appearance" element={<Appereance />} />
//     </Route>
//   </Route>
// );

// UserRoutes.jsx
import { Route } from "react-router-dom";
import UserContextProvider from "../Context/UserContextProvider";

import UserLayout from "../Layouts/UserLayout";
import Home from "../User/pages/Home/Home";

import StationSummary from "../User/Modules/Station/StationSummary";
import StationDetails from "../User/Modules/Station/StationDetails";
import Reports from "../User/pages/Reports/Reports";
import ProfileLayout from "../User/pages/ProfileLayout";
import Profile from "../User/Modules/Profile/Profile";
import FaqManulas from "../User/Modules/Profile/FaqManulas";
import Appereance from "../User/Modules/Profile/Appereance";

export const UserRoutes = (
  <Route
    element={
      <UserContextProvider>
        <UserLayout />
      </UserContextProvider>
    }
  >
    <Route index element={<Home />} />

    <Route path='/station'>
      <Route path='summary' element={<StationSummary />} />
      <Route path='details' element={<StationDetails />} />
    </Route>

    <Route path='/reports' element={<Reports />} />

    <Route path='/profile' element={<ProfileLayout />}>
      <Route index element={<Profile />} />
      <Route path='faq-manuals' element={<FaqManulas />} />
      <Route path='appearance' element={<Appereance />} />
    </Route>
  </Route>
);
