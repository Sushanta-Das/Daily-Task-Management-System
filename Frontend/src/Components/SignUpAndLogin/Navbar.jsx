import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import "./Navbar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
} from "@mui/material";

const Navbar = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openSignUp = () => setIsSignUpOpen(true);
  const closeSignUp = () => setIsSignUpOpen(false);

  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <nav style={{ margin: "2vw" }}>
        <div>
          <ul style={{ display: "flex", gap: "2vw" }}>
            <Button variant="contained" color="success" onClick={openSignUp}>
              Sign Up
            </Button>
            <SignUp isOpen={isSignUpOpen} onClose={closeSignUp} />
            {/* <SignUp isOpen={isSignUpOpen} onClose={closeSignUp}>
              <h2>SignUp</h2>
              ID:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />{" "}
              <br /> <br />
              Email:{" "}
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />{" "}
              <br /> <br />
              Password:{" "}
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />{" "}
              <br /> <br /> <br />
              Name:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />{" "}
              <br /> <br />
              Age (in years):{" "}
              <input
                type="number"
                step="0.1"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />{" "}
              <br /> <br />
              Gender:{" "}
              <input
                list="gender"
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              />
              <datalist id="gender">
                <option value="Female" />
                <option value="Male" />
                <option value="Other" />
              </datalist>{" "}
              <br /> <br />
              <Button
                variant="contained"
                onClick={() => {
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
                  }).then(async function (res) {
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
                }}
              >
                Submit
              </Button>
            </SignUp> */}

            <Button variant="contained" onClick={openSignIn}>
              Sign In
            </Button>
            <SignIn isOpen={isSignInOpen} onClose={closeSignIn} />
            {/* <SignIn isOpen={isSignInOpen} onClose={closeSignIn}>
              <h2>SignIn</h2>
              ID:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />{" "}
              <br /> <br />
              Email:{" "}
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />{" "}
              <br /> <br />
              Password:{" "}
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />{" "}
              <br /> <br /> <br />
              <Button
                variant="contained"
                onClick={() => {
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
                  }).then(async function (res) {
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
                }}
              >
                Submit
              </Button>
            </SignIn> */}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
