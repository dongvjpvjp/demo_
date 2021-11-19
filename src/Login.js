import React, { useState, useEffect, useContext } from 'react';

import { useNavigate } from 'react-router-dom'
import Context from './Context';
import axios from 'axios';




export default function Login() {

    const [logInput, setLogInput] = useState({});
    const [errSTT,setErrSTT] = useState(null);

    const navigate = useNavigate();
    const [state,setState] =  useContext(Context)
    const onChangeHandler = (e) => {
        setLogInput({ ...logInput,[e.target.name]: e.target.value });
    }
    const onClickHandler = async (e) => {
        e.preventDefault();
       const res = await axios.post(`http://20.119.48.31:8088/api/auth/login`,logInput)
    //    const res = await axios.post(`http://127.0.0.1:8000/api/auth/login`,logInput)
            if (!res) {
                alert("Tài khoản không tồn tại")
                setErrSTT(true);
            }
            else if (res?.data?.access_token) {
                setState({type:"isLogin"});
                setState({type:"UserInfo",payload:res?.data});
                navigate("/Home");
            }
        
    }
    
    useEffect(() => {
    if (state.isLogin) navigate("/Home")
    }, [state.isLogin])
    return (
        <div className="bg-default">
            {/* Main content */}
            <div className="main-content">
                {/* Header */}
                <div className="header bg-gradient-primary py-3 py-lg-4 pt-lg-5">
                    <div className="container">
                        <div className="header-body text-center mb-7">
                            <div className="row justify-content-center">
                                <div className="col-xl-5 col-lg-6 col-md-8 px-5">
                                    {
                                        errSTT ?   <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>Tài khoản của bạn không tồn tại</strong> 
                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=>{
                                     setErrSTT(false)}}>
                                        </button>
                                      </div>
                                      :null
                                    }
                                    
                                
                                    <h2 className="text-white">Welcome!</h2>
                                    <h4 className="text-lead text-white"> Hệ Thống Chăm Sóc Sức Khỏe </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="separator separator-bottom separator-skew zindex-100">
                        <svg x={0} y={0} viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <polygon className="fill-default" points="2560 0 2560 100 0 100" />
                        </svg>
                    </div>
                </div>
                {/* Page content */}
                <div className="container mt--5 pb-6 ">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7">
                            <div className="card bg-secondary border-0 mb-0">
                                <div className="card-body px-lg-5 py-lg-5">
                                    <div className="text-center text-muted mb-4">
                                        <small>Đăng nhập</small>
                                    </div>
                                    <form role="form">
                                        <div className="form-group mb-3">
                                            <div className="input-group input-group-merge input-group-alternative">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="ni ni-email-83" /></span>
                                                </div>
                                                <input className="form-control" name="username" placeholder="Tài Khoản" type onChange={(event) => onChangeHandler(event)} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="ni ni-lock-circle-open" /></span>
                                                </div>
                                                <input className="form-control" placeholder="Password" type="password" name="password" onChange={(event) => onChangeHandler(event)} />
                                            </div>
                                        </div>
                                        <div className="custom-control custom-control-alternative custom-checkbox">
                                            <input className="custom-control-input" id=" customCheckLogin" type="checkbox" />
                                            <label className="custom-control-label" htmlFor=" customCheckLogin">
                                                <span className="text-muted">Ghi nhớ</span>
                                            </label>
                                        </div>
                                        <div className="text-center ">
                                            {/* <button type="button" class="btn btn-primary my-4 " >Sign in</button> */}
                                            <button href="./dashboard.html" className="btn  btn-primary my-4" onClick={(event) => onClickHandler(event)}>Đăng nhập</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <a href="#" className="text-light"><small>Forgot password?</small></a>
                                </div>
                                <div className="col-6 text-right">
                                    <a href="#" className="text-light"><small>Create new account</small></a>
                                    {/* TODO: CAN XU LY */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="py-6" id="footer-main">
                <div className="container">
                    <div className="row align-items-center justify-content-xl-end">
                        <div className="col-xl-6">
                            <ul className="nav nav-footer justify-content-center justify-content-xl-end">
                                <li className="nav-item">
                                    <address className="nav-link" target="_blank">Trang chủ</address>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" target="_blank">Quảng cáo</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" target="_blank">Liên hệ</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
// Login Page => bootstrap
