import React, { useState } from "react";
import Header from "./header";
import FilterSearchSection from "./searchbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';


// Secondary Navbar Component
const SecondaryNavbar = () => (
  <div className="SecondaryNavbar">
    <button>
      <div className="icon-container">
        <FontAwesomeIcon icon={faVideo} size="1x" />
        <div>Workout Videos</div>
      </div>
    </button>
    <button>
      <div className="icon-container">
        <FontAwesomeIcon icon={faRunning} size="1x" />
        <div>Workout Programs</div>
      </div>
    </button>
    <button>
      <div className="icon-container">
        <FontAwesomeIcon icon={faUtensils} size="1x" />
        <div>Meal Plans</div>
      </div>
    </button>
    <button>
      <div className="icon-container">
        <FontAwesomeIcon icon={faDumbbell} size="1x" />
        <div>Custom Workouts</div>
      </div>
    </button>
    <button>
      <div className="icon-container">
        <FontAwesomeIcon icon={faCalendarCheck} size="1x" />
        <div>Routines</div>
      </div>
    </button>
  </div>
);

// Content Area Component
const ContentArea = () => (
  <div className="ContentArea">
    {/* Placeholder for workout video cards */}
    <p>Workout Video Cards will be displayed here</p>
  </div>
);

// Dashboard Component
const Dashboard = () => (
  <div>
    <Header />
    <FilterSearchSection />
    <SecondaryNavbar />
    <ContentArea />
  </div>
);

export default Dashboard;