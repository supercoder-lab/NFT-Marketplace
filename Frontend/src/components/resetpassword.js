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

export default class resetpassword extends Component {

    constructor(props) {
        super(props);
        this.state={
          password : '',
          password2 : '',
          passwordIcon:'1',
          passwordIcon1:'1'
      };
      const { match: { params } } = this.props;
    this.token = params.token 
    }

    componentDidMount() {

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

 passwordEye1(id){

  if(id == 1){
    id = 0
  }
  else if(id == 0){
    id = 1
  }
  this.setState({
    passwordIcon1:id
  })
}
    
  
    handleSubmit = event =>{
      event.preventDefault();
      const { password,password2 } = this.state;
      const data = this.state 

      axios.post(`${config.apiUrl}resetpassword`, {token:this.token,password:password,password2:password2}, { headers })
          .then(result=>{
          // alert(' ALL field');
          if(result.data.success === true ){
              toast.success(result.data.msg, {
                  position: toast.POSITION.TOP_CENTER
                  });
          setTimeout(() => {
          
         window.location.href = `${config.baseUrl}login`
          }, 2000);
          }
          else if (result.data.success === false) {
          toast.error(result.data.msg, {
          position: toast.POSITION.TOP_CENTER
          });
          
        
          }
          }).catch(err=>{
          toast.error(err.response.data?.msg, {
          position: toast.POSITION.TOP_CENTER
          })
          })
          }

    handleChange = e =>{
      this.setState({
          [e.target.name] : e.target.value
       })
   }
   
    render() {
        // const { email,password } = this.state;
        return (    

            <>

<div id="content-block">
<Header/>
<ToastContainer/>
         <br/><br/>
         
         <div className="container-fluid custom-container">
        <div className="container-fluid custom-container pad-spc mt-5 mb-0" >
               <div className="container">
               <div className="row">
              <div className="limiter">
           <div className="container-login100" style={{minHeight: "54vh"}}>
         <div className="">
        <form className="login100-form validate-form" onSubmit={this.handleSubmit}>
         {/*   <div className="text-center mb-2">
          <img src="images/logo-new.png" align="center" width="196px">
        </div>  */}
          <span className="login100-form-title p-b-20">
            Change Your Password  <br/>
          {/* <small style={{fontSize: "17px"}}></small> */}
          </span>
          <div className="wrap-input100 validate-input" data-validate="Password is required"  >
            <input className={this.state.password ? "input100 has-val" : "input100"} id="password-field"  type={this.state.passwordIcon == 1 ? 'password' : 'text'} name="password" onChange={this.handleChange} value={this.state.password}  />
            <span className="focus-input100"></span>
            <span className="label-input100">New Password</span>
            {this.state.passwordIcon == 1 ? 
            <span toggle="#password-field" onClick={this.passwordEye.bind(this,'1')} className="fa fa-fw fa-eye field-icon toggle-password"></span>
            :<span toggle="#password-field" onClick={this.passwordEye.bind(this,'0')} className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>}
          </div>
          <div className="wrap-input100 validate-input" data-validate="Password is required"  >
            <input className={this.state.password2 ? "input100 has-val" : "input100"} id="password-field"  type={this.state.passwordIcon1 == 1 ? 'password' : 'text'} name="password2" onChange={this.handleChange} value={this.state.password2}  />
            <span className="focus-input100"></span>
            <span className="label-input100">Re-Type New Password </span>
            {this.state.passwordIcon1 == 1 ? 
            <span toggle="#password-field" onClick={this.passwordEye1.bind(this,'1')} className="fa fa-fw fa-eye field-icon toggle-password"></span>
           : <span toggle="#password-field" onClick={this.passwordEye1.bind(this,'0')} className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>}
          </div>
          <label className="mt-0">Password must be at least 8 characters and contain 1 special character or number.</label>
          <br/>
           <div className="container-login100-form-btn">
           {!this.state.password || !this.state.password2 ?
           <button style={{cursor:"not-allowed"}} disabled className="login100-form-btn" type="submit" name="Request Resent Link" >Update Password</button>
           : <button className="login100-form-btn" type="submit"  name="Request Resent Link" >Update Password </button>}
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