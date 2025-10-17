import * as React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import CodeModal from "../CodeModal.jsx";
import CodeIcon from '@mui/icons-material/Code';
import api from "../../api.js";

const createData = (id, user, result, language, submissionDate, code) => ({
    id,
    user,
    result,
    language,
    submissionDate,
    code,
});

const SimpleTable = () => {
    const { id } = useParams();
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

                const problemRes = await api.get(`/problem/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                const fetchedProblem = problemRes.data.problem;
                setProblem(fetchedProblem);

                const rowsData = fetchedProblem.submissions.map((submission, index) =>
                    createData(
                        index,
                        submission.user,
                        submission.result,
                        submission.language,
                        submission.submissionDate,
                        submission.code
                    )
                );
                setRows(rowsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            <Navbar />
            <Box sx={{ width: "100%", minHeight: "100vh", p: 2, backgroundColor: "#f0f4f8" }}>
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
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ backgroundColor: row.result === "Accepted" ? "#c3e6cb" : "#f5c6cb" }}
                                >
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
                                                backgroundColor: "red",
                                                color: "white",
                                                padding: "5px",
                                                borderRadius: "10px",
                                                "&:hover": { backgroundColor: "darkred" },
                                            }}
                                        >
                                            <CodeIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <CodeModal open={open} handleClose={handleClose} code={currentCode} result={currentResult} />
        </div>
    );
};

export default SimpleTable;
