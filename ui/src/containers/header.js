import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";

export default function Header({ auth = false, navbarData, setActiveContent }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const { user } = useContext(UserContext)
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNavbarMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

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
    const handleProfile = () => {
        navigate(`/profile/${user.id}`);
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        {auth && (
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={handleNavbarMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        FITFRIEND
                    </Typography>
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
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleSettings}>Settings</MenuItem>
                                <MenuItem onClick={handleLogout}>logout</MenuItem>
                            </Menu>
                            <Menu
                                id="secondary-navbar-menu"
                                anchorEl={menuAnchorEl}
                                open={Boolean(menuAnchorEl)}
                                onClose={handleClose}

                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >

                                {navbarData.map((item) => (
                                    <MenuItem key={item.content} onClick={() => handleContentChange(item.content)}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
