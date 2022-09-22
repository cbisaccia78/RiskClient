import React, { useContext } from "react";
import Container from "react-bootstrap/Container"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { LinkContainer } from "react-router-bootstrap"
import ThemeContext from "../../store/theme-context";

export default function(){
    const themectx = useContext(ThemeContext)
    return (
        /*
        <nav style={{top: "100px", borderBottom: "solid 1px"}}>
            <Link to="/">Home</Link>
            <Link to="/games">Games</Link>
        </nav>
        */
       <Navbar bg={themectx.currentTheme} expand="lg">
            <Container>
                <Navbar.Brand href="#home">Risky</Navbar.Brand>
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
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
       </Navbar>
    )
}