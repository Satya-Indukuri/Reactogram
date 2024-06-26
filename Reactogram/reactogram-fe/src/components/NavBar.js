import React from 'react'
import '../components/NavBar.css'
import logo from '../images/logo.PNG'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.userReducer); //taking th data from store to make sure user is still logged in
    console.log(user);

    const logout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({type: "LOGIN_ERROR"});
        navigate('/login');
    }
    return (
        <div>
            <nav className="navbar bg-light shadow-sm">
                <div className='container-fluid'>
                    <NavLink className="navbar-brand ms-5" to='/'>
                        <img alt="app logo" src={logo} height="45px"></img>
                    </NavLink>
                    <form className="d-flex me-md-5" role='search'>
                        <input className="form-control me-2 text-muted searchbox" type="search" placeholder="Search" />
                        <a className='a-tag nav-link text-dark fs-5 searchIcon' href='#'><i className="fa-solid fa-magnifying-glass"></i></a>
                        <NavLink className='a-tag nav-link text-dark fs-5' to='/posts'><i className="fa-solid fa-house"></i></NavLink>
                        {localStorage.getItem("token") ? <NavLink className='a-tag nav-link text-dark fs-5' href='#'><i className="fa-regular fa-heart"></i></NavLink> : ""}

                        <div className="dropdown">
                            {localStorage.getItem("token") ? <> <a className="btn " href="#" role="button" data-bs-toggle="dropdown">
                                <img className='navbar-profile-pic' alt='profile pic' src='https://plus.unsplash.com/premium_photo-1670596899123-c4c67735d77a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                            </a>

                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink className='a-tag dropdown-item mt-0' to='/myprofile'>My Profile</NavLink>
                                </li>
                                <li><a className="dropdown-item" href="#" onClick={()=>logout()}>
                                    Logout
                                </a></li>
                            </ul> </> : ''}
                        </div>

                        
                    </form>
                </div>
            </nav>
        </div>
    )
}


export default NavBar