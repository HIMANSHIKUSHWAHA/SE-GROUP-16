import axios from 'axios';
import { Typography,Button, Box, Chip, Stack, Avatar } from '@mui/material';
import './profile.css';
import { useParams} from 'react-router-dom';
import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from "../../context";
import Dialog from "@mui/material/Dialog";

const Profile = () => {
    const { user } = useContext(UserContext);
    const currID = user.id;
    const { userId } = useParams();
    const [editedData, setEditedData] = useState({});
    const [isClicked, setIsClicked] = useState(false);
    const [entityType, setEntityType] = useState('');
    const [entityData, setEntityData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [names, setNames] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const openModal = async (list, title) => {
        const namesList = await nameList(list); // Assuming nameList is your function to fetch names
        setNames(namesList);
        setModalTitle(title);
        setModalOpen(true);
    };

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

    const weight = entityData.weight?entityData.weight:'150';
    const height = entityData.height?entityData.height:'5\'10"';
    const firstName = entityData.firstName;
    const lastName = entityData.lastName;
    const email = entityData.email;
    const specialization = entityData.specialization;
    const subscriberList = entityData.Subscribers;
    const subscribingList = entityData.Subscribing;
    useEffect(() => {
        if (Array.isArray(subscribingList) && subscribingList.includes(userId)) {
            setIsClicked(true);
        }
    }, [subscribingList, userId]);
      
    const handleSubscribe = async () => {
        setIsClicked(true);
        try {
            const response = await axios.post(`/api/v1/subscribe/subscribe/${currID}/${userId}`);
            await alert("subscribe success");
        }catch (err) {
            console.log(err);
        }   
        
    }
    const handleBan = async () => {
        try {
            const response = await axios.post(`/api/v1/subscribe/ban/${userId}`);
            alert("ban success");
        }catch (err) {
            console.log(err);
        }   
    }

    const nameList = async (list) => { //list contains array of objectId
        let names = [];
        for (let i = 0; i < list.length; i++) {
            let currUser = await (await axios.get(`/api/v1/profile/${list[i]}`)).data.data;
            names.push({ fullName: currUser.firstName + " " + currUser.lastName, id: list[i] });
        }
        console.log("names", names);
        return names;
    }
    
    
    const Modal = ({ isOpen, close, names, title }) => {
    if (!isOpen) return null;
        //navigate(useLocation().pathname+`/${title}`);
        return (
            <div>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <label alignItems = "center">{title}</label>
                <ul className='info-typography'>
                    {names.map(({ fullName, id }) => (
                        <li className='info-typography'>
                            <label className='info-typography'>
                                {`${fullName}`}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="modal-overlay" onClick={close}>
            </div>
            
            </div>
            
        );
        
    };

      
            
    return(
        <>
        <body className='bg'>
            
            <div className='user-card'>
                <Stack direction="row" spacing={25} alignItems="center" padding={3}>
                    <div >
                        <Avatar sx={{ width: 110, height: 110, spacing: 20} } />
                    </div>

                    <div sx={{ width: 150, height: 110, spacing: 20} }>
                    {(subscribingList)&&(<label onClick={() => openModal(subscribingList, "Subscribing")}>
                                Subscribing  {subscribingList.length}
                                </label>)}
                            {(subscriberList)&&(<label onClick={() => openModal(subscriberList, "Subscribers")}>
                            Subscribers  {subscriberList.length}
                            </label>)}
                    </div>

                    <div sx={{ direction:'row', display: 'flex', justifyContent: 'flex-end',spacing:'3'}}>
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
                                    // Similar styles as Subscribe button
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
                <Stack direction="row" spacing={35} alignItems="center">
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
                    <div>
                        {modalOpen && (
                                <Modal 
                                    isOpen={modalOpen} 
                                    close={() => setModalOpen(false)} 
                                    names={names} 
                                    title={modalTitle}
                                />)}
                    </div>
                </Stack>
            </div>
        </body>
        
        </>
        
    );
};

export default Profile;