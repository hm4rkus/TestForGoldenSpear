import React, { useState, useEffect } from 'react';
import { getMessages, postMessage } from "./helpers/APIcalls"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import "./App.css"
import { Button, Form, Nav, Navbar, Card } from 'react-bootstrap';





export default function LogIn() {

    const [messages, setMessages] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [messagesIndex, setIndex] = useState("decrypted");
    const [encryptedCheck, setCheck] = useState(false);
    const [messageInput, setInput] = useState("");
    const [end, setEnd] = useState("");
    const[token, setToken] = useState("");
    const [userObject, setUserObject] = useState({loading: true, messages:[], token:""});

    useEffect(() => {
        if (end)
            end.scrollIntoView({ behavior: "smooth" });
    }, [userObject.messages, messageInput])


    async function handleStart() {
        let token = JSON.parse(localStorage.getItem("userToken"));
        let obj = {};
        if (token && token.expiration > new Date().getTime())
            obj.token = token;
        else
            window.location.href = "/"

        let response = await getMessages();
        if (response.success) {
            obj.messages = response.result;
        }
        obj.loading = false;
        setUserObject(obj);

    }

    function onLogOutClick() {
        localStorage.removeItem("userToken");
        window.location.href = "/"
    }

    function renderMessages() {
        console.log(userObject);

        if (userObject.loading) {
            return (
                <div className="d-flex justify-content-center align-items-center w-100 h-100">
                    <div className="spinner-border" role="status">
                    </div>
                </div>
            )
        }
        else if (userObject.messages.length != 0) {
            return userObject.messages.map((item) => {
                return (
                    <div className="row d-flex justify-content-center">
                        <div className="p-2 mt-3 text-left Message col-10 col-md-8">{item[messagesIndex]}</div>
                    </div>
                )
            })
        }
        else {
            return (
                <div className="text-center" style={{ color: "grey" }}>There are no messages </div>
            )
        }
    }

    async function sendMessage(event) {
        event.preventDefault();
        if (messageInput) {
            let response = await postMessage(messageInput);

            if (response.success) {
                setUserObject({messages: [...userObject.messages, response.result], loading : false, token: (userObject.token)});
                setInput("");
            }

        }
    }


    function handleCheck() {

        if (encryptedCheck) {
            setCheck(false);
            setIndex("decrypted");
        } else {
            setCheck(true);
            setIndex("encrypted")
        }
    }



    if (userObject.loading) {
        handleStart();
    }




    return (
        <div>

            <Navbar className="navbar-expand navbar-light bg-light sticky-top">
                <Navbar.Brand >Goldenspear</Navbar.Brand >
                <Nav className="mr-auto">
                    <Nav.Item className="d-none d-sm-block">
                        <a className="nav-link" href="/messages">Messages</a>
                    </Nav.Item>


                </Nav>
                <div className="px-4 d-none d-sm-block">Hey <b> {userObject.token && userObject.token.email.split("@")[0]}</b> !</div>  <div style={{ cursor: "pointer" }} onClick={() => { onLogOutClick() }}> <FontAwesomeIcon icon={faSignOutAlt} /> Log out</div>

            </Navbar>

            <h1 className="pt-md-4 pb-3 mb-2 text-center">Messages</h1>

            <div className="container">
                <Card className="card-default">

                    <Card.Body className="MessagesContainer">
                        {renderMessages()}
                        <div ref={(el) => { setEnd(el); }}></div>
                    </Card.Body>

                    <Card.Footer className="card-footer">
                        <Form className="d-flex flex-row align-items-center" onSubmit={(event) => { sendMessage(event) }}>
                            <Form.Control placeholder="Type something..." value={messageInput} onChange={(event) => {
                                setInput(event.target.value);
                            }} />
                            <Button type="submit" disabled={messageInput.length === 0} className="btn btn-primary float-right ml-5 ">Send</Button>
                        </Form>
                    </Card.Footer>

                </Card>
                <div className="pt-3" onClick={() => handleCheck()}>
                    <Form.Check type="checkbox" checked={encryptedCheck} label="Encrypted" onChange={(event) => {
                        handleCheck()
                    }} />
                </div>
            </div>

        </div>

    )

}