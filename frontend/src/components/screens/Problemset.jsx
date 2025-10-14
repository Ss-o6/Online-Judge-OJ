import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import api from "../../api.js";
import Navbar from "../Navbar.jsx";

const Problems = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [submittedOnly, setSubmittedOnly] = useState(false);
  const [solvedIds, setSolvedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const userRes = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);
        const solved = userRes.data.problems.map((p) => p.id);
        setSolvedIds(solved);

        const problemsRes = await api.get("/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(problemsRes.data.problems);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) return <div className="text-center text-lg">Loading...</div>;

  const filteredProblems = problems.filter((p) => {
    const matchDifficulty = filterDifficulty === "All" || p.difficulty === filterDifficulty;
    const matchSubmitted = !submittedOnly || solvedIds.includes(p._id);
    return matchDifficulty && matchSubmitted;
  });

  return (
    <div>
      <Navbar />
      <Box sx={{ backgroundColor: "#F5F5F0", minHeight: "100vh", p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#5D866C" }}>
            Problems
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                label="Difficulty"
                sx={{ backgroundColor: "#E6D8C3" }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={submittedOnly}
                  onChange={(e) => setSubmittedOnly(e.target.checked)}
                  sx={{ color: "#C2A68C" }}
                />
              }
              label="My Submissions"
            />
          </Box>
        </Box>

        <TableContainer
          component={Card}
          sx={{ maxHeight: 500, overflowY: "auto", backgroundColor: "#E6D8C3" }}
        >
          <CardContent sx={{ p: 0 }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: "#C2A68C" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#000000" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#000000" }}>Difficulty</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#000000" }}>Solved</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProblems.map((problem) => {
                  const isSolved = solvedIds.includes(problem._id);
                  return (
                    <TableRow
                      key={problem._id}
                      hover
                      sx={{ backgroundColor: "#F5F5F0", cursor: "pointer" }}
                      onClick={() => navigate(`/problem/${problem._id}`)}
                    >
                      <TableCell sx={{ fontWeight: "bold", color: "#000000" }}>
                        {problem.title}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            problem.difficulty === "Easy"
                              ? "green"
                              : problem.difficulty === "Medium"
                              ? "orange"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {problem.difficulty}
                      </TableCell>
                      <TableCell>
                        {isSolved && <TaskAltIcon sx={{ color: "green" }} />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </TableContainer>

        {/* Add Problem Button at the bottom */}
        {user.role === "admin" && (
          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate("/addQuestion")}
              sx={{ backgroundColor: "#4969d4ff", color: "#fff", textTransform: "none" }}
            >
              Add Problem
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Problems;
