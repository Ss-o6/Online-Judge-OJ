import * as React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CodeIcon from '@mui/icons-material/Code';
import Navbar from "../Navbar.jsx";
import CodeModal from "../CodeModal.jsx";
import api from "../../api.js";

const SimpleTable = () => {
    const { id } = useParams();
    const [username, setUsername] = React.useState("");
    const [problem, setProblem] = React.useState({});
    const [rows, setRows] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [currentCode, setCurrentCode] = React.useState("");
    const [currentResult, setCurrentResult] = React.useState("");

    const handleOpen = (code, result) => {
        setCurrentCode(code);
        setCurrentResult(result);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const userRes = await api.get("/me", { headers: { Authorization: `Bearer ${token}` } });
                setUsername(userRes.data.user.username);

                const problemRes = await api.get(`/problem/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setProblem(problemRes.data.problem);

                const submissions = problemRes.data.problem.submissions || [];
                const mySubmissions = submissions.filter(sub => sub.user === userRes.data.user.username);

                setRows(mySubmissions);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            <Navbar />
            <Box sx={{ width: "100%", height: "100vh", p: 2, backgroundColor: "#f0f4f8" }}>
                <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
                    <Table stickyHeader>
                        <TableHead sx={{ backgroundColor: "#DFD0B8" }}>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Problem</TableCell>
                                <TableCell>Result</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>Submission Date</TableCell>
                                <TableCell>Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => {
                                const bgColor = row.result === "Accepted" ? "#c3e6cb" : "#f5c6cb";
                                return (
                                    <TableRow key={index} sx={{ backgroundColor: bgColor }}>
                                        <TableCell>{row.user}</TableCell>
                                        <TableCell>
                                            <Link to={`/problem/${id}`} style={{ color: "#393E46", textDecoration: "underline" }}>
                                                {problem.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{row.result}</TableCell>
                                        <TableCell>{row.language}</TableCell>
                                        <TableCell>{new Date(row.submissionDate).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleOpen(row.code, row.result)}
                                                sx={{
                                                    backgroundColor: "#222831",
                                                    color: "#DFD0B8",
                                                    padding: '5px',
                                                    borderRadius: '10px',
                                                    '&:hover': { backgroundColor: "#393E46" },
                                                }}
                                            >
                                                <CodeIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <CodeModal open={open} handleClose={handleClose} code={currentCode} result={currentResult} />
        </div>
    );
};

export default SimpleTable;
