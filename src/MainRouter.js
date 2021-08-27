import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import PickUpLocation from './post/PickupLocation/PickupLocation';
import Menu from './core/Menu';
import SignUp from './user/SignUp';
import SignIn from './user/SignIn';
import Profile from './user/Profile';
import Users from './user/Users';
import Sellers from './user/Sellers';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import FindPeople from './user/FindPeople';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Payment from "./post/PaymentForm/Payment";

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/locations' component={PickUpLocation} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword}
            />
            <PrivateRoute exact path='/post/create' component={NewPost} />
            <Route exact path='/post/:postId' component={SinglePost} />
            <PrivateRoute exact path='/post/edit/:postId' component={EditPost} />
            <PrivateRoute exact path='/post/pay/:postId' component={Payment} />
            <Route exact path='/users' component={Users} />
            <Route exact path='/sellers' component={Sellers} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/signin' component={SignIn} />
            <PrivateRoute exact path='/user/edit/:userId' component={EditProfile} />
            <PrivateRoute exact path='/findpeople' component={FindPeople} />
            <PrivateRoute exact path='/user/:userId' component={Profile} />
        </Switch>
    </div>
);

export default MainRouter;