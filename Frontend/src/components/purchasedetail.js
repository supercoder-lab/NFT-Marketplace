import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';

import { Link } from 'react-router-dom';


export default class purchasedetail extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginSuccess')) ? [] : JSON.parse(Cookies.get('loginSuccess'));
      
  
      this.state = {
         talentStatusAPIData: '',
         getUserBidsData: [],
         getUserPurchaseData: [],
         defaultActive: 'Price',
         transactionDetailAPIData:''
      }


      const { match: { params } } = this.props;
      
      this.item_id =(!params.item_id_id)?Cookies.get('purchase_item_id'):params.item_id_id;
     
      


   }

   componentDidMount() {
      this.transactionDetailAPI()      
        if (Cookies.get('cryptoPaiment') && Cookies.get('purchase_item_id')) {         
         if(Cookies.get('cryptoPaiment') === 'success'){
           this.cryptoPaymentSucces();
         }else{
            this.cryptoPaymentFailed();
         }
         Cookies.set('cryptoPaiment', '');
         Cookies.set('paymentFor', '');
      }

   }


   loading(id) {
      if (id == '1') {
         window.location.href = `${config.baseUrl}authoredit`
      }
      else if (id == '2') {
         window.location.href = `${config.baseUrl}about`
      }
      else if (id == '3') {
         window.location.href = `${config.baseUrl}salehistory`
      }
      else if (id == '4') {
         window.location.href = `${config.baseUrl}yourpurchase`
      }
      else if (id == '5') {
         window.location.href = `${config.baseUrl}paymentsetting`
      }
      else if (id == '6') {
         window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`

      }
      else if (id == '7') {
         window.location.href = `${config.baseUrl}royalty`
      }

   }

   async transactionDetailAPI() {

      await axios({
         method: 'post',
         url: `${config.apiUrl}transactionDetail`,
         data: { 'transaction_id': this.item_id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                transactionDetailAPIData: result.data.response
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }




   

   
   render() {
      return (

         <>
            <Header />
            <body class="page-login" style={{ backgroundColor: "#fff" }}>
               <div id="content-block">
                  <div className="container be-detail-container your-purchase-bid">
                     <h2 className=" text-white mb-4">NFT Transaction Details</h2>
                     <div className="row">
                        <div className="left-feild col-xs-12 col-sm-3">
                           <div className="be-vidget">
                              <div className="creative_filds_block">
                                 <ul className="ul nav">
                                 {this.state.talentStatusAPIData?.telent_status === 1 ? 
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this,'6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                          :''
                          
                        }
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sell History</Link></li>
                                    <li className="edit-ln active" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Purchases and Bids</Link></li>
      
                                 </ul>
                              </div>
                           </div>
                        </div>
                        <div className="col-xs-12 col-sm-9 yourPurchases" >
                        <div class="info-block style-2" style={{borderRadius: '0px'}}><div class="be-large-post-align"><h3 class="info-block-label">NFT Transaction Details
</h3></div></div>
                        <div class="col-sm-12 background-shadow p-5">
                            <div class="row">


                            <div class="row">
   <div class="col-sm-2"></div>
   <div class="col-sm-8 login_edit_detail">
      <ul class="list-group task-list-group text-white">
         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">NFT Name:</span><span class=" d-block col-sm-6">{this.state.transactionDetailAPIData?.item_name}</span></label></div>
         </li>
         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">Edition:</span><span class=" d-block col-sm-6">{this.state.transactionDetailAPIData?.edition_text}</span></label></div>
         </li>
         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">Owner:</span><span class=" d-block col-sm-6">{this.state.transactionDetailAPIData?.user_name}</span></label></div>
         </li>
         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">Price:</span><span class=" d-block col-sm-6"> {this.state.transactionDetailAPIData?.amount} VUL</span></label></div>
         </li>

         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">Date:</span><span class=" d-block col-sm-6">{this.state.transactionDetailAPIData?.datetime}</span></label></div>
         </li>
         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between">
               <span class=" col-sm-6">Product Image:</span><span class=" d-block col-sm-6">
               {this.state.transactionDetailAPIData?.file_type === 'image' ? 
                        <img src={this.state.transactionDetailAPIData?.image === null || this.state.transactionDetailAPIData?.image === '' || this.state.transactionDetailAPIData?.image === undefined 
                        ? 'images/noimage.png' 
                        :
                        `${config.imageUrl}${this.state.transactionDetailAPIData?.image}`} style={{width:'100px',height:'98px'}} alt=""/>:
                        this.state.transactionDetailAPIData?.file_type === 'video' ?
                        <a href={`${config.imageUrl}${this.state.transactionDetailAPIData?.image}`} target="_blank">
                            <img className="video-css" src="images/youtube-logo2.jpg"/>
                        </a>:
                        this.state.transactionDetailAPIData?.file_type === 'audio' ?
                        <a href={`${config.imageUrl}${this.state.transactionDetailAPIData?.image}`} target="_blank">
                            <img className="video-css" src="images/pngtree-high-sound-vector-icon-png-image_470307.jpg"/>
                        </a>:''
   }
                  </span></label></div>
         </li>
         <li class="list-group-item list-group-item-action">
            <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">Status:</span><span class=" d-block col-sm-6">{this.state.transactionDetailAPIData?.status}</span></label></div>
         </li>
        
         {this.state.transactionDetailAPIData?.transfer_hash === null || this.state.transactionDetailAPIData?.transfer_hash === undefined || this.state.transactionDetailAPIData?.transfer_hash === '' || this.state.transactionDetailAPIData?.status === 'Pending'
         ?'':   
         <li class="list-group-item list-group-item-action">
         <div class="n-chk"><label class="new-control new-checkbox pl-0 w-100 justify-content-between"><span class=" col-sm-6">Blockchain View:</span><span class=" d-block col-sm-6"><a href={this.state.transactionDetailAPIData?.transfer_hash} target="_blank" class="link"><button class="btn btn-primary">Blockchain View</button></a></span></label></div>
      </li>   
      }

      </ul>
   </div>
   <div class="col-sm-2"></div>
</div>

                        </div>
                        
                            </div>
                        
                        </div>
                     </div>
                  </div>
               </div>
               <br /><br />
            </body>
            <Footer />
         </>
      )
   }
}