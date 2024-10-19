import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SignUp from './SignUp';
import SignIn from './SignIn';
import './Navbar.css';

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
            <nav>
                <div>                    
                    <ul>
                        <button onClick={openSignUp}>SignUp</button>

                        <SignUp isOpen={isSignUpOpen} onClose={closeSignUp}>
                            <h2>SignUp</h2>
                            
                            ID: <input type="text" onChange={(e) => { setId(e.target.value) }} /> <br /> <br />
                            Email: <input type="email" onChange={(e) => { setEmail(e.target.value) }} /> <br /> <br />           
                            Password: <input type="password" onChange={(e) => { setPassword(e.target.value) }} /> <br /> <br /> <br />
                            Name: <input type="text" onChange={(e) => { setName(e.target.value) }} /> <br /> <br />
                            Age (in years): <input type="number" step="0.1" onChange={(e) => { setAge(e.target.value) }} /> <br /> <br />
                            Gender: <input list="gender" onChange={(e) => { setGender(e.target.value) }} />
                                <datalist id="gender">                    
                                    <option value="Female" />
                                    <option value="Male" />
                                    <option value="Other" />
                                </datalist> <br /> <br />                            

                            <button onClick={
                                fetch("http://127.0.0.1:8080/signup", {
                                    method: "POST",
                                    body: JSON.stringify({
                                        id: id,
                                        email: email,
                                        password: password,
                                        name: name,
                                        gender: gender,
                                        age: age                                    
                                    }),
                                    headers: {
                                        "content-type": "application/json"
                                    }
                                })
                                    .then(async function(res) {
                                        const exerciseList = await res.json();                      
                                        navigate("/dashboard", { state: { id, email, password, name, age, gender } });
                                    })
                            }>Submit</button>
                        </SignUp>        

                        <button onClick={openSignIn}>SignIn</button>

                        <SignIn isOpen={isSignInOpen} onClose={closeSignIn}>
                            <h2>SignIn</h2>
                            
                            ID: <input type="text" onChange={(e) => { setId(e.target.value) }} /> <br /> <br />
                            Email: <input type="email" onChange={(e) => { setEmail(e.target.value) }} /> <br /> <br />           
                            Password: <input type="password" onChange={(e) => { setPassword(e.target.value) }} /> <br /> <br /> <br />

                            <button onClick={
                                fetch("http://127.0.0.1:8080/signin", {
                                    method: "POST",
                                    body: JSON.stringify({
                                        id: id,
                                        email: email,
                                        password: password                      
                                    }),
                                    headers: {
                                        "content-type": "application/json"
                                    }
                                })
                                    .then(async function(res) {
                                        const exerciseList = await res.json();                      
                                        navigate("/dashboard", { state: { id, email, password } });
                                    })
                            }>Submit</button>
                        </SignIn>       
                    </ul>       
                </div>
            </nav>
        </>
    );
}

export default Navbar;

