
import * as React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import api from "../../api.js";
import CodeModal from "../CodeModal.jsx";

const SimpleTable = () => {
  const { id } = useParams();
  const [rows, setRows] = React.useState([]);
  const [problem, setProblem] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [currentCode, setCurrentCode] = React.useState("");
  const [currentResult, setCurrentResult] = React.useState("");

 React.useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch logged-in user info
      const userRes = await api.get("/me", { headers: { Authorization: `Bearer ${token}` } });
      const userId = userRes.data.user.id;

      // Fetch problem with all submissions
      const res = await api.get(`/problem/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProblem(res.data.problem);

      // Filter only submissions by logged-in user
      const userSubmissions = res.data.problem.submissions.filter((submission) => {
        // If submission.user is an object with _id
        if (submission.user && submission.user._id) {
          return submission.user._id.toString() === userId.toString();
        }
        // If submission.user is just an ID
        return submission.user.toString() === userId.toString();
      });

      setRows(userSubmissions);

    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  fetchData();
}, [id]);


  const handleOpen = (code, result) => {
    setCurrentCode(code);
    setCurrentResult(result);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Navbar />
      <Box sx={{ width: "100%", height: "100vh", p: 2, backgroundColor: "#f0f4f8" }}>
        <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader>
            <TableHead>
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
                   <TableCell>
  {row.user
    ? row.user.name || row.user.username || row.user
    : "Unknown User"}
</TableCell>

                    <TableCell>
                      <Link to={`/problem/${id}`} className="text-blue-500 hover:underline">
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
                          backgroundColor: 'red',
                          color: 'white',
                          padding: '5px',
                          borderRadius: '10px',
                          '&:hover': { backgroundColor: 'darkred' },
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
