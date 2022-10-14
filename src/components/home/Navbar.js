import React, { useContext } from "react";
import Container from "react-bootstrap/Container"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { LinkContainer } from "react-router-bootstrap"
import ThemeContext from "../../store/theme-context";
import AuthContext from "../../store/auth-context";
import { DEVELOPMENT } from "../../config";

export default function(){
    const themectx = useContext(ThemeContext)
    const authctx = useContext(AuthContext)
    return (
        /*
        <nav style={{top: "100px", borderBottom: "solid 1px"}}>
            <Link to="/">Home</Link>
            <Link to="/games">Games</Link>
        </nav>
        */
       <Navbar bg={themectx.currentTheme} expand="lg">
            <Container>
                <Navbar.Brand href="#home">LiRisk</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/players">
                            <Nav.Link>Players</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/forum">
                            <Nav.Link>Forum</Nav.Link>
                        </LinkContainer>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        />
                        <Button variant="outline-primary">Search</Button>
                    </Form>
                    {authctx.isLoggedIn ? 
                    <>
                    {/*<img src={"data:image/png;base64,"+ btoa(new TextEncoder().encode(new Uint8Array(authctx.profilePicBuffer)))} />*/}
                    <Button variant="outline-primary" onClick={authctx.onProfileClick}>
                        Profile
                    </Button>
                    <Button variant="outline-danger" onClick={authctx.onLogout}>
                        Logout
                    </Button>
                    </> : 
                    <>
                    {DEVELOPMENT ? 
                    <Button variant="outline-primary" onClick={authctx.onDevLogin}>
                        Login
                    </Button> : 
                    <Button variant="outline-primary" onClick={authctx.onLoginClick}>
                        Login
                    </Button>
                    }
                    
                    <Button variant="outline-primary" onClick={authctx.onRegisterClick}>
                        Register
                    </Button>
                    </>
                    }
                    
                </Navbar.Collapse>
            </Container>
       </Navbar>
    )
}