import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../network/axiosinstance'; 
import styles from './ForgotPassword.module.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate()
  const errors = {};
  const [emailError , setemailError] = useState('')
  const handleEmailErr = (email) => {
   
    if (!email) {
     
      
      errors.email = 'Email is required';
      console.log( errors.email)
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleEmailErr(email);
      if (Object.keys(errors).length > 0) {
        setError(errors);
      }else {
        await axiosInstance.post('/user/forget/', {
            email : email
        }).then((res)=>{
          console.log("res", res)
          if ('error' in res.data) {
            if (res.data.error === "user_not_found") {
              //Username Err
              swal("Failed", "This E-mail is not registered", "error");
  
            } if(res.data.error === "too_many_request_in_one_minute"){
              swal("Failed", "Please Wait, Too Many Requests In One Minute", "error");
            } else if ('success' in res.data) {
              
              Swal.fire({
                position: 'cinter',
                icon: 'success',
                title: 'A Confirmation Link was sent',
                showConfirmButton: false,
                timer: 1500
              })
              // Redirect the user to the logged-in area of your app
            }
        }}).catch((err)=>{
          //Network Err
          console.log("err",err)
        });

}}
  return (
    <>
    <div className={`${styles.body}`}>
     <div  className={`${styles.container}`}>
      <h3 className={`${styles.title}`}>Forgot Password</h3>
      <Form onSubmit={handleSubmit} className={`${styles.content}`}>
        <Form.Group className={`${styles.inputbox}`} controlId="formBasicUsername">
          <Form.Label className={`${styles.label}`}>E-mail</Form.Label>
          <Form.Control
            className={`${styles.input}`}
            type="email"
            placeholder="Enter E-mail"
            value={email}
            onChange={(e) => {setEmail(e.target.value)
            handleEmailErr(e.target.value);
          setemailError(errors.email)}}
            isInvalid={!!errors.email}
          />
          {
             emailError && <p className='text-danger'>{emailError}</p>
          }
        </Form.Group>
        <Button variant="primary" type="submit" className={`${styles.button}`}>
          Enter
        </Button>

        <p className={`${styles.loginlink}`}>
            <Link className="text-primary"  as={Link} to="/login">
            Login
            </Link>
        </p>
      </Form>
      
      </div>
      </div>
      
    </>
  );
}


export default ForgotPassword;










