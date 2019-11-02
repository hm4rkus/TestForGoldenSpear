import React, { useState } from 'react';
import { loginCall } from "./helpers/APIcalls"
import { Button, Form, Nav, Navbar } from 'react-bootstrap';





export default function LogIn() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false)

    async function onSubmit(event) {
        event.preventDefault();

            let response = await loginCall(email, password);
            if (response.success) {
                console.log(response);
                localStorage.setItem("userToken", JSON.stringify({ token: response.token, email: email, expiration: new Date().getTime() + 2 * 60 * 60 * 1000 }));
                window.location.href = "/messages"
            }
            else {
                setError(true);
            }

            console.log(response);
        }
    

    function handleStart() {
        let token = localStorage.getItem("userToken")
        if (token) {
            let tokenJson = JSON.parse(token);
            if (tokenJson.expiration > new Date().getTime())
                window.location.href = "/messages"

        }
    }


    handleStart();

    return (
        <div>
            <Navbar className="navbar-expand navbar-light bg-light sticky-top">
                <Navbar.Brand >Goldenspear</Navbar.Brand >
                <Nav className="mr-auto">
                    <Nav.Item className="active d-none d-sm-block">
                        <a className="nav-link" href="/login">Login</a>
                    </Nav.Item>
                    <Nav.Item className="d-none d-sm-block">
                        <a className="nav-link" href="/signup">Sign Up</a>
                    </Nav.Item>
                </Nav>
            </Navbar>

            <div className="pt-lg-4 mt-lg-4 mt-3 pt-3  text-center">
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="card col-12 col-sm-10 col-md-8 col-lg-6 p-0">
                        <div className="py-3 card-header" style={{ fontSize: 21 }}> Log in </div>
                        <div className="card-body text-left">
                            <Form onSubmit={(event) => onSubmit(event)}>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control required type="email" placeholder="Email" isInvalid={error} onChange={(event) => {
                                    setEmail(event.target.value);
                                }} />

                                <Form.Label className="pt-3">Password</Form.Label>
                                <Form.Control required type="password" placeholder="Password" isInvalid={error} onChange={(event) => {
                                    setPassword(event.target.value);
                                }} />
                                <div className="pt-3">Are you not registered?  <a href="/signUp">Click here to sign up!</a></div>

                                {error && <div className="pt-3" style={{ color: "red" }}>Incorrect email or password</div>}

                                <Button type="submit" className="mt-4 float-right">Login</Button>
                            </Form>
                        </div>

                    </div>

                </div>

            </div>
        </div>

    )

}