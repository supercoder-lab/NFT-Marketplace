import React, { Component } from 'react';

export default class Footer extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {


    }


    render() {

        return (
            <>
             <footer className="footer container-fluid pl-30 pr-30">
                 <div className="row">
                     <div className="col-sm-12">
                         {/* <p>2017 &copy; Philbert. Pampered by Hencework</p> */}
                     </div>
                 </div>
             </footer>
            </>
        )
    }
}