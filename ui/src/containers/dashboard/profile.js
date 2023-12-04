import axios from 'axios';
import { Button, Box, Chip, Stack, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import './profile.css';
import { useParams } from 'react-router-dom';
import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from "../../context";
const Profile = () => {
    const { user } = useContext(UserContext);
    const currID = user.id;
    const { userId } = useParams();
    const [editedData, setEditedData] = useState({});
    const [entityType, setEntityType] = useState('');
    const [entityData, setEntityData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        specialization: '',
        height: '',
        weight: ''
    });
    useEffect(() => {
        console.log("userId", userId);
        fetchEntity(userId);
    }, []);

    useEffect(() => {
        setEditedData(entityData);
    }, [entityData]);
    
    const fetchEntity = async (userId) => {
        try {
            const response = await axios.get(`/api/v1/profile/${userId}`);
            setEntityType(response.data.type);
            setEntityData(response.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    

    const weight = entityData.weight;
    const height = entityData.height;
    const firstName = entityData.firstName;
    const lastName = entityData.lastName;
    const email = entityData.email;
    const specialization = entityData.specialization;
    const currExercisePlan = entityData.currentExercisePlan;
    //fetch currExercisePlan title by id
    

    const currExercisePlanTitle = entityData.title;    
      
    const handleSubscribe = async () => {
        try {
            const response = await axios.post(`/api/v1/subscribe/subscribe/${currID}/${userId}`);
            alert("subscribe success");
        }catch (err) {
            console.log(err);
        }   
    }

    return(
        <div className='user-card'>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        sx={{
                            padding: '8px 16px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: '#454545',
                            backgroundColor: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
                            fontSize: '15px',
                            borderRadius: '19px',
                            boxShadow: '12px 12px 24px #bebebe,-12px -12px 24px #ffffff',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                                boxShadow: '5px 5px 15px #bebebe,-5px -5px 15px #ffffff'
                            }
                    }}onClick={handleSubscribe}
                    >
                        Subscribe
                    </Button>
                </Box>
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