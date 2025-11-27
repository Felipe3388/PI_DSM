'use client';

import { Navbar, Container, Nav } from "react-bootstrap";

export default function Home() {    
    return (
        <Navbar className="bg-body-tertiary flex-col flex-1">
            <Container>
                <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#checkout">Checkout</Nav.Link>
                </Nav>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">Mark Otto</a>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}