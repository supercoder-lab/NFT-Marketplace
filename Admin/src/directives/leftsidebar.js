import React, { Component } from 'react';
import config from '../config/config'
export default class Leftsidebar extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {


    }


    render() {

        return (
            <div className="fixed-sidebar-left mobileLeftShow">
                <ul className="nav navbar-nav side-nav nicescroll-bar">
                    <li className="navigation-header">
                    <span>Main</span>
                       
                        <i className="zmdi zmdi-more"></i>
                    </li>
                  
                    <li>
                    <a href={`${config.baseUrl}dashboard`}><div className="pull-left"><i className="zmdi zmdi-view-dashboard mr-20"></i><span className="right-nav-text">Dashboard</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>
                     
                    <li style={{display:"none"}}>
                    <a href={`${config.baseUrl}nftsusers`}><div className="pull-left"><i className="zmdi zmdi-assignment-account mr-20"></i><span className="right-nav-text">New Talents</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>

                    <li style={{display:"none"}}>
                    <a href={`${config.baseUrl}realestateusers`}><div className="pull-left"><i className="zmdi zmdi-city-alt mr-20"></i><span className="right-nav-text">Real Estate Users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>

                    <li>
                    <a href={`${config.baseUrl}users`}><div className="pull-left"><i className="zmdi zmdi-account mr-20"></i><span className="right-nav-text">Users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>

                    <li style={{display:"none"}}> 
                    <a href={`${config.baseUrl}category`}><div className="pull-left"><i className="zmdi zmdi-collection-image mr-20"></i><span className="right-nav-text">Category</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>

                    <li>
                    <a href={`${config.baseUrl}product`}><div className="pull-left"><i className="zmdi  zmdi-toys mr-20"></i><span className="right-nav-text">NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>
                    <li style={{display:"none"}}>
                    <a href={`${config.baseUrl}realestatenfts`}><div className="pull-left"><i className="zmdi  zmdi-city mr-20"></i><span className="right-nav-text">Real Estate NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>
                    <li style={{display:"none"}}>
                    <a href={`${config.baseUrl}icons`}><div className="pull-left"><i className="zmdi  zmdi-image mr-20"></i><span className="right-nav-text">Slider/Logo</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>
                    <li style={{display:"none"}}>
                    <a href={`${config.baseUrl}contact`}><div className="pull-left"><i className="zmdi  zmdi-accounts-list mr-20"></i><span className="right-nav-text">Contacts</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>
                </ul>
            </div>
        )

    }
}