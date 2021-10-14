import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from  'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import  {confirmAlert}  from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Cookies from 'js-cookie';

export default class categorylist extends Component {

    constructor(props) {
        super(props)
            this.state={
                category_list : [],
                category_name : '',
                updateform: '',
                update_id:''
        };
         this.deleteCategory = this.deleteCategory.bind(this);
         this.editDataAPI = this.editDataAPI.bind(this);
         this.loginData = (!Cookies.get('loginSuccessInfinityAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
     
    }

    componentDidMount() {
        if(!Cookies.get('loginSuccessInfinityAdmin')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
        this.categoryList();
    }

   
    async categoryList() {
        await    axios.get(`${config.apiUrl}/getcategory`, {}, )
                .then(result => {
                    console.log(result.data);
                    if (result.data.success === true) {
                        this.setState({
                            category_list: result.data.response
                        })
                        
                       
                    }
    
                    else if (result.data.success === false) {
    
                    }
                })
    
                .catch(err => {
                })
        }
    
        async deleteCategory(id) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to delete this Category..',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () =>
               axios.post(`${config.apiUrl}/deletecategory`,
             {id :  id.id} )
                    .then(result => {
 
                        toast.success(result.data.msg, {
                            position: toast.POSITION.TOP_CENTER
                                                         });
                                                         this.categoryList()
                                                     }).catch(err => {
                                                        toast.error(err.response.data?.msg, {
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
    
  editDataAPI(id){
   
    this.setState({
      
     category_name : id.name,
     update_id:id.id,
     updateform : "123"     
   }); 
 
}


updateDataAPI(){

    const { update_id,category_name} = this.state;
        
   
  axios.post(`${config.apiUrl}/updatecategory`,{id:update_id,name:category_name})
  .then(result=>{
    toast.success(result.data.msg, {
        position: toast.POSITION.TOP_CENTER
    }, setTimeout(() => {
       window.location.reload();
    }, 500));
      // console.log(result.data.data);
      this.setState({
       category_name :'',
        updateform : ""   
      })
      this.categoryList();
  }).catch(err=>{
   
    toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
  });       
  }


handleChange = e =>{
       
    this.setState({
        [e.target.name] : e.target.value
     });
 }

 handleSubmit = event =>{
    event.preventDefault();
    const {category_name} = this.state;

      axios.post(`${config.apiUrl}/insertcategory`,{name:category_name})
        .then(result=>{
    
    if(result.data.success === true ){
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER,
        }, setTimeout(() => {
            window.location.reload();
             },));
         
            this.setstate({
                category_name : ''
            })
            this.categoryList();
         
     }
    }).catch((error) => {
        toast.error(error.data?.msg, {
        position: toast.POSITION.TOP_CENTER,
    
    }, setTimeout(() => {
            
    }, 500));
 
    })
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

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Add-Category</h5>
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
                                                    
                                                        <div className="row">
                                                         
                                                        </div>
                                                   
                                                       
                                                                    <div className="form-actions">
                                                            {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}
                                                      
                <button type='button'   data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary">Add Category </button>
                
                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                <div class="table-responsive">
										  <table class="table table-striped mb-0">
										  <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Name</th>
                                                                <th>Action</th>
                                                                
                                                            </tr>
                                                        </thead>
											<tbody>
                                            {this.state.category_list.map(item=>(
                                                            <tr>
                                                               
                                                                <td>{item.id}</td>
                                                                <td>{item.name}</td>
                                                                <td class="text-nowrap"><button type="submit"    onClick={this.editDataAPI.bind(this,item)}  data-toggle="modal" data-target="#responsive-modal1" className="btn-primary"  data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button> <button  className=" btn-danger" onClick={this.deleteCategory.bind(this,item)}  data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button> </td>
											
                                                            </tr>
                                                           ))}
										
											</tbody>
										  </table>
										</div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                             
                                </div>
                            </div>
                            {/* <!-- /Row --> */}
                                                        {/* //Edit Model */}
                                        <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: "none"}}>
											<div class="modal-dialog">
												<div class="modal-content">
												
													<div class="modal-body">
                                                    <form>
														
                                                        <div >
                                                                <div className="form-group mb-0">
                                                                    <label className="control-label mb-10">Category Name</label>
                                                                    <input type="text"   id="firstName" onChange={this.handleChange} name="category_name" className="form-control" placeholder="Category Name"  value={this.state.category_name} />
                                                                </div>
                                                            </div>
														</form>
													</div>
													<div class="modal-footer pt-0">
														<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                        {(this.state.updateform)?
                <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button>
                :
                <button type='submit'  onClick={this.handleSubmit} data-dismiss="modal"   className="btn btn-primary">Add </button>
                }
													</div>
												</div>
											</div>
										</div> 
                                        </div>
                        {/* <!-- Footer --> */}
                        <Footer/>
                        {/* <!-- /Footer --> */}

                    </div>
                    {/* <!-- /Main Content --> */}

                </div>
            </>


        )

    }
}
