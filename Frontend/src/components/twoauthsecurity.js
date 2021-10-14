import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
 import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const headers = {
    'Content-Type': 'application/json'
 };

export default class twoauthsecurity extends Component {

    constructor(props) {
        super(props)
        this.state={
            SecretKey : '',
            enableTwoFactor  : "",
            user_id:''
      };
	    this.loginData = (!Cookies.get('loginSuccessAuth'))? [] : JSON.parse(Cookies.get('loginSuccessAuth'));
      this.twoAuthenticationVerifyAPI = this.twoAuthenticationVerifyAPI.bind(this)
      this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {

    }

    onChange = e =>{
        this.setState({
            [e.target.name] : e.target.value
         })
     }
//==================================  twoupdateAuthentication ========================

async twoAuthenticationVerifyAPI(e) {
    e.preventDefault()
	await axios({
		method: 'post',
		url: `${config.apiUrl}twoAuthenticationVerify `,
		headers: { "Authorization": this.loginData?.message },
		data: { "user_id":  this.loginData.data.id,'SecretKey':this.state.SecretKey,'enableTwoFactor':1 }
	}).then(response => {
		if (response.data.success === true) {
			toast.success('Login succesfull!', {
				position: toast.POSITION.TOP_CENTER
			 });
       
			 setTimeout(() => {
         
         window.location.href = `${config.baseUrl}`
         
        }, 2500);
        
      }
      Cookies.set('loginSuccess', this.loginData);          
	}).catch(err=>{
		toast.error('Token mismatch', {
		position: toast.POSITION.TOP_CENTER
		})
	})
	}

    render() {
  
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
        <form className="login100-form validate-form">
         {/*   <div className="text-center mb-2">
          <img src="images/logo-new.png" align="center" width="196px">
        </div>  */}
          <span className="login100-form-title p-b-20">
          Google Authentication <br/>
          <small style={{fontSize: "17px"}}>Please Type code to continue</small>
          </span>
         <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className={this.state.SecretKey ? "input100 has-val" : "input100"} type="text" name="SecretKey" onChange={this.onChange}
               value={this.state.SecretKey}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Secret Key</span>
          </div>
              

          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="submit" onClick={this.twoAuthenticationVerifyAPI} disabled={!this.state.SecretKey} >
              Submit
            </button>
          </div>
          <div className="flex-sb-m w-full p-t-3 p-b-32 mt-2">
          
             <a href={`${config.baseUrl}generatepassword`} className="txt1">
                Forgot Password?
              </a>
            <div>
              <div href="#" className="txt1 mt-2">
                Don't have an account? <a href={`${config.baseUrl}register`}>Sign up</a>
              </div>
            </div>
          </div>
          
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