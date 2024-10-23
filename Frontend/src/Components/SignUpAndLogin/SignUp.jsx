import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignUp({ isOpen, onClose }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://127.0.0.1:8080/signup", {
      method: "POST",
      body: JSON.stringify({
        user_id: id,
        user_email: email,
        user_password: password,
        user_name: name,
        user_gender: gender,
        user_age: age,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then(async (res) => {
      const userResponse = await res.json();
      if (userResponse.status === 201) {
        navigate("/dashboard", {
          state: {
            user: {
              user_id: id,
              user_email: email,
              user_password: password,
              user_name: name,
              user_gender: gender,
              user_age: age,
            },
          },
        });
      } else {
        alert("Failed to create user. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Sign Up</DialogTitle>
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
        <TextField
          label="Name"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Age"
          type="number"
          fullWidth
          margin="dense"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          label="Gender"
          select
          fullWidth
          margin="dense"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SignUp;
