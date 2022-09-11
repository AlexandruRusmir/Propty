import React, { useEffect, useState } from 'react';
import '../App.css';
import '../styles/Colors.css'
import Web3 from 'web3';
import propertyTitleBuild from 'contracts/PropertyTitle.json';
import { Navbar, NavDropdown, Nav, Container, Popover, OverlayTrigger, Toast, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar(props) {
    const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545');

    return (
        <Navbar bg="dark"  variant="dark" expand="lg" sticky="top">
            <Container>
                <Link to="/" className='navbar-brand'>Propty</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link to="/" className='nav-link'>Home</Link>
                    <Link to="/allproperties" className='nav-link'>All Properties</Link>
                    <Link to="/myproperties" className='nav-link'>My Properties</Link>
                    <OverlayTrigger
                        trigger="click"
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Popover id={'nav-popover'}>
                            <Popover.Header as="h3">Account Information</Popover.Header>
                                <Popover.Body>
                                    {
                                        props.account ?
                                            <div>
                                                <strong>{props.account}</strong><br/>
                                                <strong>Current balance: <i>{props.balance}</i> ETH </strong><br/>
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