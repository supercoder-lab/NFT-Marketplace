import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
// import ReactDatatable from 'react-datatable';




export default class userlist extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            user_id: '',
            user_list: [],
            data: [],
            index : 0
           
            
        };
        this.loginData = (!Cookies.get('loginSuccessInfinityAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
        // this.onChange = this.onChange.bind(this);

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
                key: "user_name",
                text: "user name",
                sortable: true
            },
            {
                key: "full_name",
                text: "full name",
                sortable: true
            },
            {
                key: "email",
                text: "email",
                sortable: true
            },
            {
                key: "is_email_verify",
                text: "Email Verify",
                cell: (item) => {
                    return (
                        <>
                            {(item.is_email_verify === 0) ? 'Not Verified' : "Verified"}
                            
                           
                        </>
                    );
                }
            },


            {
                key: "Action",
                text: "Action",
                cell: (record, item) => {
                    return (
                        <>
                            <button
                            //    type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this,record, item)}
                                className="btn btn-danger btn-sm"
                                // onClick={this.updateRejectAPI.bind(this,record, item)}
                                onClick={this.deleteUser.bind(this,record, item)}
                                style={{marginRight: '5px'}}>
                                   <i class="fa fa-close m-r-10"></i> 
                            </button>
                            
                           
                        </>
                    );
                }
            },
           
          
        ];

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

        

    componentDidMount() {
        if (!Cookies.get('loginSuccessInfinityAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.userList();
    }
    
    async userList() {
       
        await axios.get(`${config.apiUrl}/getuser`, {},)
            .then(result => {
                const data = result.data;
                // const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
               
                console.log(result.data);
                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response,
                        pageCount: Math.ceil(data.length / this.state.perPage),
                                 
                    })


                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }

    async deleteUser(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this User..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
           axios.post(`${config.apiUrl}/deleteuser`,
         {id :  id.id} )
                .then(result => {

                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                                                     });
                                                     this.userList();
                                                 }).catch((error) => {
                                                    toast.danger(error.data.msg, {
                                                        position: toast.POSITION.TOP_CENTER
                                                    });
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
                <ToastContainer />
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Users Details</h5>
                                </div>

                            </div>
                            {/* <!-- /Title --> */}

                            {/* <!-- Row --> */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">
                                                       
                                                        {/* <hr className="light-grey-hr" /> */}
                                                        <div className="row">
                                                          
                                                        </div>
                                                       


                                                        <div className="form-actions">
                                                           
                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                    <div class="table-responsive">
                                                
                                                        <ReactDatatable
                                               config={this.config}
                                               records={this.state.user_list}
                                             columns={this.columns}
                                                                   /> 

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                               

                            </div>
                            {/* <!-- /Row --> */}

                        </div>
                        {/* <!-- Footer --> */}
                        <Footer />
                        {/* <!-- /Footer --> */}

                    </div>
                    {/* <!-- /Main Content --> */}

                </div>
            </>


        )

    }
}
