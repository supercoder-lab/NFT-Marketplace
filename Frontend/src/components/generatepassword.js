import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import axios from 'axios';
import config from '../config/config'
import Cookies from 'js-cookie';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const headers = {
    'Content-Type': 'application/json'
};

export default class generatepassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
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

    async submitForm(e) {
        e.preventDefault()
        // this.setState(initialState)
        const { email } = this.state;
        const data = this.state
        axios.post(`${config.apiUrl}forgot`, data, { headers }, { email })
            .then(result => {
                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    setTimeout(() => {

                        window.location.href = `${config.baseUrl}login`
                    }, 2000);
                }
                // `${config.baseUrl}login`
                else if (result.data.success === false) {
                    toast.error(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })

            .catch(err => {
                if (err.request) { } if (err.response) {
                    toast.error(err.response.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            });
     
    }


    render() {
        // const { email,password } = this.state;
        return (

            <>
            <Header/>
            <ToastContainer />
           <div id="content-block">
         <br/><br/>
         
         <div className="container-fluid custom-container">
        <div className="container-fluid custom-container pad-spc mt-5 mb-0" >
               <div className="container">
               <div className="row">
              <div className="limiter">
           <div className="container-login100" style={{minHeight: "54vh"}}>
         <div className="">
        <form className="login100-form validate-form" onSubmit={this.submitForm}>
         {/*   <div className="text-center mb-2">
          <img src="images/logo-new.png" align="center" width="196px">
        </div>  */}
          <span className="login100-form-title p-b-20">
            Generate Your Password <br/><br/>
          <small style={{fontSize: "17px"}}><p>Enter your email address below. If we have it on file, we will send you a reset email.</p></small>
          </span>
         <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className={this.state.email ? "input100 has-val" : "input100"} type="email" name="email" onChange={this.onChange}   value={this.state.email}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Email</span>
          </div>
           <div className="container-login100-form-btn">
           {!this.state.email ?
           <button style={{cursor:"not-allowed"}}  disabled className="login100-form-btn" type="submit" name="Request Resent Link" >Request Resent Link</button>
           : <button className="login100-form-btn" type="submit"  name="Request Resent Link" >Request Resent Link </button>}
          </div>
          {/* <div className="flex-sb-m w-full p-t-3 p-b-32 mt-2">
          
            
             <div>
              <div href="#" className="txt1 mt-2">
                Don't have an account? <a href="#">Sign up</a>
              </div>
            </div> 
          </div> */}
          
    </form>
      </div>
    </div>
  </div>
         
  
               
                  </div>
               </div>
            </div>
            <br/>
         </div>
      </div>

      <Footer/>
            </>
        )
    }
}
