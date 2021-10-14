import React, { Component } from 'react';
import config from '../config/config'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie'
export default class footer extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginSuccess')) ? [] : JSON.parse(Cookies.get('loginSuccess'))
      this.state = {
         getitemData: [],
         recentworkData: []
      }
   }
   componentDidMount() {
      // this.getitemAPI()
      // this.recentworkAPI()
   }

   //=======================================  getitem  =====================

   async getitemAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getCategoryById`,
         headers: { "Authorization": this.loginData?.msg },
         data: { 'item_category_id': '0', 'limit': 18 }
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

   //=======================================  recent work  =====================

   async recentworkAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getRecentWorks`,
         headers: { "Authorization": this.loginData?.msg },
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  recentworkData: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   loading() {
      setTimeout(() => {
         window.location.reload()
      });
   }

   render() {
      return (

         <>
            <footer>
               <div className="footer_slider">
                  <div className="swiper-container" data-autoplay="0" data-loop="1" data-speed="500" data-center="0" data-slides-per-view="responsive" data-xs-slides="4" data-sm-slides="8" data-md-slides="14" data-lg-slides="19" data-add-slides="19">
                     <div className="swiper-wrapper">
                        {this.state.getitemData.map(item => (

                           <div className="swiper-slide" data-val="1">

                              <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`}>
                                 <img src={item.image === null || item.image === '' || item.image === undefined
                                    ? 'images/noimage.png'
                                    :
                                    `${config.imageUrl}${item.image}`} style={{ width: '71px', height: '71px' }} />
                              </Link>
                           </div>
                        ))}
                     </div>
                     <div className="pagination hidden"></div>
                  </div>
               </div>
               <div className="footer-main">
                  <div className="container-fluid custom-container">
                     <div className="row">
                        <div className="col-md-4 col-xl-4">
                           <div className="footer-block">
                              <h1 className="footer-title">About Us</h1>
                              <p>Vulnerary is the largest marketplace for creative digital assets, crypto collectibles and non-fungible tokens (NFT). It is the most secure and trustable platform for NFTs. Buy, sell and trade premium NFTs and also discover creatives from New Talents. Vulnerary uses fastest platform, ensuring reliable services and is based on the ERC-721 blockchain.</p>
                              <ul className="soc_buttons">
                                 <li><a target="_blank" href="#"><i className="fa fa-facebook"></i></a></li>
                                 <li><a target="_blank" href="#"><i className="fa fa-twitter"></i></a></li>
                                 {/* <li><a target="_blank" href="#"><i className="fa fa-google-plus"></i></a></li> */}
                                 {/* <li><a target="_blank" href="#"><i className="fa fa-pinterest-p"></i></a></li> */}
                                 <li><a target="_blank" href="#"><i className="fa fa-instagram"></i></a></li>
                                 {/* <li><a target="_blank" href="#"><i className="fa fa-linkedin"></i></a></li> */}
                                 <li><a target="_blank" href="#"><i className="fa fa-youtube"></i></a></li>
                                 {/* <li><a target="_blank" href="https://discord.com/channels/831181530721157163"><i className="fab fa-discord"></i></a></li> */}

                              </ul>
                           </div>
                        </div>
                        <div className="col-md-3 col-xl-2">
                           <div className="footer-block">
                              <h1 className="footer-title">Quick Links</h1>
                              <div className="row footer-list-footer">
                                 <div className="col-md-6">
                                    <ul className="link-list">
                                       {/* <li><a target="_blank" href="#about-us.html">Sell your Work</a></li> */}
                                       {/* <li><Link to={`${config.baseUrl}aboutus`} target="_blank" >About us</Link></li> */}

                                       {/* <li><Link target="_blank" to={`${config.baseUrl}upcomingdrops`}>Upcoming Drops</Link></li> */}
                                       {/* <li><Link target="_blank" to={`${config.baseUrl}artviewall`}>Art</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}musicviewall`} >Music</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}sportviewall`} >Sports</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}createyourownnftslist`} >Marketplace</Link></li> */}

                                       <li><Link to="#">Art</Link></li>
                                       <li><Link to="#" >Music</Link></li>
                                       <li><Link to="#" >Sports</Link></li>
                                       <li><Link to="#" >Marketplace</Link></li>                                       
                                       {/* <li><Link to={`${config.baseUrl}realstatelist`} >Real State</Link></li> */}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="col-md-3 col-xl-2">
                           <div className="footer-block">
                              <h1 className="footer-title">Support & Help</h1>
                              <div className="row footer-list-footer">
                                 <div className="col-md-6">
                                    <ul className="link-list">
                                       {/* <li><a target="_blank" href="#about-us.html">Sell your Work</a></li> */}
                                       {/* <li><Link to={`${config.baseUrl}aboutus`} target="_blank" >About us</Link></li> */}

                                       {/* <li><Link to={`${config.baseUrl}faq`} target="_blank">FAQ</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}support`}>Support</Link></li>
                                       <li><Link to={`${config.baseUrl}privacypolicy`} target="_blank">Privacy Policy</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}termscondition`} >Terms & condition</Link></li> */}

                                    <li><Link to="#" >FAQ</Link></li>
                                       <li><Link to="#" >Support</Link></li>
                                       <li><Link to="#">Privacy Policy</Link></li>
                                       <li><Link to="#" >Terms & condition</Link></li>                                       
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>


                        <div className="col-md-2 col-xl-2">
                           <div className="footer-block">
                              <h1 className="footer-title">Social Links</h1>
                              <div className="row footer-list-footer">
                                 <div className="col-md-6">
                                    <ul className="link-list">
                                       <li><a  href="#">Instagram</a></li>
                                       <li><a  href="#">Youtube</a></li>
                                       <li><a  href="#">Twitter</a></li>
                                       <li><a  href="#">Discord</a></li>
                                       <li><a  href="#">Facebook</a></li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>

{/* 
                        <div className="col-md-4 galerry">
                           <div className="footer-block">
                              <h1 className="footer-title">Recent Works</h1>
                              {this.state.recentworkData.map(item => (

                                 <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`}>
                                    <img src={item.image === null || item.image === '' || item.image === undefined
                                       ? 'images/noimage.png'
                                       :
                                       `${config.imageUrl}${item.image}`} style={{ width: '50px', height: '50px' }} />
                                 </Link>
                              ))}
                           </div>
                        </div> */}


                        {/*   <div className="col-md-3">
                     <div className="footer-block">
                        <h1 className="footer-title">Subscribe On Our News</h1>
                        <form action="./" className="subscribe-form">
                           <input type="text" placeholder="Yout Name" required>
                           <div className="submit-block">
                              <i className="fa fa-envelope-o"></i>
                              <input type="submit" value>
                           </div>
                        </form>
                        <div className="soc-activity">
                           <div className="soc_ico_triangle">
                              <i className="fa fa-twitter"></i>
                           </div>
                           <div className="message-soc">
                              <div className="date">16h ago</div>
                              <a href="##" className="account">@faq</a> vestibulum accumsan est <a href="##" className="heshtag">#malesuada</a> sem auctor, eu aliquet nisi ornare leo sit amet varius egestas.
                           </div>
                        </div>
                     </div>
                     </div>  */}
                     </div>
                  </div>
               </div>
               <div className="footer-bottom">
                  <div className="container-fluid custom-container">
                     <div className="col-md-12 footer-end clearfix">
                        <div className="text-center">
                           <span className="copy">Copyright 2021 <span className="white"><a href="#"> Vulnerary</a></span></span>
                           {/* <span className="created">Created by <span className="white"><a href="##"> Espsofttech pvt ltd</a></span></span> */}
                        </div>
                        {/*  <div className="right">
                     <a className="btn color-7 size-2 hover-9">About Us</a>
                     <a className="btn color-7 size-2 hover-9">Help</a>
                     <a className="btn color-7 size-2 hover-9">Privacy Policy</a>
                     </div>  */}
                     </div>
                  </div>
               </div>
            </footer>
         </>
      )
   }
}