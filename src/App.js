
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route , Link , Routes } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Home from './pages/Home/Home';

import ViewAllSettings from './components/ViewAllSettings/ViewAllSettings';
// import UpdateGeneralSettings from './components/UpdateGeneralSettings/UpdateGeneralSetting';
import ViewAllUrl from './components/Url/ViewAllUrl/ViewAllUrl';
import ViewAllTitles from './components/Title/ViewAllTitles/ViewAllTitles';
import UpdateGeneralSettings from './components/UpdateGeneralSettings/UpdateGeneralSetting';
import ViewOneSetting from './components/ViewOneSetting/ViewOneSetting';
import ViewAllMeta from './components/Meta/ViewAllMeta/ViewAllMeta';
import PrivateRoutes from './components/utils/PrivateRoutes';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path = {"/"} element = {<Home/>} />
      <Route path = {"/signup"} element = {<SignUp/>} />
      <Route path = {"/login"} element = {<Login/>} />
      <Route path = {"/forgotpassword"} element = {<ForgotPassword/>} />
      <Route exact path="/reset/:token" element={<ResetPassword />} />
      <Route element={<PrivateRoutes />}>
            
      <Route path = {"/ViewAllSettings"} element = {<ViewAllSettings/>} />

      <Route path = {"/ViewAllUrl"} element = {<ViewAllUrl/>} />
      <Route path = {"/ViewAllTitles"} element = {<ViewAllTitles/>} />
      <Route path = {"/ViewAllUrl"} element = {<ViewAllUrl/>} />
      <Route path = {"/ViewAllMeta"} element = {<ViewAllMeta/>} />
      <Route path = {"/ViewOneSetting"} element = {<ViewOneSetting/>} />
      <Route path = {"/updateGeneralSettings"} element = {<UpdateGeneralSettings/>} />
          
           </Route>
  
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
      
           
   
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
