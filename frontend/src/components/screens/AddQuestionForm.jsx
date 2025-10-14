import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Grid,
    Card,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import api from "../../api.js";
import Navbar from "../Navbar.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddQuestionForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [constraints, setConstraints] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [sampleOutput, setSampleOutput] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthAndAdmin = async () => {
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

                if(response.data.user.role !== "admin") {
                    navigate("/");
                    return;
                }

                setIsAuthenticated(true);
                setIsAdmin(response.data.user.role === "admin");
            } catch (error) {
                console.error("Authentication check failed:", error);
                navigate("/login");
            }
        };

        checkAuthAndAdmin();
    }, [navigate]);

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: "", output: "" }]);
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !isAdmin) {
            alert("You are not authorized to add a question.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/addProblem",
                {
                    title,
                    description,
                    inputFormat,
                    outputFormat,
                    constraints,
                    sampleInput,
                    sampleOutput,
                    difficulty,
                    testCases,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Problem added successfully!");
            navigate("/problemset");
        } catch (error) {
            toast.error("Failed to add problem, please try again!");
            console.error("Failed to add problem:", error);
        }
    };


  return (
  <div style={{ backgroundColor: "#ffffffff", minHeight: "100vh" }}> {/* Dark background */}
    <Navbar />
    <Container className="mt-8">
      <Card elevation={3} className="p-6" style={{ backgroundColor: "#E6D8C3" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{
            fontFamily: 'Roboto Slab, serif',
            fontWeight: 'bold',
            color: "#000000ff", // Light color for title
          }}
        >
          Add New Question
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/** TextFields with light foreground */}
            {[
              { label: "Title", value: title, setter: setTitle },
              { label: "Description", value: description, setter: setDescription, multiline: true },
              { label: "Input Format", value: inputFormat, setter: setInputFormat, multiline: true },
              { label: "Output Format", value: outputFormat, setter: setOutputFormat, multiline: true },
              { label: "Constraints", value: constraints, setter: setConstraints, multiline: true },
              { label: "Sample Input", value: sampleInput, setter: setSampleInput, multiline: true },
              { label: "Sample Output", value: sampleOutput, setter: setSampleOutput, multiline: true },
            ].map((field, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  multiline={field.multiline || false}
                  rows={field.multiline ? 4 : 1}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  InputProps={{
                    style: { 
                      backgroundColor: "#F5F5F0", // Light color in front
                      color: "#000" // text inside inputs
                    },
                  }}
                />
              </Grid>
            ))}

            {/** Difficulty Selector */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  label="Difficulty"
                  style={{ backgroundColor: "#F5F5F0", color: "#000" }} // light in front
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/** Test Cases */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom style={{ color: "#F5F5F0" }}>
                Test Cases
              </Typography>
              {testCases.map((testCase, index) => (
                <Grid container spacing={2} key={index} className="mb-4">
                  <Grid item xs={6}>
                    <TextField
                      label="Input"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                      InputProps={{ style: { backgroundColor: "#F5F5F0", color: "#000" } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Output"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                      InputProps={{ style: { backgroundColor: "#F5F5F0", color: "#000" } }}
                    />
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="contained"
                onClick={handleAddTestCase}
                style={{
                  marginRight: 10,
                  backgroundColor: "#d32f2f", // red button
                  color: "#fff",
                }}
              >
                Add Test Case
              </Button>
            </Grid>

            {/** Submit Button */}
            <Grid item xs={12} className="flex justify-center mt-4">
              <Button
                variant="contained"
                type="submit"
                style={{
                  backgroundColor: "#1976d2", // blue button
                  color: "#fff",
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  </div>
);


};

export default AddQuestionForm;
