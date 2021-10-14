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

export default class login extends Component {

    constructor(props) {
        super(props)
        this.state={
          email : '',
          password : "",
          passwordIcon:'1',
          spinLoader:'0'
      };
    }

    componentDidMount() {

    }

    handleSubmit = event =>{
      event.preventDefault();
      this.setState({
        spinLoader:'1'
      })
      const { email,password } = this.state;
      const data = this.state 

          axios.post(`${config.apiUrl}login`, data,  {email,password})
          .then(result=>{
          // alert(' ALL field');
          if(result.data.success === true ){
        
          // setTimeout(() => {
          
          // window.location.href = `${config.baseUrl}`
          
          // }, 2500);
          if(result.data.data.enableTwoFactor === 0){
            setTimeout(() => {
              toast.success('Login Successfully!', {
                position: toast.POSITION.TOP_CENTER
                });  
          window.location.href = `${config.baseUrl}`
          Cookies.set('loginSuccess', result.data);          
          }, 2500);
          }
          else if(result.data.data.enableTwoFactor === 1){
            // toast.error('Firstly you have to enter google auth code!', {
            //   position: toast.POSITION.TOP_CENTER
            // });
            setTimeout(() => {
          
          window.location.href = `${config.baseUrl}googleauthentication`
          
          }, 2500);
          Cookies.set('loginSuccessAuth', result.data);     
          }

          
          }
          else if (result.data.success === false) {
            

            
            this.setState({
          email : '',
          password : '',
          spinLoader:'0'
        })
        
      }
          }).catch(err=>{
          toast.error(err.response?.data?.msg, {
          position: toast.POSITION.TOP_CENTER
          })
          this.setState({
            spinLoader:'0'
          })
          })
          }
          
          

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

    render() {
      const { email,password } = this.state;
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
        <form className="login100-form validate-form" autoComplete="on">
         {/*   <div className="text-center mb-2">
          <img src="images/logo-new.png" align="center" width="196px">
        </div>  */}
          <span className="login100-form-title p-b-20">
            Log in <br/>
          <small style={{fontSize: "17px"}}>Please login to continue</small>
          </span>
         <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className={this.state.email ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"} type="text" autoComplete="off" name="email" onChange={this.handleChange}   value={email}/>
            <span className="focus-input100"></span>
            <span className="label-input100">Email</span>
          </div>
          
          
          <div className="wrap-input100 validate-input" data-validate="Password is required"  >
            <input className={this.state.password ? "input100 no-autofill-bkg has-val" : "input100 no-autofill-bkg"} autoComplete="off" id="password-field" type={this.state.passwordIcon == 1 ? 'password' : 'text'} name="password"  onChange={this.handleChange} value={password}  />
            <span className="focus-input100"></span>
            <span className="label-input100">Password</span>
            {this.state.passwordIcon == 1 ? 
             <span onClick={this.passwordEye.bind(this,'1')} toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span>
            :
            <span onClick={this.passwordEye.bind(this,'0')} toggle="#password-field" className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>
            
            }
          </div>

      

          <div className="container-login100-form-btn">
            {this.state.spinLoader === '0' ? 
            <button className="login100-form-btn" type="submit" onClick={this.handleSubmit} disabled={!this.state.email || !this.state.password === ''} >
            Login
          </button>  :
          <button className="login100-form-btn" disabled>
          Loading<i class="fa fa-spinner fa-spin validat"></i>
        </button>
          }
          
            
          </div>
          <div className="flex-sb-m w-full p-t-3 p-b-32 mt-2">
          
             <Link to={`${config.baseUrl}generatepassword`} className="txt1">
                Forgot Password?
              </Link>
            <div>
              <div href="#" className="txt1 mt-2">
                Don't have an account? <Link to={`${config.baseUrl}register`}>Sign up</Link>
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