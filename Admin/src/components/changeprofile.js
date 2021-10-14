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


export default class changeprofile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            profile_pic : '',
            image_file: null,
			image_preview: '',
        }

         this.loginData = (!Cookies.get('loginSuccessInfinityAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
         this.getUserProfilePicAPI = this.getUserProfilePicAPI.bind(this)
         this.updateProfilePicAPI = this.updateProfilePicAPI.bind(this)
        
    }

    componentDidMount() {
        if(!Cookies.get('loginSuccessInfinityAdmin')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
          }

    
   async getUserProfilePicAPI() {
    await axios({
        method: 'post',
        url: `${config.apiUrl}/adminprofilepic`,
    //	headers: { "Authorization": this.loginData.message },
  data:{'email':this.loginData.data.user_email}
    })
  .then(response => {
        if (response.data.success === true) {
            this.setState({
                profile_pic: response.data.response
            })
      
  }
})
}

   
async updateProfilePicAPI(e) {
     
    e.preventDefault()
    const formData = new FormData();
      formData.append('profile_pic', this.state.image_file);
      formData.append('email', this.loginData.data.user_email);

    await axios({
       method: 'post', 
       url: `${config.apiUrl}/updateprofilepic`,
       data:formData
    })
       .then(result => {
          console.log('result',result);
           if (result.data.success === true) {
             
             toast.success(result.data.msg, {
                position: toast.POSITION.TOP_CENTER
                });
        this.getUserProfilePicAPI()
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
     this.getUserProfilePicAPI();
}

    
  handleImagePreview = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    // if (image_as_files.type.indexOf('image') === 0) {
    //    file_type = 'image';
    // } else {
    //    file_type = 'video';
    // }
 
    this.setState({
       image_preview: image_as_base64,
       image_file: image_as_files,
    })

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

                    <div className="page-wrapper">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Change Profile Pic</h5>
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
                                                    <form action="#">
                                                        {/* <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>about Category</h6> */}
                                                        <hr className="light-grey-hr" />
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Change Profile Pic</label>
                                                                    <input type="file" accept="image/x-png,image/gif,image/jpeg" id="firstName" onChange={this.handleImagePreview} name="profile" className="form-control"   />
                                                                </div>
                                                            
                                                            
                                                             <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10"></label>
                                                                    <button type="submit" onClick={this.updateProfilePicAPI} className="btn btn-primary">Change Profile</button>
                                                               </div> 
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
                                                    </form>
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

