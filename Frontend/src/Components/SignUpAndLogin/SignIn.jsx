import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignIn({ isOpen, onClose }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    fetch("http://127.0.0.1:8080/signin", {
      method: "POST",
      body: JSON.stringify({
        user_id: id,
        user_email: email,
        user_password: password,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then(async (res) => {
      const userResponse = await res.json();
      if (userResponse.status === 200) {
        navigate("/dashboard", {
          state: {
            user: {
              user_id: id,
              user_email: email,
              user_password: password,
            },
          },
        });
      } else {
        alert("Failed to sign in. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
        <TextField
          label="ID"
          fullWidth
          margin="dense"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignIn}
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SignIn;
