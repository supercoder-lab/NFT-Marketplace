import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';	

const headers = {
    'Content-Type': 'application/json'
 };

export default class authoredit extends Component {

constructor(props) {
	super(props)
	this.loginData = (!Cookies.get('loginSuccess'))? [] : JSON.parse(Cookies.get('loginSuccess'));
	
	this.state = {
		profileData:'',
		image_file: null,
		image_preview: '',
		image_file1: null,
		image_preview1: '',
		email : '',
		currentPassword : '',
		password : '',
		password2 : '',
		twoAuthenticationData:'',
		enableTwoFactor:'',
		talentStatusAPIData:''

	}
	this.onChange = this.handleChange.bind(this);
	this.submitForm = this.submitForm.bind(this)
	this.onChange = this.handleChangePassword.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this)
	this.onChange= this.handleTwoWay.bind(this)
	this.twoAuthenticationVerifyAPI = this.twoAuthenticationVerifyAPI.bind(this)
}

componentDidMount() {
	this.getProfilePicAPI();
	this.twoAuthenticationAPI()
	this.talentStatusAPI()
	
}

async talentStatusAPI(){
	await axios({
	   method: 'post',
	   url: `${config.apiUrl}getTelentStatus`,
	   data: {'user_id':this.loginData.data.id}
	})
	   .then(result => {
		if (result.data.success === true) {
			   this.setState({
				  talentStatusAPIData:result.data.response[0]
			   })
		}
		else if (result.data.success === false) {
		}
	   }).catch(err => {
	   });
	}
//============================  Password change  ====================================
handleChangePassword = e => {
	// alert('3')
	this.setState({
	   [e.target.name]: e.target.value
	})
	
	
 }

handleChange = event => {
	event.preventDefault()
	let value = event.target.value;  
	this.setState(prevState => ({
		profileData: { ...prevState.profileData, [event.target.name]: value }
	}))
}

handleTwoWay = event => {
	event.preventDefault()
	if (event.target.checked === true && event.target.type === 'checkbox') {
		event.target.value = '1'
	}
	else if (event.target.checked === false && event.target.type === 'checkbox') {
		event.target.value = '0'
	}
	let value = event.target.value;  
	this.setState(prevState => ({
		twoAuthenticationData: { ...prevState.twoAuthenticationData, [event.target.name]: value }
	}))
	
}


loading(id){
	if(id == '1'){
		window.location.href = `${config.baseUrl}authoredit`
	}
	else if(id == '2'){
		window.location.href = `${config.baseUrl}about`
	}
	else if(id == '3'){
		window.location.href = `${config.baseUrl}salehistory`
	}
	else if(id == '4'){
		window.location.href = `${config.baseUrl}yourpurchase`
	}
	else if(id == '5'){
		window.location.href = `${config.baseUrl}paymentsetting`
	}
	else if(id == '6'){
		window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`
	}
	else if (id == '7') {
		window.location.href = `${config.baseUrl}royalty`
	 }
}

async getProfilePicAPI() {
await axios({
	method: 'post',
	url: `${config.apiUrl}getProfilePic`,
	headers: { "Authorization": this.loginData.Token },
	data: { "email":  this.loginData.data.user_email }
}).then(response => {
	if (response.data.success === true) {
		this.setState({	
			profileData: response.data.response
			})
	}
})
}

//================================================  Update information API integrate  =============
handleImagePreviewAvatar = (e) => {
let image_as_base64 = URL.createObjectURL(e.target.files[0])
let image_as_files = e.target.files[0];   
this.setState({
	image_preview: image_as_base64,
	image_file: image_as_files,
})   
}

//================================================  Update information API integrate  =============
handleImagePreviewBanner = (e) => {
let image_as_base64 = URL.createObjectURL(e.target.files[0])
let image_as_files = e.target.files[0];  
this.setState({
	image_preview1: image_as_base64,
	image_file1: image_as_files,
})  
}

async submitForm(e) {
e.preventDefault()
let formData = new FormData();
formData.append('email', this.state.profileData.email);
formData.append('profile_pic', this.state.image_file);
formData.append('banner', this.state.image_file1);
formData.append('user_name', this.state.profileData.user_name);

axios({
	method: 'post',
	url: `${config.apiUrl}updateProfilePic`,
	headers: { "Authorization": this.loginData.Token },
	data: formData
})
	.then(response => {
		if (response.data.success === true) {
			toast.success(response.data.msg, {
			position: toast.POSITION.TOP_CENTER
			});
			this.getProfilePicAPI()
			setTimeout(() => {
				window.location.reload()
			}, 1000);
		}

		else if (response.data.success === false) {
			toast.error(response.data.msg, {
			position: toast.POSITION.TOP_CENTER
			});
		}
	})

	.catch(err => {
		toast.error(err?.response?.data?.msg, {
			position: toast.POSITION.TOP_CENTER
		});

	})
}

//================================================= Update password ========================

handleSubmit(e) {
	e.preventDefault();
	axios({
		method: 'post',
		url: `${config.apiUrl}changepassword`,
		headers: { "Authorization": this.loginData.Token },
		data: { email: this.state.profileData.email, currentPassword: this.state.currentPassword,
			password: this.state.password, password2: this.state.password2 }
	})
	   .then(result => {

		  if (result.data.success === true) {
			 toast.success(result.data.msg, {
				position: toast.POSITION.TOP_CENTER
			 });

		  }
		  else if (result.data.success === false) {
			 toast.error(result.data.msg, {
				position: toast.POSITION.TOP_CENTER
			 });
		  }
	   }).catch(err => {
		  toast.error(err.response.data?.msg, {
			 position: toast.POSITION.TOP_CENTER
		  })
	   })
}



async twoAuthenticationAPI() {
	await axios({
		method: 'post',
		url: `${config.apiUrl}getQR`,
		headers: { "Authorization": this.loginData?.Token },
		data: {"email":this.loginData.data.user_email, "user_id":  this.loginData.data.id }
	}).then(response => {
		if (response.data.success === true) {
			this.setState({	
				twoAuthenticationData: response.data.response
				})
		}
	})
	}

//==================================  twoupdateAuthentication ========================

async twoAuthenticationVerifyAPI() {
	await axios({
		method: 'post',
		url: `${config.apiUrl}twoAuthenticationVerify `,
		headers: { "Authorization": this.loginData?.Token },
		data: {"email":this.loginData.data.user_email, "user_id":  this.loginData.data.id,'SecretKey':this.state.twoAuthenticationData.SecretKey,'enableTwoFactor':this.state.twoAuthenticationData.enableTwoFactor }
	}).then(response => {
		if (response.data.success === true) {
			toast.success('2FA Authentication has been enabled successfully!', {
				position: toast.POSITION.TOP_CENTER
			 });
			 window.location.reload()
		}
	}).catch(err=>{
		toast.error('Token mismatch', {
		position: toast.POSITION.TOP_CENTER
		})
	})
	}


	formatInput = (e) => {
		// Prevent characters that are not numbers ("e", ".", "+" & "-") 
		let checkIfNum;
		if (e.key !== undefined) {
		  // Check if it's a "e", ".", "+" or "-"
		  checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-" ;
		}
		else if (e.keyCode !== undefined) {
		  // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
		  checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
		}
		return checkIfNum && e.preventDefault();
	  }

render() {
	return (    

		<>
<Header/>
<body className="page-login" style={{backgroundColor: "#fff"}}>
<div id="content-block">
	<div className="container be-detail-container userprofile">
		<div className="row">
			<div className="col-xs-12 col-md-3 left-feild">
				
				<div className="be-vidget" id="scrollspy">
					
					<div className="creative_filds_block">
						<ul className="ul nav">
						{this.state.talentStatusAPIData?.telent_status === 1 ? 
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this,'6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                          :''
                          
                        }
						<li className="edit-ln active" ><Link onClick={this.loading.bind(this,'1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
						<li className="edit-ln" ><Link onClick={this.loading.bind(this,'2')} to={`${config.baseUrl}about`}>About</Link></li>
						<li className="edit-ln" ><Link onClick={this.loading.bind(this,'3')} to={`${config.baseUrl}salehistory`}>Sell History</Link></li>
						<li className="edit-ln" ><Link onClick={this.loading.bind(this,'4')} to={`${config.baseUrl}yourpurchase`}>Purchases History</Link></li>
						{/* <li className="edit-ln" ><Link onClick={this.loading.bind(this,'5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li> */}
						{/* <li className="edit-ln" ><Link onClick={this.loading.bind(this,'7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li> */}
						
							
						</ul>
					</div>
					{/* <!-- <a className="btn full color-1 size-1 hover-1 add_section"><i className="fa fa-plus"></i>add sections</a> -->	 */}
				</div>

			</div>
			<div className="col-xs-12 col-md-9 _editor-content_">
				<div className="sec"  data-sec="">
					<div className="be-large-post mb-4">
						<div className="info-block style-1">
							<div className="be-large-post-align "><h3 className="info-block-label">Account Setting</h3></div>
						</div>
						<div className="be-large-post-align">
						<ToastContainer/>

							<div className="be-change-ava">
								<a className="be-ava-user style-2" href="javascript:void(0)">
								{this.state.image_preview === '' ?
									this.state.profileData.profile_pic === '' || this.state.profileData.profile_pic === null ? 
									<img src="images/noimage.png" className="image-auth"/>:	<img className="image-auth" src={`${config.imageUrl1}${this.state.profileData.profile_pic}`} alt=""/>:
									<img className="image-auth" src={this.state.image_preview}/>
								}
									
									<p>Profile Image</p>
								</a>

								<a className="be-ava-user style-2" href="javascript:void(0)">
								{this.state.image_preview1 === '' ?
								this.state.profileData.banner === '' || this.state.profileData.banner === null ? 
									<img src="images/himachal-Pradesh-banner.jpg" className="image-auth"/>:	<img className="image-auth" src={`${config.imageUrl1}${this.state.profileData.banner}`} alt=""/> :
									<img src={this.state.image_preview1} className="image-auth"/>

								}<p>Cover Image</p>

								</a>
								{/* <a className="btn color-4 size-2 hover-7">replace image</a> */}
							</div>
							
						</div>
						<div className="be-large-post-align">
							<div className="row">
								<div className="col-xs-12 col-sm-12">
								<div className="input-group mb-4">
									
									<div className="custom-file">
									<input type="file" name="profile_pic" accept=".png,.jpg,.jpeg" onChange={this.handleImagePreviewAvatar} className="custom-file-input" id="inputGroupFile01"/>
									<label className="custom-file-label" for="inputGroupFile01">Profile Picture</label>
									</div>
								</div>

								<div className="input-group mb-4">
									
									<div className="custom-file">
										
									<input type="file" name="banner" accept=".png,.jpg,.jpeg" onChange={this.handleImagePreviewBanner} className="custom-file-input" id="inputGroupFile01"/>
									<label className="custom-file-label" for="inputGroupFile01">Cover Image</label>
									</div>
								</div>
								</div>
								<div className="input-col col-xs-12 col-sm-12">
									<div className="form-group fg_icon focus-2">
										<div className="form-label">User Name</div>
										<input className="form-input" type="text" disabled name="user_name" onChange={this.handleChange} value={this.state.profileData.user_name}/>
									</div>							
								</div>
								{/* <div className="col-xs-12 col-sm-12">
								<div className="input-group mb-5">
										<div className="input-group-prepend">
										<span className="input-group-text" id="basic-addon3">https://example.com/users/</span>
										</div>
										<input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"/>
									</div>
								</div> */}
							
								<div className="input-col col-xs-12">
									<div className="form-group focus-2">
										<div className="form-label">Email Address</div>									
										<input className="form-input" type="email" disabled name="email" onChange={this.handleChange} value={this.state.profileData.email}/>
										{/* <div className="col-12 text-right mt-2 px-0" style={{fontSize: ".8em"}}>Your email hasn't been verified.  <a href="#" id="resend_verification_email" className="emphasize">Click to resend verification email</a></div> */}

									</div>								
								</div>	
							
						
								<div className="col-xs-12 col-sm-12">
									<div className="mt-4">
										<a className="btn color-1 size-1 hover-1 btn-right" onClick={this.submitForm}>Update</a></div>
								</div>
													
							</div>
						</div>
					</div>
					
				</div>
				<div className="sec"  data-sec="edit-password">
					<div className="be-large-post mb-4">
						<div className="info-block style-1">
							<div className="be-large-post-align"><h3 className="info-block-label">Password</h3></div>
						</div>
						<div className="be-large-post-align">
							<div className="row">
								<div className="input-col col-xs-12 col-sm-4">
									<div className="form-group focus-2">
										<div className="form-label">Old Password</div>									
										<input className="form-input" type="password" placeholder="Old Password"
										name="currentPassword" onChange={this.handleChangePassword} value={this.state.currentPassword}/>
									</div>								
								</div>
								<div className="input-col col-xs-12 col-sm-4">
									<div className="form-group focus-2">
										<div className="form-label">New Password</div>									
										<input className="form-input" type="password" placeholder="New Password"
										name="password" onChange={this.handleChangePassword} value={this.state.password}/>
									</div>								
								</div>
								<div className="input-col col-xs-12 col-sm-4">
									<div className="form-group focus-2">
										<div className="form-label">Repeat Password</div>									
										<input className="form-input" type="password" placeholder="Repeat Password"
										name="password2" onChange={this.handleChangePassword} value={this.state.password2}/>
									</div>								
								</div>
								<div className="col-xs-12">
									<a className="btn color-1 size-2 hover-1 btn-right" 
									disabled={!this.state.password || !this.state.currentPassword || !this.state.password2} onClick={this.handleSubmit}>change password</a>
								</div>																
							</div>
						</div>
					</div>
				</div>
				<div className="sec"  data-sec="security-Authentication">
					
					<div className="be-large-post mb-4">
						<div className="info-block style-1">
							<div className="be-large-post-align "><h3 className="info-block-label">Security and Authentication</h3></div>
						</div>

						<div className="be-large-post-align"><div className="row mb-3">
    <div className="col-sm-6"><h3 className="info-block-label mt-3"><strong>Two-Factor Authentication with Email</strong></h3><small>Two-Factor Authentication (2FA) is an extra layer of security to ensure that only you have the ability to log in.</small>
    <input type="number" value={this.state.twoAuthenticationData.SecretKey} onChange={this.handleTwoWay} 
	name="SecretKey" className="form-control mt-3" onKeyDown={ this.formatInput }/>
	<div className="contact100-form-checkbox pt-4">
	<p>Enable/Disabled:</p>

            {this.state.twoAuthenticationData?.enableTwoFactor === 1 ? 
			<input className="input-checkbox100" id="ckb1" value="1" checked type="checkbox" 
			name="enableTwoFactor" onChange={this.handleTwoWay}/>
			:
			<input className="input-checkbox100" id="ckb1" value="0"  type="checkbox"
			 name="enableTwoFactor" onChange={this.handleTwoWay}/>
			
		}
           
            
                          <label className="label-checkbox100" for="ckb1">
							Enable 2FA
              </label>
            </div>
<div className=" mt-4"><button className="btn color-1 size-2 hover-1 btn-left"  disabled={!this.state.twoAuthenticationData.SecretKey} type="submit" onClick={this.twoAuthenticationVerifyAPI}>Submit</button></div>
</div>
     <div className="col-sm-6"><img src={this.state.twoAuthenticationData.QR_code}/></div>
    
    
    
    <div className="col-6 mb-2"></div><div className="col-6 col-lg-6 pl-0"></div><div className="col-md-6"></div></div><div className="row"><div className="col-4 float-left"></div></div></div>

						
					</div>
				</div>
																						
			</div>				
		</div>
	</div>
</div>


<div id="two-factor-modal" className="modal fade" role="dialog" style={{display: "none"}} aria-hidden="true">
<div className="modal-dialog  modal-dialog-centered">
	{/* <!-- Modal content--> */}
	<div className="modal-content no-padding">
		<div className="modal-body">
		<div className="row">
			<div className="col-12 text-right">
			<button type="button" className="close" data-dismiss="modal">×</button>
			</div>
		</div>
		<div className="row justify-content-center mt-1 mb-3">
			<h4 className="modal-title text-center">Two-Factor Verification</h4>
		</div>
		<div className="row justify-content-center text-center modal-content-padding">
			<p>Check your email for your one-time access code.</p>
			<p>Enter your code to <span className="with-confirm-text d-none">confirm your </span><span><strong className="two-factor-verification-reason">Enable Email 2FA.</strong></span></p>
		</div>
		<div className="row justify-content-center text-center px-4">
			<div id="two_factor_error_message" className="alert alert-danger d-none w-100" role="alert"></div>
		</div>
		<div className="row justify-content-center mt-1 mb-4">
			<div className="single-number">
			<div className="single-number-container">
				<div className="single-number-input">
				<div className="single-number-input-container">
					<div className="single-number-input-item single-number-input-item-0">
					<input type="number" pattern="\d*" min="0" max="9"/>
					</div>
					<div className="single-number-input-item single-number-input-item-1">
					<input type="number" pattern="\d*" min="0" max="9"/>
					</div>
					<div className="single-number-input-item single-number-input-item-2">
					<input type="number" pattern="\d*" min="0" max="9"/>
					</div>
					<div style={{marginTop: "-25px"}}>
					<span className="input-seperator">.</span>
					</div>
					<div className="single-number-input-item single-number-input-item-3">
					<input type="number" pattern="\d*" min="0" max="9"/>
					</div>
					<div className="single-number-input-item single-number-input-item-4">
					<input type="number" pattern="\d*" min="0" max="9"/>
					</div>
					<div className="single-number-input-item single-number-input-item-5">
					<input type="number" pattern="\d*" min="0" max="9"/>
					</div>
				</div>
				</div>
			</div>
			</div>
		</div>
		<div className="row justify-content-center m-3">
			<button id="two-factor-modal-confirm-button" type="button" className="btn btn-primary btn-lg btn-ext-padding" disabled="">Confirm</button>
		</div>
		</div>
	</div>
</div>
</div>
</body>
<Footer/>
</>
	)
}

}