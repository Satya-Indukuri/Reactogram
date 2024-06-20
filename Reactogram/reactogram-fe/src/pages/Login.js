import React, { useState } from 'react'
import "../pages/Login.css"
import socialDesktop from "../images/social-desktop.PNG"
import socialMobile from "../images/social-mobile.PNG"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import { API_BASE_URL } from '../config'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();

        setLoading(true);
        const requestData = { email, password }
        axios.post(`${API_BASE_URL}/login`, requestData)
            .then((result) => {
                if (result.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully Logged In'
                    })
                    localStorage.setItem("token", result.data.result.token);
                    localStorage.setItem("user", JSON.stringify(result.data.result.user));
                    dispatch({type: 'LOGIN_SUCCESS', payload: result.data.result.user});
                    setLoading(false);
                    navigate('/myprofile');
                }
                setEmail("");
                setPassword("");

            }).catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })

    }
    return (
        <>
            <div className="container login-container">
                <div className="row">
                    <div className="col-md-7 col-sm-12 d-flex justify-content-center align-items-center">
                        <img className='socialDesktop' style={{ height: '85%' }} src={socialDesktop} alt="app logo"></img>
                        <img className='socialMobile' src={socialMobile} alt="app logo"></img>
                    </div>
                    <div className="col-md-5 col-sm-12">
                        <div className="card shadow">
                            {loading ? <div className='col-md-12 mt-3 text-center'>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : ''}
                            <div className="card-body px-5">
                                <h4 className="card-title text-center mt-3 fw-bold">Log In</h4>
                                <form onSubmit={(e) => login(e)}>
                                    <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder="Phone number, username or email" />
                                    <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="p-2 mb-2 form-control input-bg" placeholder="Password" />
                                    <div className="mt-3 d-grid">
                                        <button type='submit' className="custom-btn custom-btn-blue">Log In</button>
                                    </div>
                                    <div className='mt-3'>
                                        <hr className='text-muted'></hr>
                                        <h5 className='text-muted text-center'>OR</h5>
                                        <hr className='text-muted'></hr>
                                    </div>
                                    <div className='mt-3 mb-5 d-grid'>
                                        <button className="custom-btn custom-btn-white">
                                            <span className='text-muted fs-9'>Don't have an account?</span>
                                            <Link to="/signup" className='ms-1 text-info fw-bold'>Sign Up</Link>
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;