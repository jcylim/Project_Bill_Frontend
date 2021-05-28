import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Paper, Stepper, Step, StepLabel, Typography, CssBaseline } from '@material-ui/core';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Confirmation from './Confirmation';

import useStyles from './styles';
const steps = ['Payment Details', 'Confirmation'];

const Payment = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [payStatus, setPayStatus] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const { location: { state: { price, postId, posterName } } } = useHistory();

    const nextStep = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
    const pay = () => setPayStatus(true);

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    };

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar}>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant='h4' align='center'>Pay</Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map(step => (
                                <Step key={step}>
                                    <StepLabel>{step}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length - 1 
                        ? <Confirmation payStatus={payStatus} postId={postId} posterName={posterName} isFinished={isFinished}/> 
                        : <PaymentForm price={price} nextStep={nextStep} pay={pay} timeout={timeout}/>}
                    </Paper>
                </main>
            </div>
        </>
    )
};

export default Payment;