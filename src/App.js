// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import CreateAccountPage from './CreateAccountPage';
import WelcomePage from './WelcomePage';
import UserPage from './UserPage';
import Reservations from './Reservations';
import ProfilePage from './ProfilePage';
import AdminPage from './AdminPage';
import AdminProfile from './AdminProfile';
import Sales from './Sales';
import SuperAdmin from './superadmin';
import EmployeeSelect from './EmployeeSelectionPage';
import FinalReservation from './FinalReservation';
import CreateAdmin from './CreateAdmin';
import ManageUsersEmployee from './ManageUsersEmployees';
import AdminTodayReservations from './AdminTodayReservations';
import ManageServices from './ManageServices';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/profilepage" element={<ProfilePage/>}/>
        <Route path="/adminsales" element={<Sales/>}/>
        <Route path='/adminprofile' element={<AdminProfile/>}/>
        <Route path='/adminpage' element={<AdminPage/>}/>
        <Route path='/superadmin' element={<SuperAdmin/>}/>
        <Route path='/employee-selection'element={<EmployeeSelect/>}/>
        <Route path='/final-reservation' element={<FinalReservation/>}/>
        <Route path='/create-admin' element={<CreateAdmin/>}/>
        <Route path='/manage-user-employee' element={<ManageUsersEmployee/>}/>
        <Route path='/admin-today-reservations' element={<AdminTodayReservations/>}/>
        <Route path='/manage-service' element={<ManageServices/>}/>
        

      </Routes>
    </Router>
  );
}

export default App;
