import React, { useState } from "react";
import Header from "../header";
import FilterSearchSection from "../searchbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import CalendarView from "./CalendarViewComponent/CalendarView";
import MediaCard from "./videoCards";

// Secondary Navbar Component
const SecondaryNavbar = ({ setActiveContent }) => (
  <div className="SecondaryNavbar">
    <button onClick={() => setActiveContent('videos')}>
      <div className="icon-container">
        <FontAwesomeIcon icon={faVideo} size="1x" />
        <div>Workout Videos</div>
      </div>
    </button>
    <button onClick={() => setActiveContent('workout-programs')}>
      <div className="icon-container">
        <FontAwesomeIcon icon={faRunning} size="1x" />
        <div>Workout Programs</div>
      </div>
    </button>
    <button onClick={() => setActiveContent('meal-plans')}>
      <div className="icon-container">
        <FontAwesomeIcon icon={faUtensils} size="1x" />
        <div>Meal Plans</div>
      </div>
    </button>
    <button onClick={() => setActiveContent('custom-workouts')}>
      <div className="icon-container">
        <FontAwesomeIcon icon={faDumbbell} size="1x" />
        <div>Custom Workouts</div>
      </div>
    </button>
    <button onClick={() => setActiveContent('routines')}>
      <div className="icon-container">
        <FontAwesomeIcon icon={faCalendarCheck} size="1x" />
        <div>Routines</div>
      </div>
    </button>
  </div>
);

// Content Area Component
const ContentArea = ({ activeContent }) => (
  <div className="ContentArea">
    {activeContent === 'videos' && <MediaCard />}
    {activeContent === 'routines' && <CalendarView />}
    {activeContent === 'workout-programs' && <p>workout programs data</p>}
    {activeContent === 'meal-plans' && <p>meal plans data</p>}
    {activeContent === 'custom-workouts' && <p>custom workouts data</p>}
  </div>
);

// Dashboard Component
const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('videos'); // Default content
  return (
    <div>
      <Header auth={true} />
      <FilterSearchSection />
      <SecondaryNavbar setActiveContent={setActiveContent} />
      <ContentArea activeContent={activeContent} />
    </div>
  );
};

export default Dashboard;