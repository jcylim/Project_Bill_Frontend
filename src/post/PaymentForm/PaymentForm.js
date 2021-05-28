import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const PaymentForm = ({ price, nextStep, pay, timeout }) => {
    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({ 
            type: 'card', 
            card: cardElement
        });

        if (error) {
            console.log(error);
        } else {
            console.log(paymentMethod);
            pay();
            timeout();
            nextStep();
        }

    };

    return (
        <>
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