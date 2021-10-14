import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import { LazyLoadImage  } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Countdown,{zeroPad} from 'react-countdown';
import Loader from "react-loader-spinner";
import Web3 from 'web3';

const headers = {
    'Content-Type': 'application/json'
 };

export default class createyourownnftslist extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccess'))?[]:JSON.parse(Cookies.get('loginSuccess'))
        this.state={
         getitemData:[],
         getPayoutAddress : []
        }
    }

    componentDidMount() {
         this.getitemAPI()
    }

 //=======================================  getitem  =====================

async getitemAPI() {
   await axios({
      method: 'get',
      url: `${config.apiUrl}getitem`,
      data: {}
   })
      .then(result => {
         if (result.data.success === true) {
            this.setState({
               getitemData: result.data.response,
            })
         }
         else if (result.data.success === false) {
         }
      }).catch(err => {
      });
}


      loginCheck(){
         if(this.loginData.length === 0){
            window.location.href = `${config.baseUrl}login`
         }
         else{
            this.getPayoutAddressAPI()          
      }
   }

   async getPayoutAddressAPI(){
      await axios({
         method: 'post',
         url: `${config.apiUrl}getPayoutAddress`,
         headers: { "Authorization": this.loginData?.Token },
         data: {'user_id':this.loginData.data.id}
      })
         .then(async result => {

          if (result.data.success === true) {
            window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`
                 this.setState({
                  getPayoutAddress:result.data
                 })
          }
          else if (result.data.success === false) {
               if (window.ethereum) {
                  await window.ethereum.send('eth_requestAccounts');
                  window.web3 = new Web3(window.ethereum);
                  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  if(accounts){
                     this.setPayoutAddress(accounts[0])
                  }
                  this.setState({
                     ConnectWalletAddress: accounts
                  })
               }
               else {
                  toast.error(`Please install MetaMask to use this dApp!`, {
                     position: toast.POSITION.TOP_CENTER
                  });
               }
                                     
          }
         }).catch(err => {

         });
      } 
      
   async setPayoutAddress(address){
      await axios({
         method: 'post',
         url: `${config.apiUrl}setPayoutAddress`,
         headers: { "Authorization": this.loginData?.Token },
         data: {'user_id':this.loginData.data.id, 'address' : address}
      })
         .then(async result => {

          if (result.data.success === true) {
            window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`
          }
          else if (result.data.success === false) {
            toast.error(`Something Wrong due to internal Error!`, {
               position: toast.POSITION.TOP_CENTER
            });                      
          }
         }).catch(err => {

         });      
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



   loading(){
      setTimeout(() => {
         window.location.reload()
      }, 500);
   }

    render() {
        return (    

            <>
  <Header/>
  <div id="content-block">
       <br/><br/>
          
         <div className="container-fluid custom-container">
           <ToastContainer/>
            <div className="container-fluid custom-container upcomming-drops pr-0 pl-0" id="upcomming-drops">
               <div className="container">
                  <div className="row">
                     <div className="col-xs-12 col-md-12">
                            <div className="row">
                              <div className="col-sm-9">
                
                              </div>
                              <div className="col-sm-3">
                                <div className="be-vidget back-block mb-4 btn-right">
                                      <a className="btn full btn-primary size-1 hover-2" onClick={this.loginCheck.bind(this)} >Create Your Own NFTs</a>
                                </div>
                              </div>
              
                            </div>
                          </div>
                      
                     <br/><br/><br/>
                     <div className="col-md-12">
                        <br/>
                        {this.state.getitemData.length === 0? 
                      <div  className="row _post-container_" style={{height:'200px'}}>
                      <div className="caroselHeight loaderBars">
                      <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                      </div>
                      </div>:
                        <div  className="row _post-container_">
                
                           {this.state.getitemData.map(item => (
                              <div className="category-1 mix col-md-4">
                              <div className="be-post">
                              {item.is_sold === 0 ? 
                           '':
                           <div className="soldOut">
                           <img src="images/sold.png"/>
                        </div>
                        }
                              <Link to={item.file_type === 'video' ? '#/':`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">


      {item.file_type === 'image'  ? 
      <img effect="blur" src={`${config.imageUrl}${item.image}`} alt="omg"/>:
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
                                 
                                 <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title">{item.name}</Link>
                          <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">$ {item.price}</Link>
                                
                                 <span>
                                 </span>
                                 <div className="author-post">
                                 </div>
                              </div>
                           </div>
                
                           ))}
                           
                        </div>
    }
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