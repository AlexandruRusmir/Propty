import React, { useEffect, useState } from 'react';
import '../styles/colors.css';
import '../styles/style.css';
import Web3 from 'web3';
import propertyTitleBuild from 'contracts/PropertyTitle.json';
import { Navbar, NavDropdown, Nav, Container, Popover, OverlayTrigger, Toast, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar(props) {
    return (
        <Navbar bg="dark"  variant="dark" expand="lg" sticky="top">
            <Container>
                <Link to="/" className='navbar-brand'>Propty</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link to="/" className='nav-link'>Home</Link>
                    {
                        props.isAdmin === true?
                        <Link to="/handle-registrars" className='nav-link'>Handle Registrars</Link> :
                        ''
                    }
                    <Link to="/all-properties" className='nav-link'>All Properties</Link>
                    <Link to="/my-properties" className='nav-link'>My Properties</Link>
                    <OverlayTrigger
                        trigger="click"
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Popover id={'nav-popover'} className='popover-custom'>
                            <Popover.Header as="h3">Account Information</Popover.Header>
                                <Popover.Body>
                                    {
                                        props.account ?
                                            <div>
                                                <strong>Address:</strong> {props.account}<br/>
                                            </div> 
                                            :
                                            <strong>You are not connected to any account!</strong>
                                    }
                                </Popover.Body>
                            </Popover>
                        }
                        >
                        <Nav.Link>Account Details</Nav.Link>
                    </OverlayTrigger>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
	);
}

export default NavBar;