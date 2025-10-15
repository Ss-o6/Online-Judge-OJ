import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Google as GoogleIcon, GitHub as GitHubIcon } from "@mui/icons-material";
import '@fontsource/roboto-slab';
import api from "../../api.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme();

const SignIn = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await api.get("/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    if(response.data.user) {
                        navigate("/");
                    }
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const userData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await api.post("/login", userData);
            const { token } = response.data;
            localStorage.setItem("token", token);
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        toast.error("Please enter all the information");
                        break;
                    case 401:
                        if (error.response.data === "User not found!") {
                            toast.error("User not found!");
                        } else if (error.response.data === "Password is incorrect") {
                            toast.error("Password is incorrect");
                        } else {
                            toast.error("Invalid email or password");
                        }
                        break;
                    case 500:
                        toast.error("An error occurred while logging in. Please try again.");
                        break;
                    default:
                        toast.error("Login failed. Please try again.");
                        break;
                }
            } else {
                toast.error("Login failed. Please try again.");
            }
            console.error("Login failed:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        window.location.href = "http://13.203.92.53:5000/auth/google";
    };

    const handleGitHubSignIn = () => {
        window.location.href = "http://13.203.92.53:5000/auth/github";
    };

    return (
       <ThemeProvider theme={defaultTheme}>
  <div
    style={{
      backgroundColor: '#F5F5F0', // off-white background
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px',
    }}
  >
    <Container
      component="main"
      maxWidth="xs"
      style={{
        backgroundColor: '#E6D8C3', // light beige container
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Roboto Slab, serif',
            fontWeight: 'bold',
            color: '#5D866C', // muted green heading
          }}
        >
          Welcome to Algohub
        </Typography>

        <Avatar sx={{ m: 1, bgcolor: '#C2A68C' }}> {/* warm brown avatar */}
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign in
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          {/* Forgot password just below password */}
          <Box sx={{ width: '100%', textAlign: 'right', mt: 0.5, mb: 2 }}>
            <Link href="/forgotPassword" variant="body2" sx={{ color: '#5D866C' }}>
              Forgot password?
            </Link>
          </Box>

          {/* Main Sign In Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 0,
              mb: 2,
              bgcolor: '#3D5AFE', // primary blue
              '&:hover': { bgcolor: '#304FFE' },
            }}
          >
            Sign In
          </Button>

          {/* Social Buttons stacked vertically */}
          <Grid container spacing={2} sx={{ mt: 1, flexDirection: 'column' }}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{
                  color: 'white',
                  backgroundColor: '#DB4437',
                  borderColor: '#DB4437',
                  '&:hover': {
                    backgroundColor: '#C1351D',
                    borderColor: '#C1351D',
                  },
                }}
              >
                Continue with Google
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={handleGitHubSignIn}
                sx={{
                  color: 'white',
                  backgroundColor: '#333',
                  borderColor: '#333',
                  '&:hover': {
                    backgroundColor: '#24292E',
                    borderColor: '#24292E',
                  },
                }}
              >
                Continue with GitHub
              </Button>
            </Grid>
          </Grid>

          {/* Register link just below */}
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item>
              <Link href="/register" variant="body2" sx={{ color: '#1d4c2eff' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </div>
</ThemeProvider>

    )
}

export default SignIn;
