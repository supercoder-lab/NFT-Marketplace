import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
// import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

// const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // for local server
// const TEST_SITE_KEY = "6LfQoAUbAAAAAIkpWVT-CBEPJXL6iooHhyzrbMK1"    // client server
const TEST_SITE_KEY = "6Ld9j2MbAAAAAJhLqdlc13wLpDF3Dwg_PqHgG-eV"   //for esp

const headers = {
    'Content-Type': 'application/json'
 };

export default class register extends Component {

    constructor(props) {
        super(props)
        this.state={
          email : '',
          confirm_email : '',
          user_name : '',
          full_name : '',
          password : '',
          captcha_code:'',
          passwordIcon:'1',
          is_subscribed:'1',
          spinLoader:'0'
      };
      const { match:{params}}= this.props;
      this.token = params.token
    
    }

    handleChange1 = value => {
  
      this.setState({
          captcha_code:'1'
      })
    };

    handleChange = e =>{
      this.setState({
          [e.target.name] : e.target.value
       })
   }


   passwordEye(id){

    if(id == 1){
      id = 0
    }
    else if(id == 0){
      id = 1
    }
    this.setState({
      passwordIcon:id
    })
 }

    componentDidMount() {
      if(this.token ){
        this.verifyAccountAPI()
        }
    }


    async verifyAccountAPI() {
      axios.post(`${config.apiUrl}/verifyAccount/`+this.token, { headers })
      .then(result => {
          
          if(result.data.success === true ){
              toast.success(result.data.msg, {
              position: toast.POSITION.TOP_CENTER , 
              })
              setTimeout(() => {
              
              window.location.href = `${config.baseUrl}login`
              
              }, 3500);
          }
           if (result.data.success === false) {
              toast.error(result.data.msg, {
                  position: toast.POSITION.TOP_CENTER
                });
          }           
      })
      .catch(err => {
       // console.log(err);
        toast.error(err.response.data?.msg, {
          position: toast.POSITION.TOP_CENTER , 
          })
      });
      setTimeout(() => {
          window.location.href = `${config.baseUrl}login`
      }, 3500);
  }  
   
   
    handleSubmit = event =>{
      event.preventDefault();
      
      this.setState({
        spinLoader:'1'
      })
      const { full_name,user_name,email,confirm_email,password,is_subscribed } = this.state;
      if(this.state.captcha_code === ''){
        toast.error('Please fill captcha', {
          position: toast.POSITION.TOP_CENTER
          });
          this.setState({
            spinLoader:'0'
          })
      }
      else{
        axios.post(`${config.apiUrl}/register`,{full_name,user_name,email,confirm_email,password,is_subscribed})
        .then(result=>{
    if(result.data.success === true ){
     
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
            });
    setTimeout(() => {
    
    // window.location.reload()
    window.location.href = `${config.baseUrl}login`
    }, 2000);
     }
    }).catch(err=>{
    // console.log(err);
    this.setState({
      spinLoader:'0'
    })
    toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
    })
      }
      
       
  }

  clickChange(id){
    if(id === 0){
      this.setState({
        is_subscribed:'1'
      })
    }
    else if(id === 1){
      this.setState({
        is_subscribed:'0'
      })
    }
  }
  
    render() {
      const { user_name,full_name,email,confirm_email,password,is_subscribed} = this.state;
        return (    

            <>
             <Header/>
                <div id="content-block">
         <br/><br/>
        
         <div className="container-fluid custom-container">
           
            <div className="container-fluid custom-container pad-spc mt-5 mb-0" >
               <div className="container">
                  <div className="row">
                    <div className="limiter">
                    <div className="container-login100">
      <div className="">
        <form className="login100-form validate-form" autoComplete="on">
        <ToastContainer/>
          <div className="text-center mb-2">
        
        </div>
          <span className="login100-form-title p-b-20">
            Sign up for vulnerary
        
          </span>

          
          <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className={this.state.email ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"} type="email" name="email"autoComplete="off" onChange={this.handleChange}   value={email}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Email Address</span>
          </div>
          <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className={this.state.confirm_email ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"} type="email" name="confirm_email"autoComplete="off" onChange={this.handleChange}   value={confirm_email}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Confirm Email Address*</span>
          </div>
          
          
          <div className="wrap-input100 validate-input" data-validate="Username is required">
            <input className={this.state.user_name ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"} type="text" name="user_name" autoComplete="off" onChange={this.handleChange}  value={user_name}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Username</span>
          </div>
          <div className="wrap-input100 validate-input" data-validate="Your Name is required">
            <input className={this.state.full_name ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"} type="text" name="full_name" autoComplete="off" onChange={this.handleChange}  value={full_name}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Full Name</span>
          </div>
          <div className="wrap-input100 validate-input mb-3" data-validate="Password is required">
            <input className={this.state.password ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"}  type={this.state.passwordIcon == 1 ? 'password' : 'text'} id="password-field"  name="password" autoComplete="off" onChange={this.handleChange}  value={password} />
            <span className="focus-input100"></span>
            <span className="label-input100">Password</span>
            {this.state.passwordIcon == 1 ? 
            <span toggle="#password-field" onClick={this.passwordEye.bind(this,'1')} className="fa fa-fw fa-eye field-icon toggle-password"></span>
           : <span toggle="#password-field" onClick={this.passwordEye.bind(this,'0')} className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>}
          </div>
        
            <p className="text-white mb-3">Password must be at least 8 characters and contain 1 special character or number.</p>

          <div className="flex-sb-m w-full mt-0 p-b-32">
            <div className="contact100-form-checkbox pt-4">
              {this.state.is_subscribed === '1' 
              ? 
              <input className="input-checkbox100" id="ckb1" type="checkbox" checked onClick={this.clickChange.bind(this,1)} name="remember-me"/>
            :  <input className="input-checkbox100" id="ckb1" type="checkbox" onClick={this.clickChange.bind(this,0)} name="remember-me"/>
            
            }
              <label className="label-checkbox100" for="ckb1">
                Stay up to date with vulnerary

              </label>
            </div>
          </div>

          <div>
            <ReCAPTCHA
            style={{ display: "inline-block" }}
            theme="dark"
            ref={this._reCaptchaRef}
            sitekey={TEST_SITE_KEY}
            onChange={this.handleChange1}
            asyncScriptOnLoad={this.asyncScriptOnLoad}
          />
             {/* <a href="#" className="txt1"> </a> */}
            </div>
            <br/>
          <p className="text-white mb-3">By signing up, you agree to the <Link to={`${config.baseUrl}`} target="_blank">
            Terms and Conditions</Link> and &nbsp;
             <Link to={`${config.baseUrl}`} target="_blank">Privacy Policy</Link>.</p>
             <br/>
        <div className="container-login100-form-btn">
        {this.state.spinLoader === '0' ? 
         <button className="login100-form-btn" value="Sign up" onClick={this.handleSubmit}>Sign up</button>  :
          <button className="login100-form-btn" disabled>
          Loading<i class="fa fa-spinner fa-spin validat"></i>
        </button>
          }
         
          </div>

            <div className="p-t-10 p-b-32">
             <div>
             
              <Link style={{float:'right'}} to={`${config.baseUrl}login`}>
                Login
              </Link>
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