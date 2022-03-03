import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Avatar1 from '../../../../../assets/images/user/avatar.png';
import SYS from '../../../../../store/constant';

const NavRight = () => {
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        const details = localStorage.getItem('User');
        if (details) {
            setDisplayName(JSON.parse(details).displayName);
        }
    }, []);
    return (
        <>
            <ul className="navbar-nav ml-auto">
                <li>
                    <Dropdown className="drp-user">
                        <Dropdown.Toggle as="a" variant="link" id="dropdown-basic">
                            <img src={Avatar1} className="img-radius" alt="User Profile" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="profile-notification">
                            <div className="pro-head">
                                <img src={Avatar1} className="img-radius" alt="User Profile" />
                                <span>{displayName}</span>
                                <a href={SYS.BLANK_LINK} className="dud-logout" title="Logout">
                                    <i className="feather icon-log-out" />
                                </a>
                            </div>
                            <ul className="pro-body">
                                <li>
                                    <a href={SYS.BLANK_LINK} className="dropdown-item">
                                        <i className="feather icon-settings" /> Settings
                                    </a>
                                </li>
                                <li>
                                    <a href={SYS.BLANK_LINK} className="dropdown-item">
                                        <i className="feather icon-user" /> Profile
                                    </a>
                                </li>
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
        </>
    );
};

export default NavRight;
