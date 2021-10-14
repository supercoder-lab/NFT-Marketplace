import React, { Component,Fragment } from 'react';
import ReactDOM from 'react-dom';
 import axios from 'axios';
 import Header from '../directives/header'
import { Helmet } from 'react-helmet'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import $ from 'jquery';
import Swal from 'sweetalert2';
// import StripeCheckout from 'react-stripe-checkout'
import ReactDatatable from '@ashvin27/react-datatable'
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, EmailIcon, EmailShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
// import { CheckoutForm } from '../components/CheckoutForm';
import Countdown,{zeroPad} from 'react-countdown';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import Web3 from 'web3';
import Lightbox from "react-awesome-lightbox";
import LightboxSlider from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 

// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import ModalImage from "react-modal-image";
import Loader from "react-loader-spinner";

const headers = {
    'Content-Type': 'application/json'
 };
 const TITLE = 'Vulnerary'

export default class itemdetails extends Component {

constructor(props) {
   super(props)
   this.loginData = (!Cookies.get('loginSuccess'))?[]:JSON.parse(Cookies.get('loginSuccess'))
   const { match: { params } } = this.props;
   this.id = params.id
   this.state = {
   // ConnectWalletAddress:this.loginData?.data?.user_address,
   ConnectWalletAddress : '',
   getListItem:'',
   getRelatedItem:[],
   etherClickActive:0,
   bid_price:'',
   getBidDetailData:[],
   socialIconData:'',
   likeCount:'',
   ErrorMessage:'',
   cryptoPayBtnDesable:false,
   copied: false,
   getUsdBalance:'',
   getWebImageData:[],
   getImage1:'',
   seeIm1:'',
   getwalletDetails : '',
   photoIndex: 0,
   isOpen: false,
   mainSliderImages:[],
      loaderImage:0,
      TokenBalnce:0,
   }
   this.onChange = this.onChange.bind(this)
   // this.paymentPay = this.paymentPay.bind(this)
   this.purchaseNft = this.purchaseNft.bind(this)               

   this.columns = [
      {
          key: "user_name",
          text: "Owner",
          cell: (item) => {
            return (
               <Fragment>
               <Link className="weak mr-2 d-inlne-block" to={`${config.baseUrl}featurescreator/${item.user_id}`}
                  target="_blank">
               <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined 
               ? 'images/noimage.png' 
               :
               `${config.imageUrl1}${item.profile_pic}`} className="profile_picture x-small"
               style={{height:'36px',width:'36px'}} alt=""/>
               </Link>
               <div className="ml-1 mt-2 d-inline-block" style={{maxWidth: '150px', overflowX: 'hidden', textOverflow: 'ellipsis', marginBottom: '-7px'}}>
                  <Link to={`${config.baseUrl}featurescreator/${item.user_id}`} target="_blank" className="heavy strong" mptrackaction="product:activity:collector_name">
                  {item.full_name}
                  </Link>
               </div>
               </Fragment>
            );
        }
      },
      {
          key: "activity",
          text: "Activity",
          cell: (item) => {
            return (
               <div>
                  
                  {item.transaction_type} ${item.amount}                 
                  </div>
            );
        }
      },
      {
         key: "edition_text",
         text: "Edition",
         
     },
      {
          key: "transaction_date",
          text: "Date",
          sortable:true,
          cell: (item) => {
            return (
               <div>
               {item.transaction_date}
               </div>
            );
        }
         
      },
      ]
      
      this.config = {
         page_size: 10,
         length_menu: [10, 20, 50],
         show_filter: true,
         show_pagination: true,
         pagination: 'advance',
         button: {
             excel: false,
             print: false
         }
     } 
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
componentDidMount(){
   this.itemDetailsAPI()
   window.scrollTo({ top: 0, behavior: 'smooth' });
this.getItemLikeCountsAPI()
this.getWebImageAPI()
this.getwalletDetailsAPI()

setTimeout(() => {
   if(window.ethereum){
      const { ethereum } = window;
      this.setState({
         ConnectWalletAddress:ethereum.selectedAddress
      })        
      
   }   
}, 1000);

}

async connectMetasmask() {
   if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.setState({
         ConnectWalletAddress: accounts
      })
   }
   else {
      toast.error(`Please install MetaMask to use this App!`, {
         position: toast.POSITION.TOP_CENTER
      });
   }
}

async getwalletDetailsAPI() {
   await axios({
      method: 'post',
      url: `${config.apiUrl}getwalletDetails`,
      data : { 'user_id' : this.loginData?.data?.id },
      headers: { "Authorization": this.loginData?.message },
   }).then(response => {
      if (response.data.success === true) {
        this.setState({
         getwalletDetails: response.data?.response[0]
        })
      }
   })
 }

 async getSellerwalletDetailsAPI() {
   await axios({
      method: 'post',
      url: `${config.apiUrl}getPayoutAddress`,
      data : { 'user_id' : this.state.getListItem?.user_id },
      headers: { "Authorization": this.loginData?.message },
   }).then(response => {
      if (response.data.success === true) {
        this.setState({
         getSellerwalletDetails: response.data?.response
        })
      }
   })
 }

 //====================================  CAtegory API =============================

 async getWebImageAPI() {
   await axios({
      method: 'get',
      url: `${config.apiUrl}getWebImage`,
      headers: { "Authorization": this.loginData?.message },
   }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getWebImageData: response.data?.response[0]
        })
      }
   })
 }

//=====================================  change event ===============================

onChange = e =>{
this.setState({
      [e.target.name] : e.target.value
   })
}


async itemViewsAPI() {
   await axios({
      method: 'post',
      url: `${config.apiUrl}itemView`,
      data: { "item_edition_id": this.id ,"user_id":this.loginData.data.id}
   })
      .then(result => {
         if (result.data.success === true) {
           
         }
         else if (result.data.success === false) {
         }
      }).catch(err => {
      });
   }
    
   
//=======================================  Like details  =====================

async getItemLikeCountsAPI() {
   await axios({
      method: 'post',
      url: `${config.apiUrl}getItemLikeCount`,
      data: { "item_edition_id": this.id ,"user_id":this.loginData?.data?.id}
   })
      .then(result => {
         if (result.data.success === true) {
           this.setState({
              likeCount:result.data.response
           })
           
         }
         else if (result.data.success === false) {
         }
      }).catch(err => {
      });
   }

async itemDetailsAPI() {
   this.setState({
      loaderImage:0
   })
await axios({
   method: 'post',
   url: `${config.apiUrl}itemdetail`,
   data: { "item_edition_id": this.id,'user_id':this.loginData?.data?.id }
})
   .then(result => {
      if (result.data.success === true) {
         this.setState({
            getUsdBalance:result.data,
            getListItem: result.data.response,
            getRelatedItem: result.data.data,
            getImage1:JSON.parse(result.data.response.image_array),
            loaderImage:1
         })
         let mainArr = [];
         JSON.parse(result.data.response.image_array).map(item=>(
            (item.file_type == 'image')?
            mainArr.push(`${config.imageUrl}${item.image}`)
            :''
         ))
         this.setState({
            mainSliderImages:mainArr
         })
         this.getSellerwalletDetailsAPI()
         // console.log(this.state.mainSliderImages)
         if(this.loginData.data.id !== this.state.getListItem?.user_id)
      {
         this.itemViewsAPI()
      }
      this.getBidDetailAPI()
      
      }
      else if (result.data.success === false) {
         this.setState({
            loaderImage:1
         })
      }
   }).catch(err => {
      this.setState({
         loaderImage:1
      })
   });
}

  //=======================================  Like/dislike  =====================

  async likeAPI() {
   if(this.loginData.length === 0){
      window.location.href = `${config.baseUrl}login`
   }
   await axios({
      method: 'post',
      url: `${config.apiUrl}likeItem`,
      data: { "item_edition_id": this.id ,user_id:this.loginData.data.id}
   })
      .then(result => {
         if (result.data.success === true) {
            this.getItemLikeCountsAPI()
         }
         else if (result.data.success === false) {
         }
      }).catch(err => {
      });
   }

//=======================================  Bid details  =====================

async getBidDetailAPI() {
  
   
await axios({
   method: 'post',
   url: `${config.apiUrl}getMarketActivity`,
   data: { "item_id": this.state.getListItem.item_id }
})
   .then(result => {
      if (result.data.success === true) {
         this.setState({
            getBidDetailData: result.data.response,
            
         })
      }
      else if (result.data.success === false) {
      }
   }).catch(err => {
   });
}

scollREcent(){
document.getElementById('market_activity').scrollIntoView({ behavior: 'smooth', block: 'end' });
}


socialIcon(id){
   if(id === '1'){
      this.setState({
         socialIconData:'1'
      })
   }
   else if(id === '0'){
      this.setState({
         socialIconData:''
      })
   }
}


loginScreen(){
   window.location.href = `${config.baseUrl}login`
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

  loading(){
     setTimeout(() => {
        window.location.reload()
     }, );
  }
  multiImageOnModal(){
     this.setState({
      isOpen:true
     })
  }

  async purchaseNft(){

   if(this.loginData.length === 0){
      window.location.href = `${config.baseUrl}login`
   }

   if (window.ethereum) {
      var nftAmount = this.state.getListItem?.price
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // this.setState({
      //    ConnectWalletAddress: accounts
      // })
      var web3 = new Web3(window.ethereum);

      let livePriceAPI = await axios({ url: 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH' });
      var usdInEth = livePriceAPI.data.ETH
      var usdvalue = (parseFloat(usdInEth) * parseFloat(nftAmount)).toFixed(6);
      try {
         const contractAddress ='0xaaa767df438d199a9f24ef7d2db0ab0d3de1f6bd';
         const contract = await new web3.eth.Contract(config.abi, contractAddress);
         let decimals = await contract.methods.decimals().call();
         decimals = parseInt(decimals);
         var token = nftAmount*(10 ** decimals);
         var tokenValue = token;
         
         var adminAmount = (nftAmount*30/100)*(10 ** decimals)
         var userAmount = (nftAmount*70/100)*(10 ** decimals)

         var to_address = config.adminAddress;
         var userAddress = this.state.getSellerwalletDetails?.public
         
         var amountArr = [adminAmount.toString(), userAmount.toString()]
         var addressArr = [to_address, userAddress]

         console.log(amountArr);
         console.log(addressArr);

         var from_address = accounts[0];
         web3.eth.defaultAccount =from_address;
         
         let myToken = await contract.methods.balanceOf(from_address).call();
         if (myToken  < token) {
            toast.error(`insufficient funds for transfer`, {
               position: toast.POSITION.TOP_CENTER
            });
            return;
         }

         const tx_builder = await contract.methods.multiTransfer(addressArr, amountArr);
         let encoded_tx = tx_builder.encodeABI();

         let gasPrice = await web3.eth.getGasPrice();
         let gasLimit = await web3.eth.estimateGas({
            gasPrice: web3.utils.toHex(gasPrice),
            to: contractAddress,
            from: from_address,
            value: 0,
            chainId: '0x3',
            data:encoded_tx
         });

         const transactionParameters = {
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gasLimit),
            to: contractAddress,
            from: from_address,
            value: 0,
            chainId: '0x3',
            data:encoded_tx
         };
         
         const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
         });
         if(txHash){
            // alert(txHash)
            this.paymentPay1(txHash)            
         }

      } catch (error) {
         toast.error(`Something went wrong! Please try again later.`, {
            position: toast.POSITION.TOP_CENTER
         });
      }

   } else {
      toast.error(`Please connect your MetaMask wallet!`, {
         position: toast.POSITION.TOP_CENTER
      });
   }     
  }

  async paymentPay1(txHash) {
         var nftid = this.state.getListItem?.item_id
         var totalBalance = this.state.getwalletDetails?.balance
         var nftAmount = this.state.getListItem?.price
         var remainingAmount = parseInt(totalBalance) - parseInt(nftAmount)
         await axios({
            method: 'post',
            url: `${config.apiUrl}purchaseNft`,
            headers: { "Authorization": this.loginData?.Token },
            data: { "nftid":nftid, "toAddress" : this.state.getwalletDetails?.public, 'remainingAmount' : remainingAmount, 'user_id':this.loginData?.data?.id, 'amount' : this.state.getListItem?.price, 'item_edition_id' : this.state.getListItem?.item_edition_id, 'seller_id' : this.state.getListItem?.user_id, 'trxHash' : txHash  }
         })
            .then(async result => {
               if (result.data.success === true) {
                  var willSearch = await Swal.fire({
                     text: 'Congratulations, NFT purchased successfully.',
                     icon: 'success',
                     width: 500,
                     confirmButtonColor: '#3085d6',
                     allowOutsideClick: false
                  });
                  window.location.reload()                     
               }
               else if (result.data.success === false) {
                  toast.err(result.data.msg, {
                     position: toast.POSITION.TOP_CENTER , 
                     })                  
               }
            }).catch(err => {
               toast.error("Error occured!!", {
                  position: toast.POSITION.TOP_CENTER
                  })               
            });
   }  


render() {

   return (    

      <>
      <Helmet>
         <title>{TITLE}</title>
      </Helmet>
      <ToastContainer/>
      <Header/>

      {this.state.loaderImage === 0 ? 
    <div  className="row _post-container_" style={{height:'200px'}}>
    <div className="caroselHeight loaderBars">
    <Loader type="Bars" color="#00BFFF" height={40} width={40} />
    </div>
    </div>: 
    
    <>

<div id="content-block">
   <br/><br/>
   
   {this.state.isOpen && (
          <LightboxSlider
            mainSrc={this.state.mainSliderImages[this.state.photoIndex]}
            nextSrc={this.state.mainSliderImages[(this.state.photoIndex + 1) % this.state.mainSliderImages.length]}
            prevSrc={this.state.mainSliderImages[(this.state.photoIndex + this.state.mainSliderImages.length - 1) % this.state.mainSliderImages.length]}
            onCloseRequest={() => this.setState({isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + this.state.mainSliderImages.length - 1) % this.state.mainSliderImages.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + 1) % this.state.mainSliderImages.length,
              })
            }
          />
        )}

            {/* <button type="button"  >opne</button> */}

   <div className="container-fluid custom-container pl-0 pr-0">

   <div className="container-fluid custom-container upcomming-drops" id="upcomming-drops">
               <div className="container pl-5 pr-5 ">
                  <div className="row">
                  <div className="col-md-7 pad-spc-detail">
                                    {/* {alert(this.state.getImage1.length)} */}

                                    {this.state.getImage1.length === 1 ?
                                       <>
                           {console.log(this.state.getListItem)}

                           {this.state.getListItem?.image === undefined || this.state.getListItem?.image === '' || this.state.getListItem?.image === null ? '' :
                                                         this.state.getListItem?.file_type === 'image' ?
                         
                                                            <ModalImage
                                             small={`${config.imageUrl}${this.state.getListItem?.image}`}
                                             large={`${config.imageUrl}${this.state.getListItem?.image}`}
                                             className="img-responsive pr-5 pad-right itemShowData"
                                          />
                                                            //  </Link> 
                                                            :
                                                            this.state.getListItem?.file_type === 'video' ?
                                                               <a href={`${config.imageUrl}${this.state.getListItem?.image}`} target="_blank">

                                                                  <Player className="preview_image_data" src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{ width: "100%", height: '450px' }} />
                                                               </a> :

                                                               this.state.getListItem?.file_type === 'audio' ?
                                                                  <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">
                                                                     <ReactAudioPlayer
                                                                        src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{ width: '100%' }}

                                                                        controls
                                                                     />
                                                                  </Link> : ''}
                                          
 
                                       </>

                                       :
                                       this.state.getImage1.length > 1 ?
                                          <div className="head-bg">


                                          </div>
                                          : ''
                                    }


                                 </div>
                     <div className="col-md-5 pad-left">
                        <div className="row">
                           <div className="col-12">
                              <h3 id="digital_media_title">{this.state.getListItem?.name}</h3>
                           </div>
                        </div>
                        <div className="row purchase-wrapper">
                           <div className="col-12 mt-md-2 mt-3 mb-3">
                              {this.loginData.length === 0 ? 
                               <button type="submit" className="offer-button text-white btn color-1 size-2 col-sm-12" onClick={this.loginScreen.bind(this)}
                              >
                               {this.state.getListItem?.sell_type_name === 'Price' ? 
                            "Purchase":"Place Bid"
                         }
                                  
                                  </button>
                              
                              : 
                               (this.state.ConnectWalletAddress)?
                                 <>
                                 <a  style={{ textTransform: 'inherit',border:'2px solid #3358c8',borderRadius:'15px',background:'unset' }} className="offer-button text-white btn color-1 size-2 col-sm-12" target="_blank"  href={`https://etherscan.io/address/${this.state.ConnectWalletAddress}`}>{this.state.ConnectWalletAddress.toString().substring(0,8)+'...'+this.state.ConnectWalletAddress.toString().substr(this.state.ConnectWalletAddress.length-8)}</a>

                                 {this.state.getListItem?.soldout == 1?
                                    <button type="submit" 
                                    disabled="disabled" className="offer-button text-white btn color-1 size-2 col-sm-12" data-toggle="modal" data-target="#myModal" >
                                    {this.state.getListItem?.sell_type_name === 'Auction' ?"Place Bid":"Purchase"}
                                    </button>  
                                 :
                                    <button type="submit" 
                                    disabled={this.state.getListItem?.nft_type === 'Upcoming' || this.state.getListItem?.is_sold == 1 || this.state.getListItem?.user_id == this.loginData?.data?.id} className="offer-button text-white btn color-1 size-2 col-sm-12" data-toggle="modal" data-target="#myModal" >
                                    {this.state.getListItem?.sell_type_name === 'Auction' ?"Place Bid":"Purchase"}
                                    </button>  
                                 }

                                 
                                 </>
                                 :
                                 <a onClick={this.connectMetasmask.bind(this)} className="offer-button text-white btn color-1 size-2 col-sm-12"  href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.getListItem?.sell_type_name === 'Auction' ? 
                                 "Place Bid":"Purchase"
                              }</a>
                                 
                              
                           }

                             
                           </div>
                           <br/>
                         <a href="javascript:void(0)" className="mt-5" onClick={this.scollREcent.bind(this)}>
                         {this.state.getListItem?.sell_type_name === 'Price' ? 
                           "View market activity":"View Recent Offer"
                        }
                          
                            
                            </a>
                        </div>
                         <div className="row mt-4">
                           <div className="col-12">
                              <h5 className=" strong mb-3 text-white">Details:</h5>
                           </div>
                           <div className="col-12 mt-3">
                              <ul className="details text-white">
                              {this.state.getListItem?.description}
                              </ul>
                              
                           </div>
                        </div>
                        <div className="row stats my-md-4 my-3" style={{height:"24px"}}>
                        <div className="col-sm-12">
                           <div className="info-block" style={{backgroundColor: 'transparent',padding: "4px 15px"}}>
                                  <span onClick={this.likeAPI.bind(this)}>
                                     
                                     <i className="fa fa-heart" style={{color:this.state.likeCount?.is_liked === 0 ? '' : 'blue'}}></i> {this.state.likeCount?.count}</span>
                                  <span><i className="fa fa-eye"></i> {this.state.getListItem?.view_count}</span>
             
                                </div>
                            
                        </div>
                    </div>
                        <div className="col-12 mt-3">
                              <div className="row mt-1 " style={{backgroundColor: '#161616',marginLeft:'0', marginBottom: '50px',position:'relative'}}>
                                  <div className="col-lg-11 col-10 px-4 py-3">
                                      
                                      <div className="row">
                                          <div className="col-sm-12">
                                              <span className="h6" style={{color:'#fff'}}>Creator:</span>
                                              <span className="ml-1 h7">
                                              
                                                  <strong>
                                                      <Link to={`${config.baseUrl}featurescreator/${this.state.getListItem?.user_id}`} target="_blank" className="collab-storename secondary_text">{this.state.getListItem?.creator}</Link>
                                                      
                                                  </strong>
                                              </span>
                                          </div>

                                          <div className="col-sm-12" style={{paddingTop: "1em"}}>
                                              <span className="h6" style={{color:'#fff'}}>Owner:</span>
                                              <span className="ml-1 h7">
                                              
                                                  <strong>
                                                      <Link to={`${config.baseUrl}featurescreator/${this.state.getListItem?.user_id}`} target="_blank" className="collab-storename secondary_text">{this.state.getListItem?.owner}</Link>
                                                      
                                                  </strong>
                                              </span>
                                          </div>

                                          <div className="col-sm-12" style={{paddingTop: "1em"}}>
                                              <span className="h6" style={{color:'#fff'}}>Price:</span>
                                              <span className="ml-1 h7">
                                                  <span id="authenticity_url" href="#" className="secondary_text">
                                                      <strong id="edition_count">{this.state.getListItem?.price} VUL</strong>
                                                  </span>
                                              </span>
                                          </div>

                                          <div className="col-sm-12" style={{paddingTop: "1em"}}>
                                              <span className="h6" style={{color:'#fff'}}>Expire:</span>
                                              <span className="ml-1 h7">
                                                  <span id="authenticity_url" href="#" className="secondary_text">
                                                      <strong id="edition_count">
                                                         {/* {alert(this.state.getListItem?.expiry_date1)} */}
                                                         {this.state.getListItem?.expiry_date1 !== undefined ? 
                                                         <div className="timer3">
                                                         <Countdown
                                                            date={this.getTimeOfStartDate(this.state.getListItem?.expiry_date1)}
                                                            renderer={this.CountdownTimer}
                                                         />
                                                         </div>:''
                                                      }
                                                         
                                                         {/* {this.state.getListItem?.expiry_date1} */}
                                                         </strong>
                                                  </span>
                                              </span>
                                          </div>

                                          

                                          <div className="col-sm-12 col-xs-12" style={{paddingTop: "1em"}}>
                                             {this.state.getListItem?.token_hash === null || this.state.getListItem?.token_hash === undefined || this.state.getListItem?.token_hash === '' ? ''
                                          :   
                                          <a href={this.state.getListItem?.token_hash} target="_blank" className="primary">
                                          <span className="float-left">Blockchain View</span> <div className="icon right-arrow float-left" style={{margin:"6px 7px"}}></div>
                                      </a>
                                          }
                                           
                                          </div>

                                          <div className="col-sm-12 col-xs-12" style={{paddingTop: "3px"}}>
                                             {this.state.getListItem?.image_original === null || this.state.getListItem?.image_original === undefined || this.state.getListItem?.image_original === '' ? ''
                                          :   
                                          <a href={`${config.imageUrl}${this.state.getListItem?.image_original}`} target="_blank" className="primary">
                                          <span className="float-left">View on IPFS</span> <div className="icon right-arrow float-left" style={{margin:"6px 7px"}}></div>
                                      </a>
                                          }
                                           
                                          </div>

                                          <div className="col-sm-12 col-xs-12" style={{paddingTop: "3px"}}>
                                             {this.state.getListItem?.metadata === null || this.state.getListItem?.metadata === undefined || this.state.getListItem?.metadata === '' ? ''
                                          :   
                                          <a href={`${config.imageUrl}${this.state.getListItem?.metadata}`} target="_blank" className="primary">
                                          <span className="float-left">View IPFS Metadata</span> <div className="icon right-arrow float-left" style={{margin:"6px 7px"}}></div>
                                      </a>
                                          }
                                           
                                          </div>

                                      </div>
                                  </div>
           
                              </div>

                        </div>
                       
                       
                     </div>
                  </div>
               </div>
            </div>
      <br/>
      <br/>
      <div className="container-fluid custom-container ">
         <div className="container hot-bid table-cart-detail market_recent_activity" id="market_activity">
            <div className="row">
               <div className="col-md-12">
                  <h3>Market Activity</h3>
               </div>
               <div className="col-md-6 text-right">
               </div>
               <div className="col-md-12 text-white mt-5">
                  <div className="itemTable">
              
                  <ReactDatatable
                  config={this.config}
                  records={this.state.getBidDetailData}
               columns={this.columns}/>
                                       
                  </div>
               </div>
            </div>
         </div>
      </div>
      <br/>
      <div className="container-fluid custom-container ">
         <div className="container hot-bid">
            <div className="row">
               <div className="col-md-12">
                  <h3>Related Products</h3>
                  <hr/>
               </div>
               <div className="col-md-6 text-right">
               </div>
               <div className="col-md-12">
                  <br/>
                  <div className="row _post-container_">
                        {this.state.getRelatedItem.map(item => (

                     <div className="category-2 mix col-md-4">
                        <div className="be-post">
                        <Link target="_blank" to={item.file_type === 'video' ? '#/':`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">


      <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`}/> :


   
   {item.is_sold === 1 || item.expiry_date === '0000-00-00 00:00:00' || item.expiry_date === '0000-00-00' ? 
                           '':
   <div className="timer2">
                              
                              <Countdown
                          date={this.getTimeOfStartDate(item.expiry_date)}
                          renderer={this.CountdownTimer}
                       />
                      </div>}
      </Link>
                           
                           <Link target="_blank" to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} target="_blank" className="be-post-title">{item.name}</Link>
                          <Link target="_blank" to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">$ {item.price}</Link>

                           <span>
                           </span>
                           <div className="author-post">
                           </div>
                        </div>
                     </div>
                        ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <br/>
</div>
         <Footer/>

         <div id="myModal" className="modal fade cart-modal" role="dialog"  style={{background:'rgb(6, 6, 6)'}}
data-backdrop="false">
   <div className="modal-dialog modal-lg">
      <div className="modal-content">
         <div className="modal-header" style={{borderBottom: "1px solid transparent"}}>
            <button type="button" className="close" data-dismiss="modal">&times;</button>
         </div>
         <div className="modal-body">
            <div className="row">
               <div className="col-md-6  " style={{borderRight: "1px solid #E0E0E0"}}>
                  <div className="row p-3">
                     <div className="col-sm-12 mb-2 pl-0">
                        <h4 className="strong">{this.state.getListItem?.name}</h4>
                     </div>
                     <div className="col-md-6 mb-2 pl-0">
                        <span className="h8 weak">
                        <span className="collab-storename">{this.state.getListItem?.owner}</span>
                        </span>
                     </div>
                     <div className="col-md-6 text-right mb-2">
                        <span className="h weak">Edition: {this.state.getListItem?.edition_text}</span>
                     </div>
                     <div className="col-12" style={{marginTop:"20px"}}>
                        <div className="text-center mt-3">
                        {this.state.getListItem?.file_type === 'audio' ? 
                                             <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" style={{width:'100%',height:'341px',objectFit: 'fill'}} alt="omg"/>:''
                                       }
                                       
                                                {this.state.getListItem?.file_type === 'image'  ? 
                                               <img src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width:'100%',height:'341px',objectFit: 'fill'}} className="img-responsive pr-5 pad-right"/>:
                                                this.state.getListItem?.file_type === 'video' ? 
                                                <Player className="preview_image_data" src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width:'100%',height:'341px',objectFit: 'fill'}}/> :
                                                this.state.getListItem?.file_type === 'audio' ? 
                                                <ReactAudioPlayer
                                                   src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width:'100%'}}
                                                    
                                                   controls
                                                   />:''               
                                             }
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6">
                  <div className="row p-4">
                     <div className="heading-wrapper d-md-block mb-4">
                        <h4 className="strong payment-method-options">Offer Method</h4>
                     </div>
                     <div className="tab-wrapper style-1">

                        <div className="tabs-content clearfix">
                     
                           <div class={this.state.etherClickActive == 1 ? "tab-info" : "tab-info active"}  style={{display: this.state.etherClickActive == 1 ? 'none' :'block' }}>

                           <div className="col-12 mt-3">
                           {this.state.getListItem?.sell_type_name === 'Price' ? 
                                       <strong>
                                          Token Amount : {this.state.getListItem?.price} VUL <br/>
                                       </strong>:
                                       ''
                           }
                           </div>                           
                           <div className="col-12 mt-3">
                              <div className="input-group">
                              {this.state.getListItem?.sell_type_name === 'Price' ? 
                                       '':
                                       <>   
                                 <div className="input-group-prepend" style={{backgroundColor:"#fff"}}>
                                    <span className="input-group-text">$</span>
                                 </div>
                                 <input type="number" step="any" className="form-control currency  ccbid-price" 
                                 placeholder="Offer amount" id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" onKeyDown={ this.formatInput }/>
                                 </>
}
                              </div>
                           </div>

                              <div className="mt-4">
                                 <div className="col-12 nopadding">
      <span style={{color:'red',fontFamily:'cursive',textAlign:'center'}}>{this.state.ErrorMessage}</span>
                                    
                                    <button onClick={this.purchaseNft} className="btn btn-primary size-1 " title="Pay"
                                    mptrackaction="nux:giveapproval" >Pay</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>



    </>
   


   
   }

     
                  
      </>


   )
}
}