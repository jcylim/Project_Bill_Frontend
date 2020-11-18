import React, { useState } from 'react';
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

// new ui components
import NewMenu from './core/NewMenu';
import NewMenu2 from './core/NewMenu2';
import NewNavBar from './core/NewNavBar';
import HomeNavBar from './core/HomeNavBar';
import NewDashboard from './company/NewDashboard';
import NewCustomers from './customer/NewCustomers';
import NewHandshakes from './handshake/NewHandshakes';
import NewSingleCustomer from './customer/NewSingleCustomer';
import NewSingleHandshake from './handshake/NewSingleHandshake';

const MainRouter = () => {
    // const state = {
    //     input: ''
    // };

    // const onSearchChange = input => {
    //     state.input = input;
    //     console.log('input: ', state.input);
    // };

    const [collapsed, setCollapsed] = useState(false); 
    const [toggled, setToggled] = useState(false);

    const handleCollapsedChange = (checked) => {
        console.log(checked);
        setCollapsed(checked);
    };  

    const handleToggleSidebar = (value) => {
        console.log(value);
        setToggled(value);
    };

    return (
        <div className='hold-transition sidebar-mini'>
            <HomeNavBar />
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
            <div className="wrapper">
                {/* <NewMenu2 
                    collapsed={collapsed} 
                    toggled={toggled}
                    handleToggleSidebar={handleToggleSidebar}
                /> */}
                <NewMenu />
                <div>
                    <NewNavBar 
                        handleCollapsedChange={handleCollapsedChange}
                        handleToggleSidebar={handleToggleSidebar}
                        collapsed={collapsed} 
                        toggled={toggled}
                    />
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
                        <PrivateRoute exact path='/:companyId/customers' component={NewCustomers} />
                        <PrivateRoute exact path='/:companyId/customers/search' component={CustomersSearch} />
                        <PrivateRoute exact path='/:companyId/customer/create' component={NewCustomer} />
                        <PrivateRoute exact path='/:companyId/customer/:customerId' component={NewSingleCustomer} />
                        <PrivateRoute exact path='/:companyId/customer/edit/:customerId' component={EditCustomer} />
                        <PrivateRoute exact path='/:companyId/handshakes' component={NewHandshakes} />
                        <PrivateRoute exact path='/:companyId/handshake/create' component={NewHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/:handshakeId' component={NewSingleHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/edit/:handshakeId' component={EditHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/assign/:handshakeId' component={AssignHandshake} />
                        <PrivateRoute exact path='/:companyId/handshake/unassign/:handshakeId' component={UnassignHandshake} />
                        {/* <Route exact path='/root/signup' component={RootSignUp} />
                        <Route exact path='/root/signin' component={RootSignIn} />
                        <Route exact path='/signin' component={SignIn} /> */}
                        <PrivateRoute exact path='/:companyId/dashboard' component={NewDashboard} />
                        <PrivateRoute exact path='/:companyId/edit' component={EditCompany} />
                        <Route exact path='/:companyId/employees' component={Users} />
                        <PrivateRoute exact path='/:companyId/employee/add' component={NewUser} />
                        <PrivateRoute exact path='/:companyId/employee/edit/:userId' component={EditProfile} />
                        <PrivateRoute exact path='/:companyId/profile' component={Company} /> 
                        <PrivateRoute exact path='/:companyId/employee/:userId' component={Profile} /> 
                    </Switch>
                    <footer class="main-footer">
                        <strong>Copyright &copy; 2020</strong> All rights reserved by Lim's Workflow.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default MainRouter;