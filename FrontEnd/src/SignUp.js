import React, { useState } from 'react';
import { SignUpCall, signUpCall } from "./helpers/APIcalls"
import { Modal, Button, Form, Card, Nav, Navbar } from 'react-bootstrap';



export default function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setpasswordConfirm] = useState("");

    const [check, setCheck] = useState(false);
    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [success, setSuccess] = useState(false);

    function handleCheck() {
        if (check)
            setCheck(false);
        else setCheck(true);
    }

    async function handleRegister(event) {
        event.preventDefault()
        if (password != passwordConfirm)
            setPasswordError("The passwords do not match");

        else {
            let response = await signUpCall(email, password);
            if (response.success) {
                setSuccess(true);
            }
            else {
                setError("There is already an user with this email");

            }

        }
    }

    function handleClose() {
        window.location.href = "/login"
    }

    return (
        <div>
            <Navbar className="navbar-expand navbar-light bg-light sticky-top">
                <Navbar.Brand >Goldenspear</Navbar.Brand >
                <Nav className="mr-auto">
                    <Nav.Item className="d-none d-sm-block">
                        <a className="nav-link" href="/login">Login</a>
                    </Nav.Item>
                    <Nav.Item className=" d-none d-sm-block active">
                        <a className="nav-link" href="/signUp">Sign Up</a>
                    </Nav.Item>
                </Nav>
            </Navbar>


            <Modal show={success} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Succes!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Regsitered succesfully!</Modal.Body>
                <Modal.Footer>

                    <Button variant="primary" onClick={handleClose}>
                        OK!
          </Button>
                </Modal.Footer>
            </Modal>

            <div className="pt-lg-4 mt-lg-4 mt-3 pt-3 text-center">
                <div className="container d-flex flex-column justify-content-center align-items-center">

                    <Card className="col-12 col-sm-10 col-md-8 col-lg-6 p-0">
                        <Card.Header className="py-3" style={{ fontSize: 21 }}> Sign Up </Card.Header>
                        <Card.Body className="card-body text-left">
                            <Form onSubmit={(event) => handleRegister(event)}>
                                <Form.Label>Email address</Form.Label>

                                <div>
                                    <Form.Control isInvalid={error} type="email" class="is-invalid" placeholder="Email" onChange={(event) => {
                                        setEmail(event.target.value);
                                    }} required />
                                    <Form.Control.Feedback type="invalid">
                                        {error}
                                    </Form.Control.Feedback>
                                </div>


                                <Form.Label className="pt-3">Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" isInvalid={passwordError} onChange={(event) => {
                                    setPassword(event.target.value);
                                }} required />
                                
                                <Form.Label className="pt-3">Confirm your password</Form.Label>
                                <Form.Control type="password" placeholder="Password"isInvalid={passwordError} onChange={(event) => {
                                    setpasswordConfirm(event.target.value);
                                }} required />
                                <Form.Control.Feedback type="invalid">
                                        {passwordError}
                                    </Form.Control.Feedback>
                                <Form.Group className="pt-3" onClick={() => handleCheck()}>
                                    <Form.Check label="I agree to the terms and conditons" checked={check} onChange={() => handleCheck()} required />
                                    <div className="pt-3">Are you registered?  <a href="/signIn">Click here to log in!</a></div>

                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button type="submit" class="mt-4 float-right">Register</Button>
                                </div>
                            </Form>
                        </Card.Body>

                    </Card>
                </div>

            </div>

        </div>
    )

}