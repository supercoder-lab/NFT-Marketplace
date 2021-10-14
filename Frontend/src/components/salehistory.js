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
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const headers = {
    'Content-Type': 'application/json'
 };

export default class salehistory extends Component {

    constructor(props) {
        super(props)
		this.loginData = (!Cookies.get('loginSuccess'))? [] : JSON.parse(Cookies.get('loginSuccess'));
      this.state = {
         talentStatusAPIData:'',
         getUserPurchaseData:[],
         defaultActive:'Price',
         selectedBid:[]

      }
      
this.columns1 = [
   {
       key: "Image",
       text: "Image",
       cell: (item) => {
            return (
               <a className="weak mr-2 d-inlne-block" href={`${config.imageUrl}${item.image}`}
               target="_blank">
               <img src="images/youtube-logo2.jpg" style={{width:'60px',height:'60px',borderRadius:'60px'}}/>
            </a>
         );
     }
   },
   {
       key: "item_name",
       text: "Name",
       sortable: true,
   },
   {
          key: "creator",
          text: "Creation",
          
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
   
},

{
   key: "Action",
   text: "Action",
   cell: (item) => {
      return (
         <>
          {item.transfer_hash === null || item.transfer_hash === '' || item.transfer_hash === undefined ? '' :
                <a target="_blank" href={item.transfer_hash} style={{textTransform:'inherit'}} className="btn btn-primary">Blockchain View</a>}

      
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
   
   
}
            
   componentDidMount() {
      this.talentStatusAPI()
      this.getUserPurchaseAPI()
      if(Cookies.get('paymentFor')){
      this.setState({
         defaultActive:Cookies.get('paymentFor')
      })
      Cookies.set('paymentFor','')
   }
      
   }

async getUserPurchaseAPI() {
   await axios({
      method: 'post',
      url: `${config.apiUrl}getUserSale`,
      data: { "user_id": this.loginData?.data?.id }
   })
      .then(result => {
         if (result.data.success === true) {
            this.setState({
               getUserPurchaseData: result.data.response,
               
            })
         }
         else if (result.data.success === false) {
         }
      }).catch(err => {
         
      });
   }
   

loading(id){
// alert(id)
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

    render() {
        return (    

            <>
             <Header/>
             <body className="page-login" style={{backgroundColor: "#fff"}}>
             <div id="content-block">
         <div className="container be-detail-container your-purchase-bid">
            <h2 className=" text-white mb-4">Sell History</h2>
            <div className="row">
               <ToastContainer/>
               <div className="left-feild col-xs-12 col-sm-3">
                  <div className="be-vidget">
                     {/* <!-- <h3 className="letf-menu-article">
                        Choose Category
                        </h3> --> */}
                     <div className="creative_filds_block">
                       <ul className="ul nav">
                       {this.state.talentStatusAPIData?.telent_status === 1 ? 
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this,'6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                          :''
                          
                        }
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this,'1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this,'2')} to={`${config.baseUrl}about`}>About</Link></li>
                          <li className="edit-ln active" ><Link onClick={this.loading.bind(this,'3')} to={`${config.baseUrl}salehistory`}>Sell History</Link></li>
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this,'4')} to={`${config.baseUrl}yourpurchase`}>Purchases History</Link></li>
                          {/* <li className="edit-ln" ><Link onClick={this.loading.bind(this,'5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li> */}
                          {/* <li className="edit-ln" ><Link onClick={this.loading.bind(this,'7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li> */}
								{/* <!-- <li className="edit-ln"><a href="#web-references">Web References</a></li> --> */}
							</ul>
                     </div>
                  </div>
               </div>
               <div className="col-xs-12 col-sm-9 yourPurchases" >
                  <div className="tab-wrapper style-1">
                     <div className="tab-nav-wrapper">
                        <div className="nav-tab  clearfix">
                           <div className={`nav-tab-item ${(this.state.defaultActive==='Price')?'active':''}`}>
                              <span>Sell History</span>
                           </div>
                           {/* <div className={`nav-tab-item ${(this.state.defaultActive!=='Price')?'active':''}`}>
                              <span>Bids History</span>
                           </div> */}
                    
                        </div>
                     </div>
                     <div className="tabs-content clearfix">
                        <div className={`tab-info ${(this.state.defaultActive==='Price')?'active':''}`}>
                           <div className="row">
                              <div className="col-ml-12 col-xs-12 col-sm-12" style={{marginTop:'-25px'}}>
                                 <div className="">
                                    <div className="row pt-0">
                                    <div className="col-sm-12 mt-3">
                                      <div className="">
                                     

                                        {this.state.getUserPurchaseData.length === 0 ? 
                                       <div class="col-sm-12 background-shadow p-5">
                              
                                       <div class="row">
                                           <div class="col-sm-12 text-center">
                                               <h5 class="weak">You don't have any collected creations available for sale.</h5>
                                           </div>
                                       </div>
                                       
                                   </div>
                                   :
                                   <ReactDatatable
                                   config={this.config1}
                                   records={this.state.getUserPurchaseData}
                                columns={this.columns1}
                                                        /> 
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
               </div>
            </div>
         </div>
      </div>
      <br/><br/>
                                   
      </body>
             <Footer/>
             </>
        )
    }
}  