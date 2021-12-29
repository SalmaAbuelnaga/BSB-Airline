import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from '@mui/material/Button';
import CardActions from "@material-ui/core/CardActions";
import { FaPlaneDeparture } from "react-icons/fa"
import { FaPlaneArrival } from "react-icons/fa"
import { IconContext } from "react-icons"
import flight from "./images/flight.png"
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ImArrowRight2 } from "react-icons/im";
// import {ImArrowRight} from "react-icons/Im"
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Alert from "@mui/material/Alert";
import Confirm from './Confirm'
import { useNavigate, useLocation } from 'react-router-dom'
import { set, setISODay } from "date-fns";
import StripeCheckout from "react-stripe-checkout"


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function Summary(props) {
  const navigate = useNavigate();
 // const location = useLocation();
  //const { id} = location.state;
  const [info, setInfo] = useState([{}]);
  // const [flight1, setFlight1] = useState({flightDate:"",from:"",to:"",arr:"",dep:"",passA:"",ChildA:"",price:"",cabin:"",seat:[],total:""});
  // const [flight2, setFlight2] = useState({flightDate:"",from:"",to:"",arr:"",dep:"",passA:"",ChildA:"",price:"",cabin:"",seat:[],total:""});
  const [clicked, setClicked] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const location = useLocation();
  const { depFlight, retFlight, cab, adult, child, departureSeats, returnSeats, id } = location.state;
  const flight1 = { flightDate: depFlight.FlightDate, from: depFlight.From, to: depFlight.To, arr: depFlight.ArrivalTime, dep: depFlight.DepartureTime, passA: adult, ChildA: child, price: pr(depFlight), cabin: cab, seat: departureSeats, total: tot(depFlight) }
  const flight2 = { flightDate: retFlight.FlightDate, from: retFlight.From, to: retFlight.To, arr: retFlight.ArrivalTime, dep: retFlight.DepartureTime, passA: adult, ChildA: child, price: pr(retFlight), cabin: cab, seat: returnSeats, total: tot(retFlight) }
  const [paymentClicked, setPaymentClicked] = useState(false);
  const [reserved, setReserved] = useState(false);
  function pr(u) {
    if (cab == "Economy") {
      return u.EcoPrice;
    }

    else if (cab == "Business") {
      return u.BusPrice;
    }
    else {
      return u.FPrice;
    }
  }
  function tot(u) {
    var prc = pr(u);
    return (prc * adult + prc * child * 0.5)
  }
  const [product, setProduct] = useState({
    Total: tot(depFlight) + tot(retFlight), DepartId: depFlight, ReturnId: retFlight, DepartSeats: departureSeats, ReturnSeats: returnSeats, ReturnPrice: pr(retFlight), DepartPrice: pr(depFlight), user: id, cabin: cab, adult: adult, child: child, returnPriceTotal: tot(retFlight), DepartPriceTotal: tot(depFlight)
  });
  const total = (tot(depFlight) + tot(retFlight));
  const handleClickSB = () => {
    setOpenSnackBar(true);
  }

  const handleCloseSB = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {

  //   axios.post('http://localhost:8000/addReservation',
  //     {
  //       DepartId: depFlight._id,
  //       departAdult: adult,
  //       departChild:child,
  //       departCabin: cab,
  //       departSeats: departureSeats,
  //       departPrice:pr(depFlight),
  //       DepartPriceTotal:tot(depFlight),
  //       returnPrice:pr(retFlight),
  //       returnPriceTotal:tot(retFlight),
  //       ReturnId: retFlight._id,
  //       returnAdult: adult,
  //       returnChild: child,
  //       returnCabin: cab,
  //       returnSeats: returnSeats,
  //     User: "61abb8b7dda93117406ba763",
  //     Total: tot(depFlight)+tot(retFlight)
  //     }).then(res => {
  //       console.log(res.data._id);
  //       console.log(res.data)
  //       setID(res.data._id);

  //       setReserved(true);
  //       console.log(id);
  //       setProduct({
  //        
  //       })

  //     })
  // }, []
  // )


  useEffect(() => {

    axios.post('http://localhost:8000/reserveSeats',
      {
        cabin: cab,
        FlightID: depFlight._id,
        seats: departureSeats

      }).then(res => {
        console.log(res.data)
      })

  }, [])
  useEffect(() => {

    axios.post('http://localhost:8000/reserveSeats',
      {
        cabin: cab,
        FlightID: retFlight._id,
        seats: returnSeats

      }).then(res => {
        console.log(res.data)
      })

  }, [])
  const payment = token => {
    const body = {
      token, product
    }
    const headers = {
      "Content-Type": "application/json"
    }
    return fetch(`http://localhost:8000/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(response => {
      console.log("Response", response)
      const { status } = response;
      console.log("Status", status);

    }).catch(error => console.log(error))
  }


  return (
    <div style={{ marginTop: -100 }}>
      <div

        id='intro-example'
        className='p-5 text-center bg-image'
        style={{
          background: `url('https://www.puredestinations.co.uk/wp-content/uploads/2016/06/header-Qatar-Airways-introduces-Dreamliner-aircraft-to-Birmingham-International-Airport--1600x500.jpg')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", height: 600, width: window.screen.width,
          marginTop: 400,

        }}


      >
        <h1 style={{ color: ' #5c0931', marginLeft: -900, marginTop: 200, fontWeight: 'bold' }}> Welcome on board</h1>
      </div>



      <div>



        <Typography
          style={{ fontSize: 50, fontWeight: "bold", color: ' white', marginTop: 200 }}
          color="textPrimary"
          align="left"
          gutterBottom
        >
          YOUR BOOKING
        </Typography>


        <br />
        <Card
          style={{
            width: 1000,
            height: 700,
            marginLeft: 250,
            backgroundColor: "white", marginTop: -500, opacity: 0.9
          }}
        >
          <CardContent>
            <Card
              style={{
                marginLeft: 80,
                width: 800,
                height: 70,
                backgroundColor: "#EBECF0", opacity: 0.9
              }}
            >
              <CardContent>
                <Typography
                  style={{ fontWeight: "bold", color: ' #5c0931', marginLeft: 30 }}
                  color="textPrimary"
                  align="center"
                  variant="h4"
                  component="h2"
                  gutterBottom

                >
                  BSB Airways
                </Typography>
              </CardContent>
            </Card>
            <br />
            <Grid container spacing={2} columns={16}>
              <Grid item xs={8}>
                <Card
                  style={{
                    width: 400,
                    height: 340,
                    backgroundColor: "#EBECF0",
                    opacity: 0.9,
                    marginLeft: 40, marginTop: 30

                  }}

                >
                  <CardContent>
                    <Typography
                      style={{ fontSize: 30, color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      <FaPlaneDeparture />
                    </Typography>

                    <Typography
                      align="center"
                      style={{ fontWeight: "bold", color: ' #5c0931', fontSize: 25, marginTop: -45 }}

                      component="h2"
                    >
                      {flight1.from} <ImArrowRight2 />  {flight1.to}
                    </Typography>



                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Flight Date :  <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 120, marginTop: -23 }}> {flight1.flightDate} </Typography>
                    </Typography>
                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Departure At:  <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 150, marginTop: -25 }}> {flight1.dep}</Typography>
                    </Typography>

                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Arrival At:   <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 120, marginTop: -25 }}>  {flight1.arr}</Typography>
                    </Typography>
                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Class: <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 90, marginTop: -25 }}>  {flight1.cabin}</Typography>
                    </Typography>
                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Seat: <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 70, marginTop: -25 }}>  {flight1.seat} </Typography>
                    </Typography>


                    <Typography
                      style={{ fontSize: 30, fontWeight: "bold", color: ' #5c0931', marginLeft: -70 }}
                      align="center"
                      color="textPrimary"
                      gutterBottom
                    >
                      $  <Typography style={{ fontSize: 20, color: ' #5c0931', marginLeft: 60, marginTop: -37 }}> {flight1.price}</Typography>
                    </Typography>
                  </CardContent>
                  <CardActions>
                  </CardActions>
                </Card>
              </Grid>
              <br /> <br /><br /><br />
              <Grid item xs={8}>
                <Card
                  style={{
                    width: 400,
                    height: 340,
                    backgroundColor: "#EBECF0",
                    opacity: 0.9,
                    marginLeft: 40, marginTop: 30
                  }}
                >
                  <CardContent>
                    <Typography
                      style={{ fontSize: 30, color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      <FaPlaneArrival />
                    </Typography>

                    <Typography
                      align="center"
                      style={{ fontWeight: "bold", color: ' #5c0931', fontSize: 25, marginTop: -45 }}
                      variant="h4"
                      component="h2"
                    >
                      {flight2.from} <ImArrowRight2 />   {flight2.to}
                    </Typography>



                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Flight Date : <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 120, marginTop: -23 }}> {flight2.flightDate}</Typography>
                    </Typography>
                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Departure At:    <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 150, marginTop: -25 }}> {flight2.dep}</Typography>
                    </Typography>

                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Arrival At:   <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 120, marginTop: -25 }}> {flight2.arr}</Typography>
                    </Typography>
                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Class:     <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 90, marginTop: -25 }}>  {flight2.cabin}</Typography>
                    </Typography>
                    <Typography
                      align="left"
                      style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931' }}
                      color="textPrimary"
                      gutterBottom
                    >
                      Seat:   <Typography style={{ fontSize: 16, color: ' #5c0931', marginLeft: 70, marginTop: -25 }}>   {flight2.seat} </Typography>
                    </Typography>

                    <Typography
                      style={{ fontSize: 30, fontWeight: "bold", color: ' #5c0931' }}
                      align="center"
                      color="textPrimary"
                      gutterBottom
                    >
                      $  <Typography style={{ fontSize: 20, color: ' #5c0931', marginLeft: 60, marginTop: -37 }}> {flight2.price}</Typography>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {/* <Button size="small">Stay Safe.....</Button> */}
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            <br />
            <br />
            <br />

            <Card
              style={{

                width: 330,
                height: 65,
                backgroundColor: "#EBECF0",
                opacity: 0.9, marginLeft: 320
              }}
            >
              <CardContent>
                <Typography
                  align="left"
                  style={{ fontSize: 20, fontWeight: "bold", color: ' #5c0931', marginLeft: 70 }}
                  color="textPrimary"
                  gutterBottom
                >
                  Total Price  $ {total}
                </Typography>
              </CardContent>
            </Card>


            <Stack spacing={2} sx={{ width: '20' }}>
              <div style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginleft: -30
              }}>
                <StripeCheckout
                  stripeKey="pk_test_51K9xnYIbRPMFvA35ITziFtr9RWYlynAuPJvHhEN0K5cvXSD3xXilXy0ZboHC69mi3bGzh387NCkeGXakoE6kYdPG00lwSZDvyD"
                  // {process.env.REACT_APP_KEY}
                  token={payment}
                  name="Book ticket"
                  style={{ color: ' #5c0931' }}
                  amount={total * 100}
                  onClick={() => navigate("/ReservedFlights"), { state: id }}
                >
                  <Button style={{ background: '#5c0931', fontWeight: "bold", marginLeft: 370, marginTop: 10, width: 250 }} variant="contained" color="primary" onClick={() => { id ==undefined ? handleClickOpen() : setPaymentClicked(true) }} >
                    Proceed to payment
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Please regiester before booking your flight
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel reservation</Button>

                      <Button onClick={() => { handleClose(); navigate('/Login') }} autoFocus>
                        Sign up
                      </Button>
                    </DialogActions>
                  </Dialog>
                </StripeCheckout>
              </div>
            </Stack>
            <Button style={{ background: '#5c0931', fontWeight: "bold", marginLeft: 700, marginTop: -60, width: 250 }} variant="contained" color="primary" disabled={paymentClicked ? false : true} onClick={() => navigate("/ReservedFlights",{state:id})} >
              View reseved flights
            </Button>
            <br />
            <br />
            <br />
          </CardContent>
        </Card>
        <br />
        <br />
        <br />
      </div>


    </div>
  )
}
export default Summary;