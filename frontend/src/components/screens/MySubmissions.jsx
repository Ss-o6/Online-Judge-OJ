import * as React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useParams, Link } from "react-router-dom";
import api from "../../api.js";
import Navbar from "../Navbar.jsx";
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

        // Get logged-in user info
        const userRes = await api.get("/me", { headers: { Authorization: `Bearer ${token}` } });
        const userId = userRes.data.user.id; // Logged-in user ID

        // Get problem with all submissions
        const res = await api.get(`/problem/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setProblem(res.data.problem);

        // Filter submissions to **only the current user**
        const mySubmissions = res.data.problem.submissions.filter(sub => {
          if (!sub.user) return false;
          // Handle if sub.user is a string ID or an object with _id
          return sub.user === userId || sub.user._id === userId;
        });

        setRows(mySubmissions);
      } catch (err) {
        console.error(err);
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
                    <TableCell>{row.user?.username || row.user?._id || row.user}</TableCell>
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
