import React, { useEffect, useState, useContext } from 'react';
import {
    Container, Grid, CardContent, Typography,
    Accordion, AccordionSummary, AccordionDetails, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getReq } from '../../../services/api';
import { UserContext } from '../../../context';
import { useNavigate } from 'react-router-dom';


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

const TaskCard = ({ session }) => {
    const navigate = useNavigate();
    const now = new Date();
    const startTime = new Date(session.date);
    const durationInMilliseconds = session.duration * 60000; // Convert duration from minutes to milliseconds
    const endTime = new Date(startTime.getTime() + durationInMilliseconds);
    const isJoinTime = now >= new Date(startTime.getTime() - 15 * 60000) && now <= endTime;

    const handleStartSession = () => {
        navigate('/meet'); // Navigates to the meet route when the button is clicked
    };

    return (
        <Accordion sx={{ marginBottom: 2 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h6">{session.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CardContent>
                    <Typography variant="body2">
                        {session.description} <br />
                        Date: {startTime.toLocaleString()} <br />
                        Tags: {session.tags.join(', ')}
                    </Typography>
                    {isJoinTime && (
                        <Button variant="contained" color="primary" onClick={handleStartSession}>
                            Start Session
                        </Button>
                    )}
                </CardContent>
            </AccordionDetails>
        </Accordion>
    );
};

const DayColumn = ({ day, date, month, isToday, events }) => {
    const sessionsForThisDay = events.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.getDate() === date && sessionDate.getMonth() + 1 === month;
    });

    return (
        <Grid
            item
            key={day}
            xs
            style={{
                minWidth: '150px',
                backgroundColor: isToday ? '#f8d7da' : 'transparent',
                borderRadius: '10px',
                padding: '10px',
            }}
        >
            <Typography
                variant="h6"
                align="center"
                style={{
                    backgroundColor: '#4a90e2',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                }}
            >
                {day} <br /> {month}/{date}
            </Typography>

            {sessionsForThisDay.length > 0 ? (
                sessionsForThisDay.map((session, index) => (
                    <TaskCard
                        key={index}
                        session={session}
                    />
                ))
            ) : (
                <Typography variant="body2">No Live Sessions</Typography>
            )}
        </Grid>
    );
};


const WeeklyCalendar = () => {
    const today = new Date();
    const weekDates = generateWeekDates(today);
    const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const params = { userId: user.id, role: user.role };
        getReq('/dashboard/calendar_data', {}, params)
            .then(response => {
                setEvents(response.data.events);
                console.log("LOGGING RESPONSE FROM BACKEND ", events);
            })
            .catch(error => {
                console.error("There was an error fetching the calendar data!", error);
            });
    }, [user.id, user.role]);

    return (
        <Container style={{ backgroundColor: '#E0F7FA', padding: '40px', borderRadius: '10px', maxWidth: '90%' }}>
            <Grid container spacing={4} justifyContent="center" style={{ overflowX: 'auto' }}>
                {weekDates.map(({ day, date, month }, index) => (
                    <DayColumn
                        key={day}
                        day={day}
                        date={date}
                        month={month}
                        isToday={today.getDate() === date && today.getMonth() + 1 === month}
                        events={events}
                    />
                ))}
            </Grid>
            {events.length === 0 && (
                <Typography variant="h6" align="center">No Events This Week</Typography>
            )}
        </Container>
    );
};

export default WeeklyCalendar;
