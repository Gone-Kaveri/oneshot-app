import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Routes } from 'react-router-dom';
import Login from './App';
import CalendarComponent from './home';

function Route1() {
    return (
      <Router>
        {/* <Switch> */}
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/book-slot" element={<CalendarComponent/>} />
          {/* <Redirect from="/" to="/login" /> */}
        {/* </Switch> */}
        </Routes>
      </Router>
    );
  }
  
export default Route1;