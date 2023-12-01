import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context';
import { Typography, Box, Card, CardContent, Chip, Stack, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import './profile.css';
const Profile = () => {
    const navigate = useNavigate();
    const [entityData, setEntityData] = useState({});
    const [editedData, setEditedData] = useState({});
    const [entityType, setEntityType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(UserContext)

    const fetchContent = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`/api/v1/searchContent/${id}`);
            setEntityType(response.data.type);
            setEntityData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        // const userId = localStorage.getItem("UserId");
        const userId = user.id;
        if (userId) {
            fetchEntity(userId);
        }
    }, []);


    const weight = entityData.weight;
    const height = entityData.height;
    const firstName = entityData.firstName;
    const lastName = entityData.lastName;
    const email = entityData.email;
    const specialization = entityData.specialization;
    const currExercisePlan = entityData.currentExercisePlan;
    //fetch currExercisePlan title by id
    
    useState(() => {
        if (currExercisePlan) {
            fetchContent(currExercisePlan);
        }
    }, [entityData]);

    const currExercisePlanTitle = entityData.title;
   

    useEffect(() => {
        setEditedData(entityData);
    }, [entityData]);

    const fetchEntity = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`/api/v1/settings/entity/${id}`);
            setEntityType(response.data.type);
            setEntityData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };
    


    const handleLongTitle = (title) => {
        return title.length > 20 ? title.substring(0, 17) + '...' : title;
    };
    
      
    const PlanChip = styled(Chip)({
        marginRight: '8px',
        marginBottom: '8px',
        '&:last-child': {
          marginRight: 0
        }
    });
      
    const ScrollableBox = styled(Box)({
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
    });

    return(
        <div className='user-card'>
                <Stack direction="column" spacing={6} alignItems="center">
                <Avatar sx={{ width: 100, height: 100 }} />
                <label className="title-typography">
                    {firstName} {lastName}
                </label>
                <label className="subtitle-typography">
                    {email}
                </label>
                <label className="info-typography">
                    Specialization: {specialization}
                </label>
                <label className="info-typography">
                    Height: {height}
                </label>
                <label className="info-typography">
                    Weight: {weight}
                </label>

                <label variant="h6" mt={2} mb={1}>
                    Exercise Plans
                </label>
                <label className="info-typography">
                    {currExercisePlanTitle}
                </label>
                </Stack>
        </div>
    );
};

export default Profile;