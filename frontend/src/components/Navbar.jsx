import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CodeIcon from "@mui/icons-material/Code";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto';
import '@fontsource/roboto-slab';

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState(null);

    const navigate = useNavigate();

    // Fetch user info (you can replace with your actual API)
    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/me");
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("token");
            navigate("/login");
            toast.success("Logout successful!");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#5D866C" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Desktop Logo */}
                    <CodeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: "white" }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "Roboto Slab, serif",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        AlgoHub
                    </Typography>

                    {/* Mobile Logo */}
                    <CodeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1, color: "white" }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "Roboto Slab, serif",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        AlgoHub
                    </Typography>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton
                            size="large"
                            aria-label="user menu"
                            aria-controls="menu-user"
                            aria-haspopup="true"
                            onClick={handleOpenUserMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id="menu-user"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {/* Username (disabled) */}
                            {/* Username (disabled) */}
<MenuItem disabled>
  <Typography textAlign="center">{user?.username || "User"}</Typography>
</MenuItem>


                            {/* User menu options */}
                            <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/updateProfile"); }}>
                                <Typography textAlign="center">Update Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/updateEmail"); }}>
                                <Typography textAlign="center">Update Email</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/changePassword"); }}>
                                <Typography textAlign="center">Change Password</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
