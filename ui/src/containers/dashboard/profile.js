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
    const [isClicked, setIsClicked] = useState(false);
    const [entityType, setEntityType] = useState('');
    const [entityData, setEntityData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        specialization: '',
        height: '',
        weight: '',
        subscriberList: [],
        subscribingList: [],
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
    let isAdmin = (entityType === 'Admin');

    const weight = entityData.weight;
    const height = entityData.height;
    const firstName = entityData.firstName;
    const lastName = entityData.lastName;
    const email = entityData.email;
    const specialization = entityData.specialization;
    let subscriberList = [];
    let subscribingList = [];
    subscriberList = entityData.Subscribers;
    subscribingList = entityData.Subscribing;
    const isSubscribed = false;
    
    if (subscribingList.includes(userId)) {
        setIsClicked(true);
    }

    const currExercisePlanTitle = entityData.title;    
      
    const handleSubscribe = async () => {
        await setIsClicked(true);
        try {
            const response = await axios.post(`/api/v1/subscribe/subscribe/${currID}/${userId}`);

        }catch (err) {
            console.log(err);
        }   
        await alert("subscribe success");
    }
    const handleBan = async () => {
        try {
            const response = await axios.post(`/api/v1/subscribe/ban/${userId}`);
            alert("ban success");
        }catch (err) {
            console.log(err);
        }   
    }


    return(
        <body className='bg'>
            <div sx={{
                overflowY: 'auto',
                height: '600px',
                position: 'absolute',
                borderColor: '#1976d2',
                borderRadius: '10px',
            }}>
                <div className='user-card'>
                    <Stack direction="row" spacing={25} alignItems="center" padding={3}>
                        <div >
                            <Avatar sx={{ width: 110, height: 110, spacing: 20} } />
                        </div>
                        <div sx={{ width: 110, height: 110, spacing: 20} }>
                        {(subscribingList)&&(<label >Subscribing {subscriberList.length}</label>)}
                        {(subscribingList)&&(<label >Subscribing {subscriberList.length}</label>)}
                        </div>
                        <div sx={{ direction:'row', display: 'flex', justifyContent: 'flex-end', alignItems:'right' }}>
                            <Button disableRipple 
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
                                    },
                                    '&:active': {
                                        backgroundColor: '#cacaca',
                                        boxShadow: 'inset 5px 5px 15px #cacaca, inset -5px -5px 15px #f6f6f6'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#cacaca',
                                        boxShadow: ' -5px -5px 15px #f6f6f6'
                                    }
                            
                                }}onClick={handleSubscribe}
                                disabled={isClicked}
                            >
                                Subscribe
                            </Button>
                            {isAdmin && (
                            <Button 
                                disableRipple 
                                sx={{
                                    // Similar styles as Subscribe button, or different as needed
                                    padding: '8px 16px',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    color: '#454545',
                                    backgroundColor: '#e68e8e',
                                    fontSize: '15px',
                                    borderRadius: '19px',
                                    boxShadow: '12px 12px 24px #bebebe,-12px -12px 24px #ffffff',
                                    '&:hover': {
                                        backgroundColor: '#e68e8e',
                                        boxShadow: '5px 5px 15px #bebebe,-5px -5px 15px #ffffff'
                                    },
                                    '&:active': {
                                        // Active styles
                                    },
                                }}
                                onClick={handleBan} disabled={isClicked}
                            >
                                Ban
                            </Button>
                        )}
                        </div>
                    </Stack>
                    <label className="title-typography">
                            {firstName} {lastName}
                        </label>
                    <Stack direction="column" spacing={4} alignItems="left">
                    
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

                    </Stack>
                </div>
            </div>
        </body>
    );
};

export default Profile;