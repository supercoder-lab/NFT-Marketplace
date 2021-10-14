import './App.css';
import React, { components } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import config from './config/config'
import home from './components/home'
import login from './components/login'
import register from './components/register'
import itemdetails from './components/itemdetails'
import featurescreator from './components/featurescreator'
import createyourownnftslist from './components/createyourownnftslist'
import authoredit from './components/authoredit'
import about from './components/about'
import salehistory from './components/salehistory'
import yourpurchase  from './components/yourpurchase'
import VerifyAccount from './components/register'
import generatepassword from './components/generatepassword'
import resetpassword from './components/resetpassword'
import twoauthsecurity from './components/twoauthsecurity'
import purchasedetail from './components/purchasedetail'
function App() {
  return (
    <BrowserRouter>
     
        <Switch>
          
        <Route path={`${config.baseUrl}`} exact component={home} />
          <Route path={`${config.baseUrl}login`} exact component={login} />
          <Route path={`${config.baseUrl}register`} exact component={register} />
          <Route path={`${config.baseUrl}itemdetails/:id`} exact component={itemdetails} />
          <Route path={`${config.baseUrl}featurescreator/:user_id`} exact component={featurescreator} />
          <Route path={`${config.baseUrl}createyourownnftslist`} exact component={createyourownnftslist} />
          <Route path={`${config.baseUrl}authoredit`} exact component={authoredit} />
          <Route path={`${config.baseUrl}about`} exact component={about} />
          <Route path={`${config.baseUrl}salehistory`} exact component={salehistory} /> 
          <Route path={`${config.baseUrl}yourpurchase`} exact component={yourpurchase} /> 
          <Route path={`${config.baseUrl}verifyAccount/:token`}  component={VerifyAccount} />
          <Route path={`${config.baseUrl}generatepassword`} exact component={generatepassword} /> 
          <Route path={`${config.baseUrl}resetpassword`} exact component={resetpassword} /> 
          <Route path={`${config.baseUrl}resetpassword/:token`}  component={resetpassword} /> 
          <Route path={`${config.baseUrl}googleauthentication`}  component={twoauthsecurity} /> 
          <Route path={`${config.baseUrl}purchasedetail/:item_id_id`}  component={purchasedetail} />         
          <Route path={`${config.baseUrl}purchasedetail`}  component={purchasedetail} /> 
          
        </Switch>
      
    </BrowserRouter>
  );
}

export default App;




