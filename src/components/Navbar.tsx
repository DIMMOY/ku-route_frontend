import { Navbar, Dropdown} from "react-bootstrap";
import { useState } from 'react';
import logo from '../assets/icons/logo.png';
import user_icon from '../assets/icons/user-icon.png'
const NavBar = () => {
  let isLoggedin = 'loggedin';
  let userName = 'userName';

  return (
    <Navbar sticky='top' className="navbar navbar-expand-lg navbar-light bg-light py-3">
      <a className="navbar-brand mr-0" href="/">
        <img src={logo} className='pl-md-5 ml-lg-3' width='auto' height='40px' alt='logo' />
      </a>
      {isLoggedin === 'loggedin' ? (<>
        <Dropdown>
          <Dropdown.Toggle className="navbar-toggler" variant="success" id="dropdown-basic" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </Dropdown.Toggle>
          {/* In this part for menu in toggler button version */}
          <Dropdown.Menu>
            <Dropdown.Item href="#">BROWSE</Dropdown.Item>
            <Dropdown.Item href="/create-post">CREATE POST</Dropdown.Item>
            <Dropdown.Item href="#">EDIT PROFILE</Dropdown.Item>
            <div className="dropdown-divider"></div>
            <Dropdown.Item href="#">LOG OUT</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* This part for large screen menu navbar */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto pr-md-5 mr-lg-3">
            <li className="nav-item active">
              <a className="nav-link p-1 px-3" href="#" style={{ fontWeight: 'bold', color: '#2EAF7D' }}>BROWSE</a>
            </li>
            <li className="nav-item">
              <a className="nav-link p-1 px-3" href="/create-post">CREATE POST</a>
            </li>
            <Dropdown>
              <Dropdown.Toggle variant='success' className='bg-light' style={{ borderWidth: '0px', color: 'grey' }}>
                <img src={user_icon} className='mb-1 mr-1' width='25px' height='25px' alt='user-icon' /> {userName}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">EDIT PROFILE</Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item href="#">LOG OUT</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </div>
      </>)
        :
        (
          <>
            <Dropdown>
              <Dropdown.Toggle className="navbar-toggler" variant="success" id="dropdown-basic" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </Dropdown.Toggle>
              {/* In this part for menu in toggler button version */}
              <Dropdown.Menu>
                <Dropdown.Item href='/signin' className='p-1 px-3'>SIGN IN</Dropdown.Item>
                <Dropdown.Item href='/signup' className='p-1 px-3'>SIGN UP</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto pr-md-5 mr-lg-3">
                <li className="nav-item">
                  <a className="nav-link p-1 px-3" href="/signin">SIGN IN</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link p-1 px-3" style={{ border: '0.1px solid', borderRadius: '5px' }} href="/signup">SIGN UP</a>
                </li>
              </ul>
            </div>
          </>
        )
      }
    </Navbar>
  )
}
export default NavBar;