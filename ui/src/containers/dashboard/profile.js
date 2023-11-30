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
    
    useEffect(() => {
        // const userId = localStorage.getItem("UserId");
        const userId = user.id;
        if (userId) {
            fetchEntity(userId);
        }
    }, []);

    useEffect(() => {
        setEditedData(entityData);
    }, [entityData]);

    const weight = entityData.weight;
    const height = entityData.height;
    const firstName = entityData.firstName;
    const lastName = entityData.lastName;
    const email = entityData.email;
    const specialization = entityData.specialization;
    const exercisePlans = new Array();
    

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
                    {entityData.firstName} {entityData.lastName}
                </label>
                <label className="subtitle-typography">
                    {entityData.email}
                </label>
                <label className="info-typography">
                    Specialization: {entityData.specialization}
                </label>
                <label className="info-typography">
                    Height: {entityData.height}
                </label>
                <label className="info-typography">
                    Weight: {entityData.weight}
                </label>

                <label variant="h6" mt={2} mb={1}>
                    Exercise Plans
                </label>
                <ScrollableBox className='scrollable-box'>
                    {exercisePlans.map((plan, index) => (
                        <PlanChip
                            key={index}
                            label={handleLongTitle(plan)}
                            variant="outlined"
                        />
                    ))}
                </ScrollableBox>
                </Stack>
        </div>
    );
};

export default Profile;