import logo from './logo.svg';
import './App.css';
//==================================  Import all dependencies  ============================

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config/config'
import login from './components/login'
import dashboard from './components/dashboard'
import product from './components/product'
import category_list from './components/categorylist'
import users from './components/users'
import changePassword from './components/changepassword'
import changeProfile from './components/changeprofile'

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <Menu /> */}
        <Switch>

          <Route path={`${config.baseUrl}`} exact component={login} />
          <Route path={`${config.baseUrl}dashboard`} exact component={dashboard} />
          <Route path={`${config.baseUrl}product`} exact component={product} />
          <Route path={`${config.baseUrl}category`} exact component={category_list} />
          <Route path={`${config.baseUrl}users`} exact component={users} />
          <Route path={`${config.baseUrl}changepassword`} exact component={changePassword} />
          <Route path={`${config.baseUrl}changeprofile`} exact component={changeProfile} />
         
        </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
