import React from 'react';
import Posts from '../post/Posts';
import DefaultPost from '../img/home_page.jpg';

const Home = () => (
    <div>
        {/* <div className='bg-image'>
            <h2>Home</h2>
            <p className='lead'>Welcome to Homely's Main Page</p>
            <img 
                src={`${DefaultPost}`}
                onError={i => (i.target.src = `${DefaultPost}`)}
                alt="home" 
                style={{height: '100%', width: '100%'}}
                className='img-fluid'
            />
        </div> */}
        <div style={{ 
            backgroundImage: `url(${DefaultPost})`,
            backgroundRepeat: 'no-repeat',
            width:'100%',
            height: '500px' 
        }}>
            <h2 className='lead'><b>Welcome to Homely's Main Page</b></h2>
        </div>
        <div style={{ 
            backgroundImage: `url(${DefaultPost})`,
            backgroundRepeat: 'no-repeat',
            width:'100%',
            height: '500px'
        }}/>
        <div className='container'>
            <Posts />
        </div>
    </div>
);

export default Home;