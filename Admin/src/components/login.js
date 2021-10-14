import React, { Component } from 'react';
import axios from 'axios';
import config from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

import 'react-toastify/dist/ReactToastify.css';
const headers = {
   'Content-Type': 'application/json'
};

export default class login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }

        this.onChange = this.onChange.bind(this);
  
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {


    }

    onChange(e) {

        this.setState({
           [e.target.name]: e.target.value
        })
     }
  
     //================================================  Login API integrate  =============
  
     async submitForm(e) {
        e.preventDefault()
        const data = this.state
        axios.post(`${config.apiUrl}/adminlogin`, data, { headers })
           .then(response => {
  
  
              if (response.data.success === true) {
                 toast.success('Login Successfully!', {
                    position: toast.POSITION.TOP_CENTER, 
                 });
                 Cookies.set('loginSuccessInfinityAdmin', response.data);
                 window.location.href = `${config.baseUrl}dashboard`
              }
  
              else if (response.data.success === false) {
                 toast.error(response.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                 });
  
  
              }
           })
  
           .catch(err => {   
                        
              toast.error(err.response.data?.msg, {
                 position: toast.POSITION.TOP_CENTER
              });
  
           })
     }
  


    render() {

        return (
          

                <div className="wrapper pa-0">
                 
                    <header className="sp-header">
                        {/* <div className="sp-logo-wrap pull-left"> */}
                        <div className="brand-be">
                            <a href={`${config.baseUrl}`}>
                                {/* <img className="brand-img mr-10" src="images/logo-new.png" alt="brand" style={{height:"30px",width:"30px"}} /> */}
                                
                                <span className="brand-text" style={{fontSize: "35px", color: 'white'}}>Vulnerary</span>
                            </a>
                        </div>
                        {/* <div className="form-group mb-0 pull-right">
                            <span className="inline-block pr-10">Don't have an account?</span>
                            <a className="inline-block btn btn-info btn-success btn-rounded btn-outline" href="signup.html">Sign Up</a>
                        </div> */}
                        <div className="clearfix"></div>
                    </header>

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper pa-0 ma-0 auth-page">
                        <div className="container-fluid">
                            {/* <!-- Row --> */}
                            <div className="table-struct full-width full-height">
                                <div className="table-cell vertical-align-middle auth-form-wrap">
                                    <div className="auth-form  ml-auto mr-auto no-float">
                                        <div className="row">
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="mb-30">
                                                    <h3 className="text-center txt-dark mb-10">Sign in to Vulnerary</h3>
                                                    <h6 className="text-center nonecase-font txt-grey">Enter your details below</h6>
                                                </div>
                                                <div className="form-wrap">
                                                    <form onSubmit={this.submitForm}>
            <ToastContainer />

                                                        <div className="form-group">
                                                            <label className="control-label mb-10" for="exampleInputEmail_2">Email address</label>
                                                            <input type="email" className="form-control" required="" value={this.state.email}
                           onChange={this.onChange} name="email" id="exampleInputEmail_2" placeholder="Enter email" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="pull-left control-label mb-10" for="exampleInputpwd_2">Password</label>
                                                            <div className="clearfix"></div>
                                                            <input type="password" className="form-control" required="" id="exampleInputpwd_2" value={this.state.password}
                           onChange={this.onChange} name="password" placeholder="Enter Password" />
                                                        </div>

                                                        <div className="form-group text-center">
                                                            <button type="submit" className="btn btn-info btn-primary btn-rounded">sign in</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /Row -->	 */}
                        </div>

                    </div>
                    {/* <!-- /Main Content --> */}

                </div>
        )

    }
}