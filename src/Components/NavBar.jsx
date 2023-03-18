import React, { useEffect, useState } from 'react';
import '../styles/colors.css';
import '../styles/style.css';
import { Navbar, NavDropdown, Nav, Container, Popover, OverlayTrigger, Toast, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar(props) {
    const [activePage, setActivePage] = useState('');

    return (
        <Navbar bg="dark"  variant="dark" expand="lg" sticky="top">
            <Container>
                <Link to="/" className='navbar-brand' onClick={() => {setActivePage('')}}>Propty</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link to="/" className={'nav-link' + (activePage === '' ? ' active' : '')} onClick={() => {setActivePage('')}}>Home</Link>
                    {
                        props.isAdmin === true ?
                        <Link to="/handle-registrars" className={'nav-link' + (activePage === 'handle-registrars' ? ' active' : '')} onClick={() => {setActivePage('handle-registrars')}}>Handle Registrars</Link> :
                        ''
                    }
                    {
                        props.isRegistrar === true ?
                        <>
                            <Link to="/contract-requests" className={'nav-link' + (activePage === 'contract-requests' ? ' active' : '')} onClick={() => {setActivePage('contract-requests')}}>Contract Requests</Link>
                            <Link to="/deactivate-contracts" className={'nav-link' + (activePage === 'deactivate-contracts' ? ' active' : '')} onClick={() => {setActivePage('deactivate-contracts')}}>Deactivate Contracts</Link>
                        </>:
                        ''
                    }
                    <Link to="/all-properties" className={'nav-link' + (activePage === 'all-properties' ? ' active' : '')} onClick={() => {setActivePage('all-properties')}}>All Properties</Link>
                    <Link to="/my-properties" className={'nav-link' + (activePage === 'my-properties' ? ' active' : '')} onClick={() => {setActivePage('my-properties')}}>My Properties</Link>
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