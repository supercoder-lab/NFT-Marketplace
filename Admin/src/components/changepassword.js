import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from  'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
const headers = {
   'Content-Type': 'application/json'
};


export default class changePassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentPassword:'',
            password : '',
            password2 :''
        }

         this.loginData = (!Cookies.get('loginSuccessInfinityAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
         this.changePasswordAPI = this.changePasswordAPI.bind(this);

    }

    componentDidMount() {
        if(!Cookies.get('loginSuccessInfinityAdmin')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
          }

    
   
  handleChange = e =>{

    this.setState({
        [e.target.name] : e.target.value
     })
 }

 async changePasswordAPI(e) {
       
           e.preventDefault()
    await axios({
       method: 'post', 
       url: `${config.apiUrl}adminpassword`,
       data:{"email":this.loginData.data.user_email,"currentPassword":this.state.currentPassword,"password":this.state.password,"password2":this.state.password2}
    })
    //
       .then(result => {
          console.log('result',result);
           if (result.data.success === true) {
             
             toast.success(result.data.msg, {
                position: toast.POSITION.TOP_CENTER
                });
                window.location.href = `${config.baseUrl}dashboard`
         } 
           else if (result.data.success === false) {
             toast.error(result.data.msg, {
                position: toast.POSITION.TOP_CENTER
                });
         }

        }).catch(err => {
       console.log(err);
       
    });
 }


componentDidMount() {
    if(!Cookies.get('loginSuccessInfinityAdmin')){
        window.location.href = `${config.baseUrl}`
        return false;
     }
}

    render() {

        return (

            <>

                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <ToastContainer/>
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Change Password</h5>
                                </div>

                            </div>
                            {/* <!-- /Title --> */}

                            {/* <!-- Row --> */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                            <div className="form-wrap">
                                                        {/* <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>about Category</h6> */}
                                                        <hr className="light-grey-hr" />
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Old Password</label>
                                                                    <input type="password" id="firstName" onChange={this.handleChange} name="currentPassword" className="form-control" placeholder="Old Password"  value={this.state.currentPassword} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">New Password</label>
                                                                    <input type="password" id="firstName" onChange={this.handleChange} name="password" className="form-control" placeholder="New Password"  value={this.state.password} />
                                                                </div>
                                                            </div> <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Re-Type Password</label>
                                                                    <input type="password" id="firstName" onChange={this.handleChange} name="password2" className="form-control" placeholder="RE-Type Password"  value={this.state.password2} />
                                                                </div>
                                                            </div>
                                                            </div>
                                                             <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10"></label>
                                                                    <button type="submit" onClick={this.changePasswordAPI} className="btn btn-primary">Change Password</button>
                                                                </div>
                                                            
                                                            {/* <!--/span--> */}
                                                        </div>
                                                        {/* <!-- Row --> */}
                                                        
                                                        {/* <!--/row--> */}
                                                       
                                                       
                                                        {/* <!--/row--> */}
                                                       
                                                                    <div className="form-actions">
                                                            {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}
                                                      
                
                                                            <div className="clearfix"></div>
                                                        </div>
                                                </div>
                                                <div className="form-wrap">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /Row --> */}
                                        </div>
                        {/* <!-- Footer --> */}
                        <Footer/>
                        {/* <!-- /Footer --> */}

                    </div>
                    {/* <!-- /Main Content --> */}

                </div>
            </>


        )

    }
}

