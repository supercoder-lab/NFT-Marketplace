import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Countdown,{zeroPad} from 'react-countdown';
import Cookies from 'js-cookie';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import { LazyLoadImage  } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Loader from "react-loader-spinner";

const headers = {
    'Content-Type': 'application/json'
 };
const btnFill = {
   background:'linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), url("images/main-bg.jpg")'
   // background:"linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7))", `url("images/main-bg.jpg")`
}
export default class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
         getcategoryData:[],
         getCategoryByIdArray:[],
         getWebImageData:[],
         activeBtn:'0',
         email:'',
         subscricbeSuccess:'0',
         subscricbeFAilure:'0',
         subscribeMsg:'',
         spinLoader:'0',
         defaultImage:0
        }
      this.addSubscriberAPI = this.addSubscriberAPI.bind(this)
      this.onChange = this.onChange.bind(this)   
      this.loginData = (!Cookies.get('loginSuccess'))?[]:JSON.parse(Cookies.get('loginSuccess'));

   }

   getTimeOfStartDate(dateTime){
      var date = new Date(dateTime); // some mock date
      var milliseconds = date.getTime();
      return milliseconds;
    }

   CountdownTimer({days, hours, minutes, seconds, completed }){
      if (completed) {
        // Render a completed state
        return "Starting";
      } else {
        // Render a countdowns
        var dayPrint = (days>0)?days+'d':'';
        return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
      }
    };

    componentDidMount() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getcategoryAPI()
      this.getCategoryByIdAPI()
      this.getWebImageAPI()
    }

   onChange = e =>{
      this.setState({
          [e.target.name] : e.target.value
       })
   }



    //====================================  Add subscriber API =============================

    async addSubscriberAPI(e) {
       e.preventDefault()
       this.setState({
         spinLoader:'1'
       })
      await axios({
         method: 'post',
         url: `${config.apiUrl}addSubscriber`,
         data:{'email':this.state.email}
      }).then(response => {
         if (response.data.success === true) {
               this.setState({
                  email:'',
                  subscricbeSuccess:'1',
                  subscribeMsg:response.data.msg,
            subscricbeFAilure:'0',
            spinLoader:'0'

               })
         }
      })
      .catch(err => {
         this.setState({
            email:'',
            subscricbeFAilure:'1',
            subscribeMsg:err.response.data.msg,
            subscricbeSuccess:'0',
            spinLoader:'0'
         })
         
      });
    }

    
    async getcategoryAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getcategory`,
         
      }).then(response => {
         if (response.data.success === true) {
           this.setState({
             getcategoryData: response.data?.response
           })
           
         }
      })
    }

     //====================================  CAtegory API =============================

     async getWebImageAPI() {
        this.setState({
           defaultImage:0
        })
      await axios({
         method: 'get',
         url: `${config.apiUrl}getWebImage`,
      }).then(response => {
         if (response.data.success === true) {
           this.setState({
             getWebImageData: response.data?.response[0],
             defaultImage:1
           })
         }
      })
    }



      getCategoryByIdAPI(id){
         if(id === undefined || id === '0'){
            id = '0'
         }
         this.setState({
            activeBtn:id
         })           
         axios({
            method:'post',
            url: `${config.apiUrl}listAdminItem`,
            headers: { "Authorization": this.loginData?.msg },
            data: {'category_id':id,'limit':9}
            })
            .then(response => {
               
            
               if (response.data.success === true) {
                  this.setState({
                     getCategoryByIdArray:response.data.response
                  })   
               }
            
               else if (response.data.success === false) {
                  this.setState({
                     getCategoryByIdArray:[]
                  })
               }
            })
            .catch(err => {
               this.setState({
                  getCategoryByIdArray:[]
               })
            })
      }

      //=====================================  load the data   =========================================

loading(){
   setTimeout(() => {
      window.location.reload()
   }, );
   }
      

    render() {
        return (    

            <>
  <Header/>

      <div id="content-block">  
      <div className="head-bg" style={{height:this.state.getWebImageData.length === 0 ? '549px':''}}>

      {this.state.getWebImageData.length === 0 ? <div className="caroselHeight loaderBars">
<Loader type="Bars" color="#00BFFF" height={40} width={40} />
</div>:
<div className="caroselHeight">


<Carousel showThumbs="false" autoPlay="true" interval="10000" infiniteLoop>
                <div>
                <img effect="blur"  src={`${config.imageUrl1}${this.state.getWebImageData?.slider2}`} alt="Chicago" style={{width:"100%"}} onClick={this.loading.bind(this)} href={`${config.baseUrl}itemdetails`} />
                {this.state.getWebImageData?.text2 === '' || this.state.getWebImageData?.text2 === null || this.state.getWebImageData?.text2 === undefined || this.state.getWebImageData?.text2 === "<p><br></p>" ? '' :
                <div className="carousel-caption" style={{background: "#060891ad",boxShadow: "0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 1"}}>
                   <div dangerouslySetInnerHTML={{ __html: this.state.getWebImageData?.text2 }}></div>
                
         </div> 
    }
                </div>
                <div>
                <img effect="blur"  src={`${config.imageUrl1}${this.state.getWebImageData?.slider3}`} alt="New york" style={{width:"100%"}} onClick={this.loading.bind(this)} href={`${config.baseUrl}itemdetails`}/>
                {this.state.getWebImageData?.text3 === '' || this.state.getWebImageData?.text3 === null || this.state.getWebImageData?.text3 === undefined || this.state.getWebImageData?.text3 === "<p><br></p>" ? '' :
        <div className="carousel-caption" style={{background: "#060891ad",boxShadow: "0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 1"}}>
        <div dangerouslySetInnerHTML={{ __html: this.state.getWebImageData?.text3 }}></div>
         
        </div> 
    }
                </div>
            </Carousel>


{/* } */}
</div>

  
}
    </div>
        
      <div className="container-fluid custom-container pr-0 pl-0">
        <div className="">
         <ToastContainer/>
   
  <br/>
  <div className="container-fluid custom-container newsletter" style={btnFill}>
               <div className="container">
                  <div className="row">
                     <div className="col-md-2">
                        
                     </div>
                     <div className="col-md-8 text-center newsletter-form">
                     {/* //=========================  for success msg  =============== */}
                     <div className="alert alert-success alert-dismissible fade sucessmsg row" role="alert" style={{marginLeft:'auto',marginRight:'auto',display:this.state.subscricbeSuccess === '0'?'none':'block'}}>
                       
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>{this.state.subscribeMsg}</strong> 
                     </div>

                     {/* //============================= for fasli masg ============= */}

                     <div className="alert alert-warning alert-dismissible fade warningMsg row" role="alert" style={{marginLeft:'auto',marginRight:'auto',display:this.state.subscricbeFAilure === '0'?'none':'block'}}>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>{this.state.subscribeMsg}</strong> 
                        </div>

                        <h3>Stay up to date with Vulnerary</h3>
                        <br/>
                        <form onSubmit={this.addSubscriberAPI} className="subscribe-form">
                           <input type="email" placeholder="Enter your email address"
                           name="email" value={this.state.email} onChange={this.onChange}/> 
                           <div className="submit-block" style={{width: "138px"}}>

                           {this.state.spinLoader === '0' ? 
                           <>
            <span className="">&nbsp;Subscribe</span>
            <input type="submit" disabled={!this.state.email}/>
            </> :
             <>
             <span className="" style={{right:'76px'}}>&nbsp;Subscribe</span><i style={{right:'-106px'}} className="fa fa-spinner fa-spin validat"></i>
             <input type="submit" disabled={!this.state.email}/>
             </>
         
          }
           
                           </div>
                        </form>
                     </div>
                     <div className="col-md-2">
                        
                     </div>
                     
                  </div>
               </div>
            </div>
        
            <br/><br/>
               <div className="container-fluid custom-container explore">
                  <div className="container">
                     <div className="row">
                        <div className="col-md-6">
                           <h3><strong>Explore</strong></h3>
                        </div>
                        <div className="col-md-6 text-right">
                        </div>
                        <div className="col-md-12">
                           <br/>
                           <div className="tab-wrapper style-1">
                              <div className="tab-nav-wrapper">
                                 <div className="nav-tab  clearfix scrollmenu">
                                    <div className={`nav-tab-item ${(this.state.activeBtn == 0)?`active`:``} `}>
                                       <span onClick={this.getCategoryByIdAPI.bind(this,'0')}>All</span>
                                    </div>
                                       {this.state.getcategoryData.map(item => (
                                    <div className={`nav-tab-item ${(this.state.activeBtn == item.id)?`active`:``} `} onClick={this.getCategoryByIdAPI.bind(this,item.id)}>
                                       <span>
                                          {item.name}
                                          </span>
                                    </div>
                                          ))}
                                    
                                 </div>
                              </div>
                              <div className="tabs-content clearfix">
                                 <div className="tab-info active" style={{display: "block"}}>
                                    <div className="row">
                                       {this.state.getCategoryByIdArray.length === 0 
                                       ? <h3 className="text-center">No Item in this product.</h3>:
                                       this.state.getCategoryByIdArray.map(item => (
                                          <div className="col-ml-12 col-xs-6 col-md-4">
                                          <div className="be-post">
                                          {item.is_sold === 0 ? 
                                             '':<div className="soldOut">
                                             <img src="images/sold.png"/>
                                          </div>
                                          }
                                              <Link to={item.file_type === 'video' ? '#/':`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                          {item.file_type === 'audio' ? 
                                             <img effect="blur"  src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg"/>:''
                                       }
                                       
                                                {item.file_type === 'image'  ? 
                                                <img effect="blur"  src={`${config.imageUrl}${item.image}`} alt="omg"/>:
                                                item.file_type === 'video' ? 
                                                <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`}/> :
                                                <ReactAudioPlayer
                                                   src={`${config.imageUrl}${item.image}`}
                                                   
                                                   controls
                                                   />               
                                             }
                                             {item.is_sold === 1 || item.expiry_date === '0000-00-00 00:00:00' || item.expiry_date === '0000-00-00' ? 
                                                                           '':
                                                   <div className="timer2">
                              
                                                         <Countdown
                                                   date={this.getTimeOfStartDate(item.expiry_date)}
                                                   renderer={this.CountdownTimer}
                                                />
                                                </div>}
                                                </Link>
                                           
                                             <div className="mb-4">
                                             <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} target="_blank" onClick={this.loading.bind(this)} style={{display:'inline'}} className="be-post-title">
                                                {item.name}</Link>
                                                <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} target="_blank" onClick={this.loading.bind(this)} className="be-post-title price">$ {item.price}</Link>
                                             </div>
                                             
                                             <div className="author-post">
                                                
                                                
                                             </div>
                                                                         
                                          </div>
                                       </div>
                                    
                                       ))}
                                       </div>
                                 </div>
                                 <br/>
                                 <br/>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            </div>
         </div>
         <Footer/>
         </>
        )
    }
}