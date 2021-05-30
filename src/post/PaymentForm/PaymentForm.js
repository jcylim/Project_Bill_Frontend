import React, { useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { setStatus, payWithStripe, sendSellerEmail } from '../apiPost';
import { isAuthenticated } from '../../auth';


const PaymentForm = ({ price, nextStep, pay, timeout, post }) => {
    const [errorMessage, setErrorMessage] = useState('');

    // const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY, {
    //     stripeAccount: isAuthenticated().user.stripeAccountId
    // });
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

    const name = isAuthenticated().user 
    ? `${isAuthenticated().user.first_name} ${isAuthenticated().user.last_name}` 
    : 'Unknown';

    const setPostStatus = status => {
        const token = isAuthenticated().token;

        setStatus(post._id, token, status).then(data => {
        if (data.error) {
            console.log(data.error.message);
            setErrorMessage(data.error.message);
        } else {
            console.log(data.status);
        }
        });
    };

    const sendConfirmationEmail = () => {
        const token = isAuthenticated().token;
        const consumer = isAuthenticated().user;

        sendSellerEmail(post._id, token, consumer).then(data => {
        if (data.error) {
            console.log(data.error.message);
            setErrorMessage(data.error.message);
        } else {
            console.log(data.message);
        }
        });
    };

    const confirmPayment = async (stripe, cardElement, clientSecret) => {
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: name,
              },
            }
        });

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
            setErrorMessage(result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                
                setErrorMessage('');

                // change status to "SOLD"
                setPostStatus("SOLD");
                
                // send seller purchase email
                sendConfirmationEmail();

                // ui logic
                pay();
                timeout();
                nextStep();
            }
        }
    };

    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const token = isAuthenticated().token;  
        payWithStripe(post._id, isAuthenticated().user, post.postedBy, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                confirmPayment(stripe, cardElement, data.client_secret);
            }
        });
    };

    return (
        <>
            <div 
                className='alert alert-danger'
                style={{ display: errorMessage ? '' : 'none'}}
            >
                {errorMessage}
            </div>
            <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>Payment Method</Typography>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement />
                            <br /> <br />
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button type='submit' variant='contained' disable={!stripe} color='primary'>
                                    Pay ${price}
                                </Button>
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
        </>
    )
};

export default PaymentForm;