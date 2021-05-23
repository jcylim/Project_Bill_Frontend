import React from 'react';
import Posts from '../post/Posts';
import DefaultPost from '../img/home_page.jpg';

const Home = () => (
    <div>
        <div style={{padding: '20px'}}>
            <h2 className='primary'>Welcome to Homely's Main Page (Beta)</h2>
        </div>
        <div style={{ 
            backgroundImage: `url(${DefaultPost})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width:'100%',
            height: '300px'
        }}/>
        <div className='container'>
            <Posts />
        </div>
    </div>
);

export default Home;