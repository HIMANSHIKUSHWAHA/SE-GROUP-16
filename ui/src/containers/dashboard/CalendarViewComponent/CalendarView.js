
// /* 
// BACKEND ENDPOINT IS - /api/v1/dashboard/calendar_data
// TODO Define get request body and headers if needed
// TODO Define how to load data in cards
// */


import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    CardContent,
    Typography,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { getReq } from '../../../services/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateWeekDates = (today) => {
    const currentDayIndex = today.getDay() || 7; // Make Sunday index 7
    return daysOfWeek.map((day, index) => {
        const difference = index + 1 - currentDayIndex;
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + difference);
        return {
            day,
            date: dayDate.getDate(),
            month: dayDate.getMonth() + 1,
        };
    });
};

//BASE CARD FOR EVENTS
const TaskCard = ({ title, content }) => (
    <Accordion sx={{ marginBottom: 2 }}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <CardContent>
                {content}
            </CardContent>
        </AccordionDetails>
    </Accordion>
);

//Cards for LIVE SESSIONS AND EVENTS
const LiveSessionCard = ({ sessions, date }) => (
    <TaskCard
        title="Live Sessions"
        content={
            sessions && sessions.length > 0 ? (
                <ul>
                    {sessions.map((session, index) => {
                        const sessionDate = new Date(session.date);
                        if (
                            sessionDate.getDate() === date.date &&
                            sessionDate.getMonth() + 1 === date.month
                        ) {
                            return (
                                <li key={index}>
                                    Title: {session.title} <br />
                                    Time: {session.startTime} <br />
                                    Duration: {session.duration} <br />
                                    Description: {session.description}
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            ) : (
                <Typography variant="body2">No Live Sessions</Typography>
            )
        }
    />
);

//FOR COLUMNS OF CALENDAR
const DayColumn = ({ day, date, month, isToday, dayData, event_list }) => {
    // console.log("YOYOYOOYOYOYOYOY ", day, date, month, isToday, dayData, event_list);

    // const todaysEvents = event_list.filter(event => {
    //     const eventDate = new Date(event.date);
    //     return eventDate.getDate() === date &&
    //         eventDate.getMonth() + 1 === month;
    // });

    return (
        <Grid
            item
            key={day}
            xs
            style={{
                minWidth: '150px',
                backgroundColor: isToday ? '#f8d7da' : 'transparent', // Highlight current day column
                borderRadius: '10px', // Optional: for rounded corners
                padding: '10px', // Some internal padding
            }}
        >
            <Typography
                variant="h6"
                align="center"
                style={{
                    backgroundColor: '#4a90e2', // Blue background
                    color: '#ffffff', // White text
                    padding: '10px', // Some padding
                    borderRadius: '5px', // Rounded corners
                    marginBottom: '20px', // Some space below the header
                }}
            >
                {day} <br /> {month}/{date}
            </Typography>
            <TaskCard
                title="Sleep"
                content={
                    <Typography variant="body2">
                        Start Time: {dayData?.sleep?.startTime || 'No Data'} <br />
                        End Time: {dayData?.sleep?.endTime || 'No Data'} <br />
                        Total Hours: {dayData?.sleep?.totalHours || 'No Data'}
                    </Typography>
                }
            />

            <TaskCard
                title="Meal Plan"
                content={
                    dayData?.mealPlan && dayData.mealPlan.length > 0 ? (
                        <ul>
                            {dayData.mealPlan.map((meal, index) => (
                                <li key={index}>
                                    Type: {meal.mealType} <br />
                                    Calories: {meal.calories} <br />
                                    Macronutrients: Protein {meal.macronutrients.protein}, Carbs {meal.macronutrients.carbs}, Fats {meal.macronutrients.fats}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography variant="body2">No Data</Typography>
                    )
                }
            />

            <TaskCard
                title="Workouts"
                content={
                    dayData?.workouts && dayData.workouts.length > 0 ? (
                        <ul>
                            {dayData.workouts.map((workout, index) => (
                                <li key={index}>
                                    Exercise: {workout.exercise} <br />
                                    Duration: {workout.duration} <br />
                                    Repetitions: {workout.repetitions}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography variant="body2">No Data</Typography>
                    )
                }
            />
            {/* <LiveSessionCard sessions={event_list} date={{ date, month }} /> */}
        </Grid>
    );
};

const WeeklyCalendar = () => {
    const today = new Date();
    const weekDates = generateWeekDates(today);
    const [calendarData, setCalendarData] = useState(null);
    const [liveSessions, setLiveSessions] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("UserId");
        // Define the request, if necessary
        const params = { userId: userId };
        const headers = {}
        getReq('/dashboard/calendar_data', headers, params)
            .then(response => {
                const weeklyData = response.data.data;
                setLiveSessions(response.data.event_list);
                const transformedData = weeklyData.reduce((acc, dayData) => {
                    acc[dayData.day.toLowerCase()] = dayData;
                    return acc;
                }, {});
                setCalendarData(transformedData); // Update the state with the transformed data

            })
            .catch(error => {
                console.error("There was an error fetching the calendar data!", error);
            });

    }, []);

    return (
        <Container style={{ backgroundColor: '#E0F7FA', padding: '40px', borderRadius: '10px', maxWidth: '90%' }}> {/* Light blue background */}
            {calendarData ? (
                <Grid container spacing={4} justifyContent="center" style={{ overflowX: 'auto' }}> {/* Increased spacing */}
                    {weekDates.map(({ day, date, month }, index) => (
                        <DayColumn
                            key={day}
                            day={day}
                            date={date}
                            month={month}
                            isToday={today.getDate() === date && today.getMonth() + 1 === month}
                            dayData={calendarData[day.toLowerCase()]}
                        // liveSessions={liveSessions}
                        />
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" align="center">Loading...</Typography> // Placeholder while data is being fetched
            )}
        </Container>
    );
};

export default WeeklyCalendar;
