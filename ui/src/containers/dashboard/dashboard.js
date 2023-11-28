import React, { useState, useContext } from "react";
import Header from "../header";
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import CalendarView from "./CalendarViewComponent/CalendarView";
// import MediaCard from "./videoCards";
import SecondaryNavbar from "../secondaryNavbar";
import VideoSearch from "./VideoTab/videoSearchTab";
import { UserContext } from "../../context";

// Content Area Component
const ContentArea = ({ activeContent }) => (
  <div className="ContentArea">
    {activeContent === 'videos' && <VideoSearch />}
    {activeContent === 'routines' && <CalendarView />}
    {activeContent === 'workout-programs' && <p>workout programs data</p>}
    {activeContent === 'meal-plans' && <p>meal plans data</p>}
    {activeContent === 'custom-workouts' && <p>custom workouts data</p>}
  </div>
);

// Dashboard Component
const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('videos'); // Default content
  const { user } = useContext(UserContext);

  const navbarData = [
    {
      name: "Workout Videos",
      icon: faVideo,
      content: 'videos'
    },
    {
      name: "Workout Programs",
      icon: faRunning,
      content: 'workout-programs'
    },
    {
      name: "Meal Plans",
      icon: faUtensils,
      content: 'meal-plans'
    },
    {
      name: "Custom Workouts",
      icon: faDumbbell,
      content: 'workout-programs'
    },

  ]

  if (user && user.role === "user") {
    navbarData.push({
      name: "Routines",
      icon: faCalendarCheck,
      content: 'routines'
    });
  }

  return (
    <div>
      <Header auth={true} navbarData={navbarData} setActiveContent={setActiveContent} />
      <ContentArea activeContent={activeContent} />
    </div>
  );
};

export default Dashboard;