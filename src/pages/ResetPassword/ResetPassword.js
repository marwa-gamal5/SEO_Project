import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../network/axiosinstance';
import styles from './ResetPassword.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import Swal from 'sweetalert2';


function ResetPassword() {

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState({});
  const  [showPassword,setShowPassword] = useState(false); 
  const  [showrPassword,setShowrPassword] = useState(false); 
  const navigate = useNavigate()
  const { token } = useParams();
  const errors = {};
  const [passwordError , setpasswordError] = useState('')
  const handlepasswordErr = (password) => {
     // Validate Password
     if (!password) {
      errors.password = 'Password is required';
    } else {
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(password)) {
        errors.password = 'Password must contain at least one lowercase letter';
      } else if (!/\d/.test(password)) {
        errors.password = 'Password must contain at least one digit';
      } else if (!/[@_!#$%^&*()<>?/\\|}{~:]/.test(password)) {
        errors.password = 'Password must contain at least one special character';
      }
    }
  };

  const [rePasswordError , setrePasswordError] = useState('')
  const handlerePasswordlErr = (rePassword) => {
     // Validate rePassword
     if (!rePassword) {
      errors.rePassword = 'Confirm Password is required';
    }else {
      if(password !== rePassword) {
      errors.rePassword = "Passwords don't match";
    }}
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    handlepasswordErr(password);
    handlerePasswordlErr(rePassword);
   
    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      await axiosInstance.post('/user/reset_pass/', {
        token: token,
        password: password,
        re_password: rePassword
      }).then((res) => {
        console.log("res", res)
        if ('error' in res.data) {
          console.log(res.data);
          if (res.data.error === "user_not_exists'") {
            swal("Failed", "This User is not Exist", "error");        
          } 
       
        }
        else  if ('success' in res.data) {
        
          Swal.fire({
            position: 'cinter',
            icon: 'success',
            title: 'Password Changed Successfully.',
            showConfirmButton: false,
            timer: 1500
          })
          
          navigate('/login');}

      }).catch((err) => {
        //Network Err
        console.log("err", err)
      });

    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowrPassword(!showrPassword);
  };

  return (
    <>
      <div className={`${styles.body}`}>
        <div className={`${styles.container}`}>
          <h3 className={`${styles.title}`}>Reset Password</h3>
          <Form onSubmit={handleSubmit} className={`${styles.content}`}>
            <Form.Group className={`${styles.inputbox}`} controlId="formBasicPassword">
              <Form.Label className={`${styles.label}`}>Password</Form.Label>
              
               <div className='position-relative'>
               <Form.Control
               className={`${styles.input}`}
               type={showPassword ? 'text' : 'password'} // Toggle between text and password type
               placeholder="Password"
               value={password}
               onChange={(e) => {setPassword(e.target.value)
              handlepasswordErr(e.target.value)
            setpasswordError(errors.password)}}
               isInvalid={!!errors.password}
             
               
               />
               <i
               className={`position-absolute ${
                 styles.iconEye
               }  fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} // Change the icon based on showPassword state
               onClick={togglePasswordVisibility}
               // style={{ color : "white" }}
               />

           
              {passwordError && (
              <p className='text-danger'>{passwordError}</p>
              )}
              </div>
            </Form.Group>

            <Form.Group className={`${styles.inputbox}`} controlId="formBasicRePassword">
              <Form.Label className={`${styles.label}`}>Confirm Password</Form.Label>
              <div className='position-relative'>
               <Form.Control
               className={`${styles.input}`}
               type={showrPassword ? 'text' : 'password'} // Toggle between text and password type
               placeholder="Confirm password"
               value={rePassword}
               onChange={(e) => {setRePassword(e.target.value);
              handlerePasswordlErr(e.target.value);
            setrePasswordError(errors.rePassword)}}
               isInvalid={!!errors.rePassword}
               
               />
               <i
               className={`position-absolute ${
                 styles.iconEye
               }  fas ${showrPassword ? 'fa-eye' : 'fa-eye-slash'}`} // Change the icon based on showrPassword state
               onClick={togglePasswordVisibility2}
               // style={{ color : "white" }}
               />

              {rePasswordError && (
                 <p className='text-danger'>{rePasswordError}</p>
              )}
              </div>
            </Form.Group>
            <Button variant="primary" type="submit" className={`${styles.button}`}>
              Reset Password
            </Button>
          </Form>

        </div>
      </div>

    </>
  );
}

export default ResetPassword;
