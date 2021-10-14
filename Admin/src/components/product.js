import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from  'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default class product extends Component {

    constructor(props) {
        super(props)
       this.state = {
           item_name : '',
           description : '',
           image : '',
           owner : '',
           item_category_id : '',
           category_name : '' ,
           price : '',
           start_date : '',
           edition_type : '',
           expiry_date : '',
           item_list : [],
           category_list:[],
           image_file: null,
           image_preview: '',
           updateform: '',
           update_id:'',
           bid_list : [],
           sell_type : '',
           quantity : '',
           dateShow:0,
           index : 0,
       }

       this.deleteItem = this.deleteItem.bind(this);
       this.loginData = (!Cookies.get('loginSuccessInfinityAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
      
       this.columns = [
        {
            key: '#',
            text: 'Sr. No.',
            cell: (row, index) => index + 1
          },
        {
            key: "id",
            text: "ID",
            sortable: true
        },
        {
            key: "name",
            text: "Name",
            sortable: true
        },
        {
            key: "description",
            text: "Description",
            sortable: true
        },
        {
            key: "image",
            text: "Image",
            cell: (item) => {
                return (
                    <>
                        <a href={`${config.ipfsUrl}${item.image}`} target="_blank">
                            <img height="100" width="100" className="video-css" src="images/youtube-logo2.jpg" />
                        </a>
                    </>
                );
            }
        },
        {
            key: "owner",
            text: "Owner",
            sortable: true
        },
         {
            key: "item_category",
            text: "Category Name",
            sortable: true
        },

        {
            key: "price",
            text: "Price",
            sortable: true
        },
        // {
        //     key: "id",
        //     text: "Action",
        //     cell: (item) => {
        //         return (
        //             <>
                    
        //              <button type="submit"   onClick={this.deleteItem.bind(this,item)}  data-toggle="tooltip" data-target="#responsive-modal1"  data-original-title="Close" className=" btn-danger"> <i class="fa fa-close m-r-10"></i> </button>
                        
                       
        //             </>
        //         );
        //     }
        // },

    ];

       this.config = {
        page_size: 10,
        length_menu: [10, 20, 50,],
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
        if(!Cookies.get('loginSuccessInfinityAdmin')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
        this.getItemAPI();
    }


async getItemAPI() {
        axios.get(`${config.apiUrl}/getitem`, {}, )
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }


 deleteItem = (id) => {
    confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to delete this NFTs.',
        buttons: [
            {
                label: 'Yes',
                onClick: () =>

         axios.post(`${config.apiUrl}/deleteitem`,{id :  id.id} )
            .then(result => {
                if (result.data.success === true){
                toast.success(result.data.msg, {
               position: toast.POSITION.TOP_CENTER
                                            });
                                            this.getItemAPI();
                                        }
                                   
                                        }).catch(err => {
                                            toast.warning(err.response.data?.msg, {
                                                position: toast.POSITION.TOP_CENTER,
                                            
                                            }, setTimeout(() => {
                                                    
                                            }, 500));
                                        })
                                },
    {
        label: 'No',
    }
]
});
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
                <Header />
                <Leftsidebar />
                <div className="page-wrapper nft-user">
                    <div className="container-fluid">
                        <div className="row heading-bg">
                            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                <h5 className="txt-dark">All Nfts</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="panel panel-default card-view">
                                    <div className="panel-wrapper collapse in">
                                        <div className="panel-body">
                                            <div className="form-wrap">
                                            <div class="table-responsive">
                                                <ReactDatatable
                                                config={this.config}
                                                records={this.state.item_list}
                                                columns={this.columns}/> 
												</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    <Footer/>
                </div>
            </div>
        </>
       
        )

    }
}