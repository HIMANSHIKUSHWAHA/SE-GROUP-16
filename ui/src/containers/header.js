import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";

export default function Header({ auth = false, navbarData, setActiveContent, activeContent }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // const handleNavbarMenu = (event) => {
    //     setMenuAnchorEl(event.currentTarget);
    // };

    const handleContentChange = (content) => {
        setActiveContent(content);
        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuAnchorEl(null);
    };

    const handleSettings = () => {
        navigate("/settings");
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} /> {/* Flexible space */}

                    <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                        FITFRIEND
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} /> {/* Flexible space */}
                    {auth && navbarData && navbarData.map((item, index) => (
                        <Button
                            key={item.content}
                            color="inherit"
                            onClick={() => handleContentChange(item.content)}
                            sx={{
                                mr: index === navbarData.length - 1 ? 2 : 0,
                                backgroundColor: activeContent === item.content ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
                            }}
                        >
                            {item.name}
                        </Button>
                    ))}



                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleSettings}>Settings</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
