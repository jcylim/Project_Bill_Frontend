import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../auth';
import DefaultPost from '../img/logo.png';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#2ecc71"}
    } else return {color: "#ffffff"}
};

const Menu = ({history}) => (
    <div>
        <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
            <a href="/">
                <img 
                    src={`${DefaultPost}`}
                    alt="logo" 
                    style={{
                        width: '115px',
                        height: '46px',
                        overflow: 'hidden',
                    }}
                    className='img-fluid'
                />
            </a>
            <button
                className="navbar-toggler"
                type='button'
                data-toggle='collapse'
                data-target='#toggleMobileMenu'
                aria-controls='toggleMobileMenu'
                aria-expanded='false'
                aria-table='Toggle navigation'
            >
                <span className='navbar-toggler-icon'/>
            </button>
            <div className='collapse navbar-collapse' id='toggleMobileMenu'>
                <ul className='navbar-nav'>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/")} to="/">
                            Home
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/sellers")} to="/sellers">
                            Local Food Suppliers
                        </Link>
                    </li>

                    {/* <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, "/users")} to="/users">
                            Consumers
                        </Link>
                    </li> */}
                    
                    {!isAuthenticated() && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">
                                    Sign In
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}

                    {isAuthenticated() && isAuthenticated().user.type === "local food supplier" && (
                        <Link className="nav-link" to={'/post/create'} style={isActive(history, '/post/create')}>
                            Create New Post
                        </Link>
                    )}

                    {isAuthenticated() && (
                        <>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to={'/findpeople'} style={isActive(history, '/findpeople')}>
                                    Find People
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link className="nav-link" to={`/user/${isAuthenticated().user._id}`} style={isActive(history, `/user/${isAuthenticated().user._id}`)}>
                                    {`${isAuthenticated().user.first_name} ${isAuthenticated().user.last_name}'s Profile`}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" 
                                    style={(isActive(history, "/signout"), { cursor: "pointer", color: "#ffffff" })}
                                    onClick={() => signOut(() => history.push("/"))}>
                                    Sign Out
                                </span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    </div>
);

export default withRouter(Menu);