import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Menu from './core/Menu';
import NavBar from './core/NavBar';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './company/Dashboard';
import RootSignUp from './company/SignUp';
import RootSignIn from './company/SignIn';
import Company from './company/Company';
import EditCompany from './company/EditCompany';
import RootForgotPassword from "./company/ForgotPassword";
import RootResetPassword from "./company/ResetPassword";
import SignIn from './user/SignIn';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import NewUser from './user/NewUser';
import NewTask from './task/NewTask';
import SingleTask from './task/SingleTask';
import EditTask from './task/EditTask';
import AssignTask from './task/AssignTask';
import UnassignTask from './task/UnassignTask';
import Customers from './customer/Customers';
import SingleCustomer from './customer/SingleCustomer';
import NewCustomer from './customer/NewCustomer';
import EditCustomer from './customer/EditCustomer';
import Handshakes from './handshake/Handshakes';
import SingleHandshake from './handshake/SingleHandshake';
import NewHandshake from './handshake/NewHandshake';
import EditHandshake from './handshake/EditHandshake';
import AssignHandshake from './handshake/AssignHandshake';
import UnassignHandshake from './handshake/UnassignHandshake';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import CustomersSearch from './core/CustomersSearch';


const MainRouter = () => {
    // const state = {
    //     input: ''
    // };

    // const onSearchChange = input => {
    //     state.input = input;
    //     console.log('input: ', state.input);
    // };

    return (
        <div>
            <NavBar />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path="/root/forgot-password" component={RootForgotPassword} />
                <Route exact path="/root/reset-password/:resetPasswordToken" component={RootResetPassword} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
                <Route exact path='/root/signup' component={RootSignUp} />
                <Route exact path='/root/signin' component={RootSignIn} />
                <Route exact path='/signin' component={SignIn} />
            </Switch>
            <div className="row">
                <Menu />
                <div className='col-md-9 ml-sm-auto col-lg-10 px-md-4'>
                    <Switch>
                        {/* <Route exact path='/' component={Home} />
                        <Route exact path="/root/forgot-password" component={RootForgotPassword} />
                        <Route exact path="/root/reset-password/:resetPasswordToken" component={RootResetPassword} />
                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} /> */}
                        <PrivateRoute exact path='/:companyId/task/create' component={NewTask} />
                        <PrivateRoute exact path='/:companyId/task/:taskId' component={SingleTask} />
                        <PrivateRoute exact path='/:companyId/task/edit/:taskId' component={EditTask} />
                        <PrivateRoute exact path='/:companyId/task/assign/:taskId' component={AssignTask} />
                        <PrivateRoute exact path='/:companyId/task/unassign/:taskId' component={UnassignTask} />
                        <PrivateRoute exact path='/:companyId/customers' component={Customers} />
                        <PrivateRoute exact path='/:companyId/customers/search' component={CustomersSearch} />
                        <PrivateRoute exact path='/:companyId/customer/create' component={NewCustomer} />
                        <PrivateRoute exact path='/:companyId/customer/:customerId' component={SingleCustomer} />
                        <PrivateRoute exact path='/:companyId/customer/edit/:customerId' component={EditCustomer} />
                        <PrivateRoute exact path='/:companyId/handshakes' component={Handshakes} />
                        <PrivateRoute exact path='/:companyId/handshake/create' component={NewHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/:handshakeId' component={SingleHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/edit/:handshakeId' component={EditHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/assign/:handshakeId' component={AssignHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/unassign/:handshakeId' component={UnassignHandshake} />
                        {/* <Route exact path='/root/signup' component={RootSignUp} />
                        <Route exact path='/root/signin' component={RootSignIn} />
                        <Route exact path='/signin' component={SignIn} /> */}
                        <PrivateRoute exact path='/:companyId/dashboard' component={Dashboard} />
                        <PrivateRoute exact path='/:companyId/edit' component={EditCompany} />
                        <Route exact path='/:companyId/employees' component={Users} />
                        <PrivateRoute exact path='/:companyId/employee/add' component={NewUser} />
                        <PrivateRoute exact path='/:companyId/employee/edit/:userId' component={EditProfile} />
                        <PrivateRoute exact path='/:companyId/profile' component={Company} /> 
                        <PrivateRoute exact path='/:companyId/employee/:userId' component={Profile} /> 
                    </Switch>  
                </div>
            </div>
        </div>
    );
};

export default MainRouter;