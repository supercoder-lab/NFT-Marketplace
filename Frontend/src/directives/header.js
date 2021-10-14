import React, { Component } from 'react';
// import Header from '../directives/header'
// import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import axios from 'axios';

export default class header extends Component {

    constructor(props) {
        super(props)
        this.state={
           profileData:'',
           searchData:'',
           searchDataList:[],
           headerShowData:'',
           talentStatusAPIData:'',
           nftIndex:'',
           talentIndex:'',
           defaultImage:0,
           cmn_toggle_switch:false
  
        }
        this.loginData = (!Cookies.get('loginSuccess'))?[]:JSON.parse(Cookies.get('loginSuccess'))
        this.onChange = this.onChange.bind(this)
    }
    componentDidMount() {
      this.getProfilePicAPI()
      this.talentStatusAPI()
            this.setState({
               cmn_toggle_switch:false
            })
      }

    onChange = e =>{
      this.setState({
          [e.target.name] : e.target.value
       })

       if(e.target.name === 'searchData'){
          this.allSearchAPI(e.target.value)
       }
   }
   openToggle(){
      this.setState({
         cmn_toggle_switch:!this.state.cmn_toggle_switch,
      })
      // setTimeout(() => {
         
      //    alert(this.state.cmn_toggle_switch)
      // }, 100);
   }

    async getProfilePicAPI() {
       
      await axios({
         method: 'post',
         url: `${config.apiUrl}getProfilePic`,
         headers: { "Authorization": this.loginData.message },
         data: { "email":  this.loginData.data?.user_email }
      }).then(response => {
         if (response.data.success === true) {
            this.setState({	
               profileData: response.data.response,
               defaultImage:1
               })

         }
      })
      }


      async talentStatusAPI(){
         await axios({
            method: 'post',
            url: `${config.apiUrl}getTelentStatus`,
            data: {'user_id':this.loginData?.data?.id}
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

      async allSearchAPI(id) {
         // e.preventDefault()
         await axios({
            method: 'post',
            url: `${config.apiUrl}allSearch`,
            headers: { "Authorization": this.loginData?.message },
            data: { "search":  id }
         }).then(response => {
            if (response.data.success === true) {
               var obj1 = (response.data.response.findIndex(o => o.type === 'talent'));
               var obj = (response.data.response.findIndex(o => o.type === 'nft'));
               
               this.setState({	
                  talentIndex:obj1,
                  nftIndex:obj,
                  searchDataList: response.data.response
               })
               
            }
            else if (response.data.success === false) {
            }
         }).catch(err => {
            this.setState({	
               searchDataList: []
               })
               

         })
         }


    logout(){
      Cookies.remove('loginSuccess')
      setTimeout(() => {
         window.location.href = `${config.baseUrl}`
      }, );
   }



   loading(id) {
      setTimeout(() => {
          window.location.href = `${config.baseUrl}featurescreator/${id}`
          window.location.reload(true)
      }, 500);
  }

  loadingGroup(id) {
      setTimeout(() => {
          window.location.href = `${config.baseUrl}itemdetails/${id}`
          window.location.reload(true)
      }, 500);
  }


  headerShow(id){
      if(id === '1'){
         this.setState({
            headerShowData:'1'
         })
      }
      else if(id === '0'){
         this.setState({
            headerShowData:''
         })
      }
  }


  

    render() {
        return (    

            <>
             {/* <div className="be-loader">
         <div className="spinner">
            <img src="images/logo-new.png" alt width="200"/>
            <p className="circle">
               <span className="ouro">
               <span className="left"><span className="anim"></span></span>
               <span className="right"><span className="anim"></span></span>
               </span>
            </p>
         </div>
      </div> */}
         <header>
         <div className="container-fluid custom-container">
            <div className="row no_row row-header">
                  <Link to={`${config.baseUrl}`} style={{zIndex:'1'}} >
               <div className="brand-be">
                  {/* <img className="logo-c active be_logo" src="images/logo-new.png"   alt="logo" /> */}

                  <h2 style={{marginTop:"14px", color: "#fff"}}>Vulnerary</h2>

                  {/* <img className="logo-c be_logo" src="images/logo-green.png" alt="logo2"/>
                  <img className="logo-c be_logo" src="images/logo-orang.png" alt="logo3"/>
                  <img className="logo-c be_logo" src="images/logo-red.png" alt="logo4"/> */}
               </div>
                  </Link>
               <div className="header-menu-block">
                  <button onClick={this.openToggle.bind(this)} className={`cmn-toggle-switch cmn-toggle-switch__htx ${this.state.cmn_toggle_switch?'active':''}`}><span></span></button>
                  <ul className="header-menu" id="one" style={{display:(this.state.cmn_toggle_switch)?'block':'none'}}>
                     <div className="col-md-3 search-box-input" >
                         {/* <form action="./" className="input-search"/> */}
                        <form className="input-search" onSubmit={(e => e.preventDefault())}>
                        <input type="text" autoComplete="off"  className="form-control" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search"/>
                          <i className="fa fa-search"></i>
                         
                          <ul className="search_ul" style={{display:this.state.searchDataList.length === 0 ?'none':'block',overflowX:'hidden'}}>
                                {this.state.searchDataList.map((item,i) => {
                                
                                   return (
                                      (item.type == 'talent') ?
                                      <>
                                         {(this.state.talentIndex==i)? 
                                          <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%',color:'#000',height:'37px',paddingTop:'20px',borderBottom:'1px solid #ddd',marginBottom:'15px' }} >People</li>
                                          :''}
                                          
                                      {/* <p style={{color:'#000'}}>People</p> */}
                              <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%',color:'#000',height:'48px' }} title={item.full_name} >
                                 <Link to={`${config.baseUrl}featurescreator/${item.id}`} onClick={this.loading.bind(this, item.id)}>
                                 <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined 
                                             ? 'images/noimage.png' 
                                             :
                                             `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt=""/>
                                       <span data-id={item.id} style={{ marginLeft: "10px", position: "relative" , top: "-7px" ,color: "rgba(0, 0, 0, 0.87)"}}>{item.full_name}</span>
                                       <br/>
                                       <span data-id={item.id} style={{ marginLeft: "42px" ,position: "relative" , top: "-7px", color: "rgba(0, 0, 0, 0.54)"}}>@{item.user_name}</span>


                                 </Link>
                              </li></>
                              :
                              <>
                               {(this.state.nftIndex==i)? 
                                          <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%',color:'#000',height:'37px',paddingTop:'20px',borderBottom:'1px solid #ddd',marginBottom:'15px'  }} >NFT</li>
                                          :''}
                               <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%',color:'#000',height:'48px' }} title={item.full_name} >
                                 <Link to={`${config.baseUrl}itemdetails/${item.id}`} onClick={this.loadingGroup.bind(this, item.id)}>
                                 <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined 
                                             ? 'images/team2.jpg' 
                                             :
                                             `${config.imageUrl}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt=""/>
                                       {/* <img src={`${config.imageUrl}${item.profile_pic}`} alt="Nothing Found" style={{ height: '50px', width: '50px', borderRadius: '50%' }} />  */}
                                       <span data-id={item.id} style={{ marginLeft: "10px",position: "relative" , top: "-7px",color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                       <br/>

                                       <span data-id={item.id} style={{ marginLeft: "42px",position: "relative" , top: "-7px",color: "rgba(0, 0, 0, 0.87)" }}>@{item.user_name}</span>

                                 </Link>
                              </li>
                              </>
                              
                           )
                          

                              })}
                        </ul>
                                {/* </datalist> */}
                        </form>
                     </div>
                     {/* <li><Link to={`${config.baseUrl}upcomingdrops`} >Upcoming Drops</Link></li> */}
                     {/* <li><Link to={`${config.baseUrl}artviewall`}>Art</Link></li> */}
                     {/* <li>
                        <Link to={`${config.baseUrl}musicviewall`}>Music</Link>
                    
                     </li> */}
                     {/* <li><Link to={`${config.baseUrl}sportviewall`}>Sports</Link></li> */}
                     {/* <li><Link to={`${config.baseUrl}realstate`}>Real Estate</Link></li> */}

                     <li><Link to={`${config.baseUrl}createyourownnftslist`} className="animate-new-talent">Marketplace</Link></li>
                     {/* <li><Link to={`${config.baseUrl}realstatelist`} className="animate-new-talent">Real Estate</Link></li> */}

                   {this.loginData.length === 0 ?  
                   <>
                     <li className="login"><Link to={`${config.baseUrl}login`} >Login</Link></li>
                     </>
                     :
                     <>
                     <div className="login-header-block user-dropprofile" onClick={this.headerShow.bind(this,this.state.headerShowData === ''?'1':'0')}>
                     <div className="login_block">                                 
                     <div className="be-drop-down login-user-down">                        
                     <span className="be-dropdown-content"> &nbsp; Hi, <span>{this.state.profileData.full_name}</span></span>&nbsp;&nbsp;
                    {this.state.defaultImage === 0 ? 
                     <img className="login-user" style={{height:'40px',width:'40px'}} src="images/noimage.png" alt=""/>:

                     this.state.profileData.profile_pic === '' || this.state.profileData.profile_pic === null ? 
                     <img className="login-user" style={{height:'40px',width:'40px'}} src="images/noimage.png" alt=""/>:	<img className="image-auth login-user" style={{height:'40px',width:'40px'}} src={`${config.imageUrl1}${this.state.profileData.profile_pic}`} alt=""/>
                  }
                     
                     <div className="drop-down-list a-list">
                     {this.state.talentStatusAPIData?.telent_status === 1 ? 
                     <Link onClick={this.loading.bind(this,'6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link>
                          :''
                          
                        }
                    <Link to={`${config.baseUrl}authoredit`} >Account Setting</Link>
                    <Link to={`${config.baseUrl}about`} >About</Link>
                    <Link to={`${config.baseUrl}salehistory`} >Sell History</Link>
                    <Link to={`${config.baseUrl}yourpurchase`} >Purchases and Bids</Link>
                    {/* <Link to={`${config.baseUrl}paymentsetting`} >Wallet</Link> */}
                    {/* <Link to={`${config.baseUrl}royalty`} >Royalty</Link> */}

                    <Link to={`${config.baseUrl}`} onClick={this.logout.bind(this)}>Logout</Link>
              </div>
            </div>
          </div>  
        </div>
        </>}
                  </ul>
               </div>
               {/*   <div className="login-header-block">
                  <div className="login_block">
                     <a className="btn-login btn color-1 size-2 hover-2" href><i className="fa fa-user"></i>
                     Log in</a>
                     <a className="btn-login btn color-1 size-2 hover-2" href><i className="fa fa-user"></i>
                     Sing up</a>
                  </div>
                  </div>  */}
            </div>
         </div>

      </header>

            </>
        )
    }
}     