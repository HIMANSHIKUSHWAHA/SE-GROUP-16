import React, { useEffect, useState } from "react";
import { postReq } from "../../../services/api";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';



/* 
BACKEND ENDPOINT IS - /api/v1/dashboard/calendar_data
TODO Define post request body and headers if needed
TODO Define how to load data in cards
*/


const localizer = momentLocalizer(moment);

const CalendarView = ({ events }) => {

    const [calendarData, setCalendarData] = useState([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // useEffect(() => {
    //     //Define the body of your request, if necessary, like userID or dates
    //     const requestBody = {};
    //     const headers = {};

    //     postReq('/dashboard/calendar_data', headers, requestBody)
    //         .then(response => {
    //             setCalendarData(response); // Update the state with the fetched data
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the calendar data!", error);
    //         });
    // }, []); // The empty dependency array means this useEffect runs once when component mounts

    return (
        // <div className="calendar-view">
        //     <div className="week-container">
        //         {daysOfWeek.map((day, index) => (
        //             <div key={index} className="day-column">
        //                 <h3>{day}</h3>
        //                 <div className="card sleep-card">
        //                     <h4>Sleep</h4>
        //                     {/* Add sleep information here */}
        //                 </div>
        //                 <div className="card meal-card">
        //                     <h4>Meal Plan</h4>
        //                     {/* Add meal plan information here */}
        //                 </div>
        //                 <div className="card workout-card">
        //                     <h4>Workout</h4>
        //                     {/* Add workout information here */}
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div style={{ height: "500px" }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                defaultView='week'
                showMultiDayTimes={false} // Hide multi-day times
                formats={{
                    timeGutterFormat: (date, culture, localizer) => "" // Hide time in the time gutter
                }}
            />
        </div>
    );
};

export default CalendarView;