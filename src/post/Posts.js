import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { list } from './apiPost';
import DefaultPost from '../img/postPic.jpg';
import StatusBadge from './StatusBadge';

import { LazyLoadImage } from 'react-lazy-load-image-component';


class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data, loading: false });
            }
        })
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy ? 
                    `/user/${post.postedBy._id}` : 
                    '';
                    const posterName = post.postedBy ? 
                    `${post.postedBy.first_name} ${post.postedBy.last_name}` : 
                    'Unknown';
                    const price = parseFloat(post.price).toFixed(2);
                    const status = post.status;

                    return (
                        <div className="card col-md-4" key={i}>
                            <LazyLoadImage 
                                effect="blur"
                                src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                                onError={i => (i.target.src = `${DefaultPost}`)}
                                alt={post.title} 
                                style={{height: '250px', width: '100%'}}
                                className='img-thumbnail'
                            />
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <h5 className="card-text" style={{color: 'green'}}>
                                    {`$${price}`}
                                </h5>
                                <p className="card-text">
                                    {post.body.substring(0, 100)}
                                </p>
                                <div className='row justify-content-between'>
                                    <div className='col-3'>
                                        <h4><StatusBadge status={status} /></h4>
                                    </div>
                                    <div className='col-3'>
                                        <h5 className='mb-5'>
                                            <i 
                                                className='fa fa-comment text-info'
                                            />{' '}
                                            {post.comments ? post.comments.length : 0}
                                        </h5>
                                    </div>
                                </div>
                                <p className='font-italic mark'>
                                    Posted by{' '} 
                                    <Link to={`${posterId}`}>
                                        {posterName}
                                    </Link>
                                    {' '}on {new Date(post.created).toDateString()}
                                </p>
                                <Link 
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-primary btn-sm col align-self-center"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { posts } = this.state;
        let activePosts = posts.filter(post => post.status === 'ACTIVE');
        let soldPosts = posts.filter(post => post.status === 'SOLD');
        
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    <b>{!posts.length ? 'No Posts Yet' : 'Recent Posts'}</b>
                </h2>
                <h3 className="mt-4 mb-4">Active Posts</h3>
                {this.renderPosts(activePosts)}
                <h3 className="mt-4 mb-4">Sold Posts</h3>
                {this.renderPosts(soldPosts)}
                <br/>
            </div>
        );
    }
}

export default Posts;