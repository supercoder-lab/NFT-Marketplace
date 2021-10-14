import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';

import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ReactDatatable from '@ashvin27/react-datatable'

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const headers = {
   'Content-Type': 'application/json'
};

export default class yourpurchase extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginSuccess')) ? [] : JSON.parse(Cookies.get('loginSuccess'));
      
      this.state = {
         ConnectWalletAddress: this.loginData?.data?.user_address,
         talentStatusAPIData: '',
         getUserBidsData: [],
         getUserPurchaseData: [],
         defaultActive: 'Price',
         transactionDetailAPIData: [],
         sellItem: [],
         resellBtnText: false,
         paymentShow: 0,
         loaderShow: false,
         etherClickActive: 0,
         cardNumber: '',
         expMonth: '',
         expYear: '',
         cvc: '',
         errorMessageSripe: '',
         loadingStripe: 0,
         getData:''
      }


      this.columns1 = [
         {
            key: "Image",
            text: "Image",
            cell: (item) => {
               return (
                  <Link className="weak mr-2 d-inlne-block" to={`${config.baseUrl}itemdetails/${item.item_edition_id}`}
                     target="_blank">
                     {item.file_type === 'image' ?
                        <img src={item.image === null || item.image === '' || item.image === undefined
                           ? 'images/team2.jpg'
                           :
                           `${config.imageUrl}${item.image}`} style={{ width: '60px', height: '60px', borderRadius: '60px' }} /> :
                        item.file_type === 'video' ?
                           <a href={`${config.imageUrl}${item.image}`} target="_blank">
                              <img className="video-css" src="images/youtube-logo2.jpg" />
                           </a> :
                           <a href={`${config.imageUrl}${item.image}`} target="_blank">
                              <img className="video-css" src="images/pngtree-high-sound-vector-icon-png-image_470307.jpg" />
                           </a>
                     }

                  </Link>
               );
            }
         },
         {
            key: "item_name",
            text: "Name",
            sortable: true,
            cell: (item) => {
               return (
                  <>
                  <span> {item.item_name}</span><br/>
                  {/* <span>Edition: {item.edition_text}</span> */}
                  </>
               );
            }
         },
         {
            key: "creator",
            text: "Creator",

         },
         {
            key: "price",
            text: "Amount",

            cell: (item) => {
               return (
                  <span>{item.price} VUL</span>
               );
            }
         },

         {
            key: "purchase_datetime",
            text: "Date",
            cell: (item) => {
               return (
              

                     <span> {item.purchase_datetime}</span>
                 
               );
            }
         },

         
         {
            key: "Action",
            text: "Action",
            cell: (item) => {
               return (
                  <>
                     {item.transfer_hash === null || item.transfer_hash === '' || item.transfer_hash === undefined ? '' :
                        <a target="_blank" href={item.transfer_hash} style={{ textTransform: 'inherit' }} className="btn btn-primary">Blockchain View</a>

                     }
                     <Link to={`${config.baseUrl}purchasedetail/${item.transaction_id}`} target="_blank" style={{ textTransform: 'inherit' }} className="btn btn-primary">Detail</Link>
                  </>
               );
            }
         },
      ]

      this.config1 = {
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

      this.onChange = this.onChange.bind(this)      
      
   }

   componentDidMount() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getUserPurchaseAPI()
      
      if (Cookies.get('cryptoPaiment')) {
         if (Cookies.get('cryptoPaiment') === 'success') {
            this.resellSubmitFinal(Cookies.get('resellApiData'));
         } else {
            this.cryptoPaymentFailed();
         }
         Cookies.set('resellItemItemProcess','');
         Cookies.set('resellApiData','');
         Cookies.set('cryptoPaiment', '');
      }

   }

   onChange = e => {
      this.setState({
         [e.target.name]: e.target.value
      })
   }

   async getUserPurchaseAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserPurchase`,
         data: { "user_id": this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getData:result.data,
                  getUserPurchaseData: result.data.response,

               })
               
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
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


   render() {
      return (

         <>
            <Header />
            <body className="page-login" style={{ backgroundColor: "#fff" }}>
               <ToastContainer />
               <div id="content-block">
                  <div className="container be-detail-container your-purchase-bid">
                     <h2 className=" text-white mb-4">Your Purchases</h2>
                     <div className="row">
                        <div className="left-feild col-xs-12 col-sm-3">
                           <div className="be-vidget">
                              <div className="creative_filds_block">
                                 <ul className="ul nav">
                                    {this.state.talentStatusAPIData?.telent_status === 1 ?
                                       <li className="edit-ln" ><Link onClick={this.loading.bind(this, '6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                                       : ''

                                    }
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sell History</Link></li>
                                    <li className="edit-ln active" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Purchases History</Link></li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                        <div className="col-xs-12 col-sm-9 yourPurchases" >
                           <div className="tab-wrapper style-1">
                              <div className="tab-nav-wrapper">
                                 <div className="nav-tab  clearfix">
                                    <div className={`nav-tab-item ${(this.state.defaultActive === 'Price') ? 'active' : ''}`}>
                                       <span>Your Purchases</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="tabs-content clearfix">
                                 <div className={`tab-info ${(this.state.defaultActive === 'Price') ? 'active' : ''}`}>
                                    <div className="row">
                                       <div className="col-ml-12 col-xs-12 col-sm-12" style={{ marginTop: '-25px' }}>
                                          <div className="">
                                             <div className="row pt-0">
                                                <div className="col-sm-12 mt-3">
                                                   <div className="table-responsive" style={{ border: 'none' }}>
                                                      {this.state.getUserPurchaseData.length === 0 ?
                                                         <div className="col-sm-12 background-shadow p-5">

                                                            <div className="row">
                                                               <div className="col-sm-12 text-center">
                                                                  <h5 className="weak">You don't have any collected creations available for Purchase.</h5>
                                                               </div>
                                                            </div>

                                                         </div> :
                                                         <ReactDatatable
                                                            config={this.config1}
                                                            records={this.state.getUserPurchaseData}
                                                            columns={this.columns1}
                                                         />}
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
               </div>
               <br /><br />
            </body>
            <Footer />


         </>
      )
   }
}