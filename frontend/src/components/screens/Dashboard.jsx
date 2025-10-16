import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import Navbar from "../Navbar.jsx";
import { Container, Grid, Card, Typography, Box, Button } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [contestsParticipated, setContestsParticipated] = useState(0);

 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.user) {
        navigate("/login");
        return;
      }

      const userData = response.data.user;
      const solvedProblems = response.data.problems || [];

      // Create a map to count unique successful problems
      const uniqueSolvedMap = new Map();

      solvedProblems.forEach((p) => {
        const problemId = String(p.id); // normalize ID to string
        const isSuccess = p.status === "success" || p.testCasesPassed === p.totalTestCases;

        // Add only successful problems and avoid duplicates
        if (isSuccess && !uniqueSolvedMap.has(problemId)) {
          uniqueSolvedMap.set(problemId, p);
        }
      });

      setUser(userData);
      setIsAdmin(userData.role === "admin");
      setSolvedCount(uniqueSolvedMap.size); // unique successful problems
      setContestsParticipated(response.data.contests?.length || 0);

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      navigate("/login");
    }
  };

  fetchUserData();
}, [navigate]);


  if (!user) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <Box sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh", p: 2 }}>
        <Container maxWidth="md">
          {/* Welcome Card */}
          <Card
            sx={{
              backgroundColor: "#5D866C",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              p: 4,
              mb: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome
            </Typography>
            <Typography variant="h6" gutterBottom>
              Username: {user.username}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Email: {user.email}
            </Typography>

            {/* Small Stats Boxes */}
            <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    backgroundColor: "#8FBF9F",
                    color: "white",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2">Solved Problems</Typography>
                  <Typography variant="h5">{solvedCount}</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    backgroundColor: "#8FBF9F",
                    color: "white",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2">Contests Participated</Typography>
                  <Typography variant="h5">{contestsParticipated}</Typography>
                </Card>
              </Grid>
            </Grid>
          </Card>

          {/* Navigation Buttons */}
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#C2A68C",
                  color: "white",
                  p: 4,
                  fontSize: "1.2rem",
                  "&:hover": { backgroundColor: "#d69f5fff" },
                  borderRadius: 3,
                }}
                onClick={() => navigate("/problemset")}
              >
                Problems
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#C2A68C",
                  color: "white",
                  p: 4,
                  fontSize: "1.2rem",
                  "&:hover": { backgroundColor: "#d69f5fff" },
                  borderRadius: 3,
                }}
                onClick={() => navigate("/contests")}
              >
                Contests
              </Button>
            </Grid>
          </Grid>

          
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
