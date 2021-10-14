import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
// import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
// import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-date-picker';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import Loader from "react-loader-spinner";
import Web3 from 'web3';
import Countdown,{zeroPad} from 'react-countdown';


const headers = {
   'Content-Type': 'application/json'
};

export default class featurescreator extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginSuccess')) ? [] : JSON.parse(Cookies.get('loginSuccess'))
      

      const { match: { params } } = this.props;
      this.user_id = params.user_id
      // alert(this.user_id)
      this.state = {
         user_id: this.loginData?.data?.id,
         ConnectWalletAddress: this.loginData?.data?.user_address,
         getListUser: '',
         activeBtn: '0',
         nameCollection: '',
         descriptionCollection: '',
         getUserCollectionData: [],
         name: '',
         description: '',
         image: '',
         item_category_id: '',
         price: '',
         user_collection_id: '',
         start_date: '',
         // end_date : '',
         getcategoryData: [],
         image_file: null,
         image_preview: '',
         collectionDataArray: [],
         sell_type: '',
         dateShow: 0,
         nameError: '',
         categoryNameError: '',
         collectionNameError: '',
         sellTypeError: '',
         edition_type: '',
         editionTypeError: '',
         priceError: '',
         descriptionError: '',
         imageError: '',
         spinLoader: '0',
         collectionOpen: 0,
         productOpen: 1,
         loaderShow: false,
         nftopen: 0,
         descriptionErrorCollection: '',
         nameErrorCollection: '',
         collectionShow: '',
         expiry_date: '',
         expiry_dateError: '',
         quantity: '',
         quantityError: '',
         collectionName: '',
         getSingleUserCollectionData: '',
         deleteShow: '',
         alertShow: '',
         file_type: '',
         paymentShow: 0,
         etherClickActive: 0,
         cardNumber: '',
         expMonth: '',
         expYear: '',
         cvc: '',
         errorMessageSripe: '',
         loadingStripe: 0,
         image_type:''
      }
      this.submitForm = this.submitForm.bind(this)
      this.nftAdd = this.nftAdd.bind(this)
      this.onChange = this.onChange.bind(this)
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeExpiry = this.handleChangeExpiry.bind(this)
      this.handleChangeCollection = this.handleChangeCollection.bind(this);

   }


   handleChangeCollection = event => {
      event.preventDefault()
      let value = event.target.value;
      this.setState(prevState => ({
         getSingleUserCollectionData: { ...prevState.getSingleUserCollectionData, [event.target.name]: value }
      }))
   }

   handleChange(date) {
      // alert(date)
      // var gg = date.setDate(date.getDate() - 1)
      // // alert(new Date(gg))
      this.setState({
         // start_date: new Date(date).setDate(new Date(date).getDate() + 1)
         start_date: date
      })
      // alert(this.state.start_date)
   }


   handleChangeExpiry(date) {
      // alert(date)
      this.setState({
         // start_date: new Date(date).setDate(new Date(date).getDate() + 1)
         expiry_date: date
      })
      
   }

   componentDidMount() {
      
      this.getUserDetailsAPI()
      if (this.loginData?.data?.id != this.user_id) {
         this.getViewCountAPI()
      }

      this.getUserCollectionsAPI()
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getcategoryAPI()
      this.collectionAPI()

      if (Cookies.get('create_item_process')) {
         if (Cookies.get('cryptoPaiment') === 'success') {
            this.paymentShowAPI(JSON.parse(Cookies.get('create_item_data')));
            Cookies.set('cryptoPaiment', '');
            Cookies.set('create_item_process', '');
            // this.cryptoPaymentSucces();
         } else {
            this.cryptoPaymentFailed();
         }
         Cookies.set('cryptoPaiment', '');
         Cookies.set('create_item_process', '');
      }
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
         toast.error(`Please install MetaMask to use this dApp!`, {
            position: toast.POSITION.TOP_CENTER
         });
      }
   }

   onChange = e => {
      this.setState({
         [e.target.name]: e.target.value
      })
      if (e.target.checked === true && e.target.type === 'checkbox') {
         this.setState({
            dateShow: 1
         })
      }
      else if (e.target.checked === false && e.target.type === 'checkbox') {
         this.setState({
            dateShow: 0
         })
      }
   }


   validate = () => {
      let nameError = ""
      let categoryNameError = '';
      let collectionNameError = '';
      let sellTypeError = '';
      let priceError = '';
      let descriptionError = '';
      let imageError = '';
      let expiry_dateError = ''
      let quantityError = ''
      let editionTypeError = ''
      if (this.state.name === '') {
         nameError = "Title is required"
      }
      if (this.state.item_category_id === '') {
         categoryNameError = "Category is required"
      }
      if (this.state.user_collection_id === '') {
         collectionNameError = "Collection name is required"
      }
      // if (this.state.sell_type === '') {
      //    sellTypeError = "Sell type is required"
      // }
      if (this.state.price === '') {
         priceError = "Price is required"
      }
      if (this.state.description === '') {
         descriptionError = "Description is required"
      }
      if (this.state.image_file === null) {
         imageError = "Image is required"
      }
      if (this.state.expiry_date === '') {
         expiry_dateError = "Expiry date is rquired"
      }
      // if (this.state.quantity === '') {
      //    quantityError = "Quantity is rquired"
      // }
      // if (this.state.edition_type === '') {
      //    editionTypeError = "Edition Type is rquired"
      // }
      if (nameError || categoryNameError || collectionNameError || priceError || descriptionError || imageError || expiry_dateError) {
         this.setState({
            nameError, categoryNameError, collectionNameError, priceError, descriptionError, imageError, expiry_dateError
         })
         return false
      }
      return true
   }


   validate1 = () => {
      let nameErrorCollection = ""
      let descriptionErrorCollection = '';
      if (this.state.nameCollection === '') {
         nameErrorCollection = "Collection name is required"
      }
      if (this.state.descriptionCollection === '') {
         descriptionErrorCollection = "Description is required"
      }

      if (nameErrorCollection || descriptionErrorCollection) {
         this.setState({
            nameErrorCollection, descriptionErrorCollection
         })
         return false
      }
      return true
   }


   //=======================================  User details  =====================

   async getUserDetailsAPI() {
      // alert('32')
      let User;
      if (this.loginData.data?.id === undefined || this.loginData.length === 0) {
         User = '0'
      }
      else {
         User = this.loginData.data?.id
      }
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserDetail`,
         data: { "user_id": User, "following_id": this.user_id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getListUser: result.data.response,
               })
               if (this.state.getListUser.wallet_balance_usd === null) {
                  this.state.getListUser.wallet_balance_usd = 0
               }

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   //=======================================  View count  =====================

   async getViewCountAPI() {
      let User;
      if (this.loginData.data?.id === undefined) {
         User = '0'
      }
      else {
         User = this.loginData.data?.id
      }
      await axios({
         method: 'post',
         url: `${config.apiUrl}insertView`,
         data: { "user_id": this.user_id, "viewer_id": User }
      })
         .then(result => {
            if (result.data.success === true) {
               this.getUserDetailsAPI()
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }
   //=========================================  Follow/Unfollow API   ==============

   async followAPI(id) {
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      await axios({
         method: 'post',
         url: `${config.apiUrl}follow`,
         data: { "follower_id": this.loginData.data?.id, 'following_id': this.user_id }
      })
         .then(result => {
            if (result.data.success === true) {
               // toast.success(result.data.msg, {
               //    position: toast.POSITION.TOP_CENTER , 
               //    })
               this.getUserDetailsAPI()

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   //=======================================  getUserCollection  =====================

   async getUserCollectionsAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserCollection`,
         data: { "user_id": this.user_id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getUserCollectionData: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
            this.setState({
               collectionShow: 1
            })
         });
   }


   loginCheck() {
      //  console.log(this.loginData)
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      else {
         window.location.href = `${config.baseUrl}about`

      }
      // `${config.baseUrl}createyourownnfts`
   }

   async submitForm(e) {
      e.preventDefault()
      const isValid = this.validate1()
      if (!isValid) {
      }
      else {
         await axios({
            method: 'post',
            url: `${config.apiUrl}insertUserCollection`,
            headers: { "Authorization": this.loginData?.Token },
            data: {"email":this.loginData.data.user_email, "user_id": this.loginData?.data?.id, "name": this.state.nameCollection, "description": this.state.descriptionCollection }
         })
            .then(result => {
               if (result.data.success === true) {
                  toast.success(result.data.msg, {
                     position: toast.POSITION.TOP_CENTER,
                  })
                  // this.setState({
                  //    productOpen:1,
                  // })
                  window.location.reload()
               }
               else if (result.data.success === false) {

               }
            }).catch(err => {

            });

      }

   }

   async getcategoryAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getDigitalCategory`,
         headers: { "Authorization": this.loginData.Token },
      }).then(response => {
         if (response.data.success === true) {
            this.setState({
               getcategoryData: response.data?.response
            })
         }
      })
   }


   handleImagePreview = (e) => {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      let file_type = '';
      
      if (image_as_files.type.indexOf('image') === 0) {
         file_type = 'image';
      } else if (image_as_files.type.indexOf('video') === 0) {
         file_type = 'video';
      }
      else if (image_as_files.type.indexOf('audio') === 0) {
         file_type = 'audio';
      }

      this.setState({
         image_preview: image_as_base64,
         image_file: image_as_files,
         file_type: file_type,
         image_type:e.target.files[0].type
      })


   }


   async nftAdd(e) {
      e.preventDefault()

      if (this.state.edition_type === '2') {
         this.state.quantity = 0
      }
      const isValid = this.validate()
      if (!isValid) {
         this.setState({
            spinLoader: '0'
         })
      }
      else {

         // this.setState({
         //    paymentShow: 1
         // })

         let formData1 = new FormData();
         this.setState({
            spinLoader: '1',
            loadingStripe: 1,
            loaderShow: true
         })
            
            // API_Data.user_address = this.state.ConnectWalletAddress;
            
            formData1.append('file', this.state.image_file);
            var API_Data = {};
   
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            var resIPF = await axios.post(url,
               formData1,
               {
                  headers: {
                     'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                     'pinata_api_key': 'b26a087893e3f0033bbf',
                     'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                  }
               }
            );
            var myDate = new Date(this.state.expiry_date);
            var myDate1 = new Date(this.state.start_date);
   
            
            
            API_Data.description = this.state.description;
            API_Data.expiry_date = new Date(myDate.getUTCFullYear(), myDate.getUTCMonth(), myDate.getUTCDate()+2);
            API_Data.file_type = this.state.file_type;
            API_Data.image_type = this.state.image_type;
            API_Data.image = resIPF.data.IpfsHash;
            // API_Data.image = "QmWMc4nWmVz6KpjPucYaRRgAdyvgjrBP43RvAk1cN5rtKe";
            API_Data.item_category_id = this.state.item_category_id;
            API_Data.user_collection_id = this.state.user_collection_id;
            API_Data.name = this.state.name;
            API_Data.price = this.state.price;
            // API_Data.quantity = this.state.quantity;
            // API_Data.sell_type = this.state.sell_type;
            API_Data.sell_type = 1;
            API_Data.quantity = 1;
            API_Data.start_date = new Date(myDate1.getUTCFullYear(), myDate1.getUTCMonth(), myDate1.getUTCDate()+2);
            // API_Data.edition_type = this.state.edition_type;
            API_Data.edition_type = 1;
            API_Data.user_id = this.loginData.data.id;
            API_Data.user_address = this.state.ConnectWalletAddress;
            API_Data.email = this.loginData.data.user_email;
   
         axios({
            method: 'post',
            url: `${config.apiUrl}addNftByUser`,
            headers: { "Authorization": this.loginData.Token },
            data: API_Data
         })
            .then(async response => {
   
   
               if (response.data.success === true) {
   
                  // this.cryptoPaymentSucces();      
                  var willSearch = await Swal.fire({
                     // title: 'Payment successful!',
                     text: 'Congratulations, NFT has been created successfully.',
                     icon: 'success',
                     width: 500,
                     confirmButtonColor: '#3085d6',
                     allowOutsideClick: false,
                     confirmButtonText: 'View NFT',
                  });
                  this.setState({
                     loaderShow: false,
               loadingStripe: 0
   
                  })
                  window.location.href = `${config.baseUrl}itemdetails/${response.data.item_edition_id}`
   
               }
   
               else if (response.data.success === false) {
                  toast.error(response.data.msg, {
                     position: toast.POSITION.TOP_CENTER
                  });
                  this.setState({
                     spinLoader: '0',
                     loaderShow: false,
               loadingStripe: 0,
                  })
               }
            })
            .catch(err => {
               toast.error(err?.response?.data?.msg, {
                  position: toast.POSITION.TOP_CENTER
               });
               this.setState({
                  spinLoader: '0'
               })
   
            })

      }

   }

   collectionAPI(id, item) {
      
      if (id === undefined || id === '0') {
         id = 0
         this.setState({
            collectionName: ''
         })
      }
      this.setState({
         activeBtn: id,
         collectionName: item
      })
      axios({
         method: 'post',
         url: `${config.apiUrl}getUserItem`,
         headers: { "Authorization": this.loginData.Token },
         data: { 'user_collection_id': id, 'user_id': this.user_id, 'limit': 0 }
      })
         .then(response => {


            if (response.data.success === true) {
               this.setState({
                  collectionDataArray: response.data.response,
                  deleteShow: ''
               })
            }

            else if (response.data.success === false) {
               this.setState({
                  collectionDataArray: [],
                  deleteShow: 1
               })
            }
         })
         .catch(err => {
            this.setState({
               collectionDataArray: [],
               deleteShow: 1

            })
         })
   }

   loading() {
      setTimeout(() => {
         window.location.reload()
      });
   }


   openDiv(id) {
      if (id === 'collection') {
         this.setState({
            collectionOpen: 1,
            productOpen: 0,
            nftopen: 0,
            nameError: '',
            categoryNameError: '',
            collectionNameError: '',
            sellTypeError: '',
            priceError: '',
            descriptionError: '',
            imageError: ''
         })
      }
      else if (id === 'NFTs') {
         this.setState({
            collectionOpen: 0,
            productOpen: 0,
            nftopen: 1,
            nameErrorCollection: '',
            descriptionErrorCollection: ''
         })
      }
   }


   async editCollectionAPI(id) {
      
      await axios({
         method: 'post',
         url: `${config.apiUrl}getSingleUserCollection`,
         headers: { "Authorization": this.loginData.Token },
         data: { 'user_id': id.user_id, "collection_id": id.collection_id }
      }).then(response => {
         if (response.data.success === true) {
            this.setState({
               getSingleUserCollectionData: response.data?.response
            })

         }
      })
   }


   async updateCollection(e) {
      e.preventDefault()
      await axios({
         method: 'post',
         url: `${config.apiUrl}updateUserCollection`,
         headers: { "Authorization": this.loginData.Token },
         data: this.state.getSingleUserCollectionData
      }).then(response => {
         if (response.data.success === true) {
            toast.success(response.data.msg, {
               position: toast.POSITION.TOP_CENTER
            });
            // this.setState({
            //    productOpen:1,
            // })
            window.location.reload()
         }
      })
   }


   //==========================================  Delete collection  ================================

   collectionDelete = (id) => {
      
      this.setState({
         alertShow: 1
      })
      confirmAlert({
         title: 'Confirm to submit',
         message: 'Are you sure to delete this.',
         buttons: [
            {
               label: 'Yes',
               onClick: () =>
                  axios({
                     method: 'post',
                     url: `${config.apiUrl}deleteUserCollection`,
                     headers: { "Authorization": this.loginData?.Token },
                     data: {"email":this.loginData.data.user_email, "user_id": id.user_id, "collection_id": id.collection_id }
                  })
                     .then((response) => {
                        if (response.data.success === true) {
                           toast.success(response.data.msg, {
                              position: toast.POSITION.TOP_CENTER
                           });
                           // this.setState({
                           //    productOpen:1,
                           // })
                           window.location.reload()
                        }

                     }).catch((error) => {
                     })
            },
            {
               label: 'No',
            }
         ]
      });
   }

   formatInput = (e) => {
      // Prevent characters that are not numbers ("e", ".", "+" & "-") 
      let checkIfNum;
      if (e.key !== undefined) {
         // Check if it's a "e", ".", "+" or "-"
         checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
      }
      else if (e.keyCode !== undefined) {
         // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
         checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
      }
      return checkIfNum && e.preventDefault();
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





   render() {
      return (

         <>
            <Header />
            <div id="content-block">


               <div className="container-fluid custom-container pl-0 pr-0">
                  <ToastContainer />
                  <br />
                  <div className="container-fluid custom-container feature-creator pl-0 pr-0">
                     <div className="container pl-0 pr-0">
                        <div className="row">
                           <div className="col-md-6">
                              <div className="col-sm-3">
                                 <a className="" id="navbar_store_logo" mptrackaction="store:navbar:logo" data-storeid="angelarium" href="javascript:void(0)">
                                    <div className="img_wrp">
                                       {this.state?.getListUser?.profile_pic === '' || this.state?.getListUser?.profile_pic === null || this.state?.getListUser?.profile_pic === undefined ?
                                          <img style={{ height: '96px', width: '96px' }} src='images/noimage.png' />
                                          : <img style={{ height: '96px', width: '96px' }} src={`${config.imageUrl1}${this.state?.getListUser?.profile_pic}`} />
                                       }
                                    </div>
                                 </a>
                              </div>
                              <div className="col-sm-9">
                                 <div className="follow-banner row ml-0 pl-lg-1">
                                    <div className="col-12 mb-2 pl-lg-2">
                                       <a mptrackaction="store:navbar:logo" data-storeid="angelarium" href="javascript:void(0)">
                                          <h3 className="follow-exp mt-1 mt-md-0 mb-0 ">
                                             {this.state.getListUser?.full_name}
                                          </h3>
                                       </a>
                                    </div>
                                    <div className="col-12 mb-2 pl-md-2 pl-0 pt-1 pt-md-0">
                                       <a href="javascript:void(0)" className="all_followers"><span className="follower_count">{this.state?.getListUser?.follower_count}</span> Followers</a> &nbsp;
                                       <a href="javascript:void(0)" className="all_following"><span className="following_count">{this.state.getListUser?.folling_count}</span> Following</a> &nbsp;
                                       <a href="javascript:void(0)" className="learn-more-tooltip " data-toggle="tooltip" >{this.state.getListUser?.view_count} Views</a>

                                    </div>

                                    {this.loginData?.data?.id == this.user_id
                                       ? ''
                                       :
                                       <div className="col-12 pl-md-2 pl-0 pt-1 pt-md-0">
                                          <form method="POST" className="user_follow_form">
                                             <input type="hidden" name="csrfmiddlewaretoken" value="" />
                                             <input type="hidden" name="delete" className="delete-follow" value="0" />
                                             {this.state.getListUser?.is_follow === 0
                                                ?
                                                <button type="button" className="btn size-1 color-5 " onClick={this.followAPI.bind(this, 'follow')}>Follow</button>
                                                :
                                                <button type="button" className="btn size-1 color-5 " onClick={this.followAPI.bind(this, 'unfollow')}>Unfollow</button>
                                             }
                                          </form>
                                       </div>
                                    }
                                 </div>
                              </div>
                           </div>
                           <div className="col-md-6 text-right">
                              <div className="mt-5">
                                 {this.loginData?.data?.id == this.user_id
                                    ?
                                    <>
                                             <div style={{ textTransform: 'inherit' }} className="new-collection text-white pull-right btn btn-primary" data-toggle="modal" data-target="#add-collection">
                                                <span>Create NFT</span>
                                             </div>

                                    </> : ''

                                 }
                              </div>
                           </div>
                        </div>


                        {/* //=================  Add new collcetion  ================= */}

                        {this.state.collectionOpen === 1 ?
                           <div className="col-sm-12">
                              <div className="row">
                                 <div className="col-md-12">
                                    <hr />
                                 </div>

                                 <div className="col-md-2"></div>
                                 <div className="col-md-8">
                                    <br />
                                    <h3 className="text-center w-100 text-white">Add a New Collection</h3>
                                    <form id="add_category_form" onSubmit={this.submitForm} >
                                       <div className="row p-3">
                                          <div className="col-12 px-3 d-none error-message">
                                             <div className="alert alert-danger mb-3 error-message-content" role="alert">
                                             </div>
                                          </div>

                                          <div className="col-12 mb-3">
                                             <div className="form-group">
                                                <input className="form-input" type="text" name="nameCollection" placeholder="Collection Name"
                                                   onChange={this.onChange} value={this.state.nameCollection} />
                                                <span className="error-asterick"> {this.state.nameErrorCollection}</span>

                                             </div>
                                          </div>
                                          <div className="input-col col-12 mb-3">
                                             <div className="form-group focus-2 mb-0">
                                                <textarea className="form-input" onChange={this.onChange} value={this.state.descriptionCollection}
                                                   name="descriptionCollection" placeholder="Description"></textarea>
                                                <span className="error-asterick"> {this.state.descriptionErrorCollection}</span>

                                             </div>
                                          </div>


                                          <div className="col-12">

                                             <input type="submit" className="btn-primary btn size-1 col-sm-12 btn-lg" value="Add" />

                                          </div>
                                       </div>

                                       <input type="hidden" name="category_type" value="2" />
                                       <input type="hidden" id="add_category_url" value="/store/categories/" />
                                    </form>

                                 </div>
                                 <div className="col-md-2"></div>
                              </div>
                           </div>
                           : ''
                        }



                        {/* //=========================  Add product  ====================== */}



                        {/* //========================== product list  =========================== */}


                        {/* {this.state.productOpen === 1 ?  */}
                        <div className="col-md-12">
                           <br />
                           <div className="tab-wrapper style-1">
                              <div className="tab-nav-wrapper">
                                 <div className="nav-tab  clearfix scrollmenu">
                                    {this.loginData?.data?.id == this.user_id
                                       ?
                                       <>
                                          {/* onClick={this.openDiv.bind(this,'collection')} */}
                                          <div style={{ textTransform: 'inherit' }} className="new-collection text-white" data-toggle="modal" data-target="#new-collection">
                                             <span>+ New Collection</span>
                                          </div>
                                          {/* <div style={{textTransform:'inherit'}} onClick={this.openDiv.bind(this,'NFTs')} className="new-collection text-white btn btn-primary" data-toggle="modal" data-target="#add-collection">
                              <span>Create NFTs</span>
                           </div> */}
                                       </> : ''

                                    }



                                    <div className={`nav-tab-item ${(this.state?.activeBtn == '0') ? `active` : ``} `}>
                                       <span onClick={this.collectionAPI.bind(this, '0')}>All</span>
                                    </div>
                                    {this.state.getUserCollectionData.map(item => (
                                       <div className={`nav-tab-item ${(this.state?.activeBtn == item.collection_id) ? `active` : ``} `} onClick={this.collectionAPI.bind(this, item.collection_id, item)}>
                                          <span>{item.name}</span>
                                       </div>
                                    ))}

                                 </div>
                              </div>
                              <div className="tabs-content clearfix">
                                 <div className="tab-info active" style={{ display: "block" }}>
                                    {this.loginData?.data?.id == this.user_id ?
                                       <h4 className="text-white text-center" style={{ display: this.state.collectionName?.name === '' || this.state.collectionName?.name === undefined ? 'none' : 'block' }}>{this.state.collectionName?.name} &nbsp;
                                          <i class="fa fa-pencil pencilcollection" onClick={this.editCollectionAPI.bind(this, this.state.collectionName)} data-toggle="modal" data-target="#edit-collection" style={{ display: this.state.collectionName?.name === '' || this.state.collectionName?.name === undefined ? 'none' : 'contents' }}></i>
                                       </h4> : ''
                                    }

                                    <div className=" custom-container ">
                                       <div className="container hot-bid">
                                          <div className="row">

                                             <div className="col-md-12">
                                                <br />
                                                <div className="row _post-container_">
                                                   {this.state.collectionDataArray.length === 0 ? <h3 className="text-center">No Item in this Collection.</h3>
                                                      : this.state.collectionDataArray.map(item => (
                                                         <div className="category-2 mix col-md-4">
                                                            <div className="be-post">
                                                            {item.is_sold === 0 ? 
                                                                  '':
                                                                  <div className="soldOut">
                                                                  <img src="images/sold.png"/>
                                                               </div>
                                                               }
                                                               <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                                                  {item.file_type === 'audio' ?
                                                                     <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                  }

                                                                  {item.file_type === 'image' ?
                                                                     <img src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                                     item.file_type === 'video' ?
                                                                        <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} /> :
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
                                                                  <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title" style={{ display: "inline" }}>{item.name}</Link>
                                                                  <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title price">$ {item.price}</Link>
                                                               </div>
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
                                 <br />
                                 

                              </div>
                           </div>
                        </div>
                        {/* :''
} */}



                     </div>
                  </div>
               </div>


            </div>
            <br />
            {/* </div> */}


            {/* // modalS */}

            <div id="new-collection" className="modal fade" role="dialog" style={{ display: "none" }} style={{ background: 'rgb(6, 6, 6)' }}
               data-backdrop="false" aria-hidden="false">
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                     <div className="modal-header">
                        <h4 className="modal-title  text-center w-100">Add a New Collection</h4>
                        <button type="button" className="close" onClick={this.loading.bind(this)} data-dismiss="modal">×</button>
                     </div>
                     <form id="add_category_form" onSubmit={this.submitForm} >
                        <div className="row p-3">
                           <div className="col-12 px-3 d-none error-message">
                              <div className="alert alert-danger mb-3 error-message-content" role="alert">
                              </div>
                           </div>

                           <div className="col-12 mb-3">
                              <div className="form-group">
                                 <input className="form-input" type="text" name="nameCollection" placeholder="Collection Name"
                                    onChange={this.onChange} value={this.state.nameCollection} />
                                 <span className="error-asterick"> {this.state.nameErrorCollection}</span>

                              </div>
                           </div>
                           <div className="input-col col-12 mb-3">
                              <div className="form-group focus-2 mb-0">
                                 <textarea className="form-input" onChange={this.onChange} value={this.state.descriptionCollection}
                                    name="descriptionCollection" placeholder="Description"></textarea>
                                 <span className="error-asterick"> {this.state.descriptionErrorCollection}</span>

                              </div>
                           </div>


                           <div className="col-12">

                              <input type="submit" className="btn-primary btn size-1 col-sm-12 btn-lg" value="Add" />

                           </div>
                        </div>

                        <input type="hidden" name="category_type" value="2" />
                        <input type="hidden" id="add_category_url" value="/store/categories/" />
                     </form>

                  </div>
               </div>
            </div>

            <div id="add-collection" className="modal fade" role="dialog" style={{ display: "none" }} aria-hidden="true" data-backdrop="false" style={{ background: 'rgb(6, 6, 6)' }}
               data-backdrop="false">
               <div className="modal-dialog modal-dialog-centered modal-md">
                  <div className="modal-content">
                     <div className="modal-header">
                        <h4 className="modal-title  text-center w-100">Add NFT </h4>
                        <button type="button" onClick={this.loading.bind(this)} className="close" data-dismiss="modal">×</button>
                     </div>
                     <div className="">

                        {this.state.paymentShow === 0 ?


                           <div className="p-5">
                              <div className="row">
                                 <div className="input-col col-xs-12 col-sm-6">
                                    <div className="form-group focus-2 audioNft" style={{ marginTop: this.state.file_type == 'video' ? '26px' : '' }}>

                                       {this.state.image_preview === '' ?
                                          <img src="images/logo-new.png" style={{ height: '115px', width: '115px', objectFit: 'contain' }} alt="" className="btn-rounded" />
                                          :
                                          this.state.file_type == 'image' ?
                                             <img src={this.state.image_preview} style={{ height: '115px', width: '115px' }} alt="" className="btn-rounded" /> :
                                             this.state.file_type == 'video' ?
                                                <Player className="preview_image_data" src={(this.state.image_preview)} /> :
                                                <ReactAudioPlayer
                                                   src={(this.state.image_preview)}

                                                   controls
                                                />
                                       }


                                    </div>
                                 </div>
                                 <div className="input-col col-xs-12 col-sm-6 image-uploaddata">
                                    <div className="form-group focus-2">



                                       <br />
                                       <input className="form-input" type="file" accept=".mp4" onChange={this.handleImagePreview} style={{ marginTop: '10px' }} />
                                       <p>(mp4)</p>
                                       <span className="error-asterick"> {this.state.imageError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                       <div className="form-label">Title <span className="error-asterick">*</span></div>
                                       <input className="form-input" type="text" value={this.state.name} name="name"
                                          onChange={this.onChange} placeholder="Title" />
                                       <span className="error-asterick"> {this.state.nameError}</span>

                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6">
                                    <div className="form-group fg_icon focus-2">
                                       <div className="form-label">Category Name <span className="error-asterick">*</span></div>
                                       <select className="" name="item_category_id" onChange={this.onChange}
                                          value={this.state.item_category_id} className="form-input" >
                                          <option selected="selected" value="">Select Category</option>

                                          {this.state.getcategoryData.map(item => (
                                             <option value={item.id}>{item.name}</option>
                                          ))}
                                       </select>
                                       <span className="error-asterick">  {this.state.categoryNameError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6">
                                    <div className="form-group fg_icon focus-2">
                                       <div className="form-label">Collection Name <span className="error-asterick">*</span></div>
                                       <select className="" name="user_collection_id" onChange={this.onChange}
                                          value={this.state.user_collection_id} className="form-input" >
                                          <option selected="selected" value="">Select Collection</option>
                                          {this.state.getUserCollectionData.map(item => (
                                             <option value={item.collection_id}>{item.name}</option>
                                          ))}
                                       </select>
                                       <span className="error-asterick"> {this.state.collectionNameError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6" style={{display:"none"}}>
                                    <div className="form-group fg_icon focus-2">
                                       <div className="form-label">Sell Type <span className="error-asterick">*</span></div>
                                       <select className="" name="sell_type" onChange={this.onChange}
                                          value={this.state.sell_type} className="form-input"  >
                                          <option selected="selected" value="">Select Type</option>

                                          <option value="1">Price</option>
                                          <option value="2">Auction</option>


                                       </select>
                                       <span className="error-asterick">{this.state.sellTypeError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6" style={{display:"none"}}>
                                    <div className="form-group fg_icon focus-2">
                                       <div className="form-label">Edition Type <span className="error-asterick">*</span></div>
                                       <select className="" name="edition_type" onChange={this.onChange}
                                          value={this.state.edition_type} className="form-input" >
                                          <option selected="selected" value="">Select Type</option>

                                          <option value="1">Limited Edition</option>
                                          <option value="2">Open Edition</option>


                                       </select>
                                       <span className="error-asterick">{this.state.editionTypeError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6">
                                    <div className="form-group focus-2">
                                       <div className="form-label">Token Amount <span className="error-asterick">*</span></div>
                                       <input className="form-input" type="number" value={this.state.price} name="price" placeholder="Token Amount"
                                          onChange={this.onChange} onKeyDown={this.formatInput} />
                                       <span className="error-asterick">{this.state.priceError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6">
                                    <div className="form-group focus-2 description-field">
                                       <div className="form-label">NFT Description <span className="error-asterick">*</span></div>
                                       <textarea className="form-input" value={this.state.description} name="description" placeholder="Description"
                                          onChange={this.onChange}></textarea>
                                       <span className="error-asterick"> {this.state.descriptionError}</span>
                                    </div>
                                 </div>

                                 <div className="input-col col-xs-12 col-sm-6">
                                    <div className="form-group focus-2">
                                       <div className="form-label">Sale ends</div>
                                       <div className="form-group addnftdate">
                                          <DatePicker className="form-control"
                                             onChange={this.handleChangeExpiry}
                                             value={this.state.expiry_date} minDate={new Date()}
                                             name="expiry_date"
                                          />
                                      
                                       </div>
                                    
                                       <span className="error-asterick"> {this.state.expiry_dateError}</span>

                                    </div>
                                 </div>

                                 <div className="input-col col-xs-6 col-sm-6" style={{display:"none"}}>
                                    <div className="form-group focus-2">
                                       <div className="form-label">Quantity</div>
                                       {this.state.edition_type === '2' ?
                                          <>
                                             <input type="text" className="form-control" disabled value={this.state.quantity} name="quantity"
                                                onChange={this.onChange} />
                                             <span className="error-asterick"> {this.state.quantityError}</span>
                                          </>
                                          :
                                          <>
                                             <input type="number" className="form-control" value={this.state.quantity} name="quantity"
                                                onChange={this.onChange} onKeyDown={this.formatInput} />
                                             <span className="error-asterick"> {this.state.quantityError}</span>
                                          </>
                                       }

                                    </div>
                                 </div>



                                 {this.state.dateShow === 1 ?
                                    <>
                                       <div className="input-col col-xs-12 col-sm-6">
                                          <div className="form-group focus-2">
                                             <div className="form-label">Start Date</div>
                                        
                                             <div className="form-group addnftdate">
                                                <DatePicker className="form-control"
                                                   onChange={this.handleChange} minDate={new Date()}
                                                   value={this.state.start_date}
                                                   name="start_date"
                                                />
                                       
                                             </div>
                                          </div>
                                       </div>

                             
                                    </> : ''
                                 }


                                 <div className="input-col col-xs-12">
                                    {this.state.spinLoader === '0' ?
                                       <button className="btn btn-primary  size-1 btn-right" type="submit"
                                          onClick={this.nftAdd}>Submit</button> :
                                       <button className="btn btn-primary  size-1 btn-right" disabled>
                                          Processing...
                                       </button>
                                    }

                                 </div>


                              </div>


                           </div>

                           :
                                    ""

                        }


                     </div>
                  </div>
               </div>
            </div>


            {/* //=========================================  edit collection   =============================== */}


            <div id="edit-collection" className="modal fade" role="dialog" style={{ display: this.state.alertShow === 1 ? 'none' : '', background: 'rgb(6, 6, 6)' }} data-backdrop="false" aria-hidden="false">
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                     <div className="modal-header">
                        <h4 className="modal-title  text-center w-100">Edit Collection</h4>
                        <button type="button" className="close" style={{ marginTop: '-24px' }} onClick={this.loading.bind(this)} data-dismiss="modal">×</button>
                     </div>
                     <form id="add_category_form" onSubmit={this.editForm} >
                        <div className="row p-3">
                           <div className="col-12 px-3 d-none error-message">
                              <div className="alert alert-danger mb-3 error-message-content" role="alert">
                              </div>
                           </div>

                           <div className="col-12 mb-3">
                              <div className="form-group">
                                 <input className="form-input" type="text" onChange={this.handleChangeCollection} name="name" placeholder="Collection Name"
                                    value={this.state.getSingleUserCollectionData?.name} />
                                 {/* <span className="error-asterick"> {this.state.nameErrorCollection}</span> */}

                              </div>
                           </div>
                           <div className="input-col col-12 mb-3">
                              <div className="form-group focus-2 mb-0">
                                 <textarea className="form-input" onChange={this.handleChangeCollection} name="description"
                                    value={this.state.getSingleUserCollectionData?.description} placeholder="Description"></textarea>
                                 {/* <span className="error-asterick"> {this.state.descriptionErrorCollection}</span> */}

                              </div>
                           </div>


                           <div className="col-12">

                              <input type="submit" className="btn-primary btn size-1 col-sm-12 btn-lg" value="Update" disabled={!this.state.getSingleUserCollectionData?.name || !this.state.getSingleUserCollectionData?.description} onClick={this.updateCollection.bind(this)} />
                              {this.state.deleteShow === 1 ?
                                 <input type="button" className="btn-danger btn size-1 col-sm-12 btn-lg" value="Delete" onClick={this.collectionDelete.bind(this, this.state.collectionName)} />
                                 : ''

                              }


                           </div>
                        </div>

                        <input type="hidden" name="category_type" value="2" />
                        <input type="hidden" id="add_category_url" value="/store/categories/" />
                     </form>

                  </div>
               </div>
            </div>

            <Footer />
         </>
      )
   }
}