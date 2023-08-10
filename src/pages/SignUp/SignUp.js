
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../network/axiosinstance';
import styles from './SignUp.module.css'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


function SignUp() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState({});
  const navigate =useNavigate();
  const  [showPassword,setShowPassword] = useState(false); 
  const  [showrPassword,setShowrPassword] = useState(false); 
  const errors = {};
    // Validation rules functions
    const[fullNameErr , setfullNameErr] = useState("")
    const handleFullNameError = (fullName) => {
       // Validate Full Name
    if (!fullName) {
      errors.fullName = 'Full Name is required';
    } else if (fullName.length > 50) {
      errors.fullName = 'Full Name must be less than 50 characters';
    } else if (fullName.length < 5) {
      errors.fullName = 'Full Name must be at least 5 characters';
    }
    };

    const[usernameErr , setusernameErr] = useState("")
    const handleuUernameError = (username) => {
   // Validate Username
   if (!username) {
    errors.username = 'Username is required';
  } else {
    if (username.length < 8) {
      errors.username = 'Username must be at least 8 characters';
    } else if (username.length > 25) {
      errors.username = 'Username must be less than 25 characters';
    } else if (/\s/.test(username)) {
      errors.username = 'Username must not contain spaces';
    } else if (username.toLowerCase().includes('name')) {
      errors.username = 'Username must not contain the word "name"';
    } else if (/\d/.test(username)) {
      errors.username = 'Username must not contain digits';
    } else if (/[!@#_$%^&*()<>?/\\|}{~:]/.test(username)) {
      errors.username = 'Username must not contain special characters';
    }
  }
    };
    

    const [PasswordError , setPasswordError] = useState('')
    const handlePasswordErr = (password) => {
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

    
    const [EmailError , setEmailError] = useState('')
    const handleEmailErr = (email) => {
      
        // Validate Email
    if (!email) {
      errors.email = 'Email is required';
    } else {
      if (email.length < 8) {
        errors.email = 'Email must be at least 8 characters';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Invalid email format';
      }
    }
  
    };

    const [RePasswordError , setRePasswordError] = useState('')
    const handleRePasswordErr = (password,rePassword) => {
      // Validate rePassword
      if (!rePassword) {
        errors.rePassword = 'Confirm Password is required';
      } else {
     if (password !== rePassword) {
        errors.rePassword = "Passwords don't match";
      }}
  
    };
  
    const [PhoneError , setPhoneError] = useState('')
    const handlePhoneErr = (phone) => {
       // Validate Phone Number
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else {
      if (phone.length !== 11) {
        errors.phone = 'Phone number must be 11 digits long';
      } else if (!/^\d+$/.test(phone)) {
        errors.phone = 'Phone number must contain only digits';
      }
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    handleFullNameError(fullName);
    handleuUernameError(username);
    handleEmailErr(email);
    handlePasswordErr(password);
    handleRePasswordErr(password,rePassword);
    handlePhoneErr(phone);

   
    

   
    // If there are any validation errors, update the state
    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      await axiosInstance.post('/user/register/', {
        fullname: fullName,
        username: username,
        email: email,
        password: password,
        re_password: rePassword,
        phone: phone,
      }).then((res) => {
        console.log("res", res)
        if ('error' in res.data) {
          console.log(res.data);
          if (res.data.error === "username_exist") {
            swal("Failed", "Username Already Exists, Try another One", "error");
          }
          if (res.data.error === "email_exist") {
            swal("Failed", "E-mail Already Registered, Try to Log in..", "error");
          }
          if (res.data.error === "phone_exist") {
            swal("Failed", "Phone Number Already Exists, Try another One", "error");
          }

        } else  if ('success' in res.data) {
        console.log(res.data);
        
        Swal.fire({
          position: 'cinter',
          icon: 'success',
          title: 'Signed Up Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        navigate('/login');
      }}).catch((err) => {
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
     <div  className={`${styles.container}`}>
      <h3 className={`${styles.title}`}>Sign Up</h3>
      <Form onSubmit={handleSubmit} className={`${styles.content}`}>
      <Form.Group controlId="formBasicFullname" className={`${styles.inputbox}`}>
          <Form.Label className={`${styles.label}`}>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => {setFullName(e.target.value)
            handleFullNameError(e.target.value);
            setfullNameErr(errors.fullName)}}
            isInvalid={!!errors.fullName}
          />
          {fullNameErr && (
          <p className='text-danger'>{fullNameErr}</p>
          )}
        </Form.Group>

        <Form.Group className={`${styles.inputbox}`} controlId="formBasicUsername">
          <Form.Label className={`${styles.label}`}>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>{ setUsername(e.target.value)
            handleuUernameError(e.target.value);
            setusernameErr(errors.username)
            }}
            isInvalid={!!errors.username}
          />
            {usernameErr && (
          <p className='text-danger'>{usernameErr}</p>
          )}
        </Form.Group>

        <Form.Group className={`${styles.inputbox}`} controlId="formBasicEmail">
          <Form.Label className={`${styles.label}`}>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>{ setEmail(e.target.value)
            handleEmailErr(e.target.value);
          setEmailError(errors.email)}}
            isInvalid={!!errors.email}
          />
          {EmailError && (
          <p className='text-danger'>{EmailError}</p>
          )}
        </Form.Group>

        <Form.Group className={`${styles.inputbox}`} controlId="formBasicPassword">
          <Form.Label className={`${styles.label}`}>Password</Form.Label>
          <div className='position-relative'>
          <Form.Control
          type={showPassword ? 'text' : 'password'} // Toggle between text and password type
            placeholder="Password"
            value={password}
            onChange={(e) => {setPassword(e.target.value)
            handlePasswordErr(e.target.value);
          setPasswordError(errors.password)}}
            isInvalid={!!errors.password}
            />
            <i
            className={`position-absolute ${
              styles.iconEye
            }  fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} // Change the icon based on showPassword state
            onClick={togglePasswordVisibility}
            // style={{ color : "white" }}
            />
          
          {PasswordError && (
          <p className='text-danger'>{PasswordError}</p>
          )}
            </div>
        </Form.Group>

        <Form.Group className={`${styles.inputbox}`} controlId="formBasicRePassword">
          <Form.Label className={`${styles.label}`}>Confirm Password</Form.Label>
          <div className='position-relative'>
          <Form.Control
             type={showrPassword ? 'text' : 'password'} // Toggle between text and password type
            placeholder="Confirm password"
            value={rePassword}
            onChange={(e) => {setRePassword(e.target.value);
            handleRePasswordErr(password , e.target.value);
            setRePasswordError(errors.rePassword)}}
            isInvalid={!!errors.rePassword}
          />
          <i
               className={`position-absolute ${
                 styles.iconEye
               }  fas ${showrPassword ? 'fa-eye' : 'fa-eye-slash'}`} // Change the icon based on showrPassword state
               onClick={togglePasswordVisibility2}
               // style={{ color : "white" }}
               />
           
           {RePasswordError && (
          <p className='text-danger'>{RePasswordError}</p>
          )}
          
              </div>
        </Form.Group>

        <Form.Group className={`${styles.inputbox}`} controlId="formBasicPhone">
          <Form.Label className={`${styles.label}`}>Phone</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => {setPhone(e.target.value)
            handlePhoneErr(e.target.value);
          setPhoneError(errors.phone)}}
            isInvalid={!!errors.phone}
          />
           {PhoneError && (
          <p className='text-danger'>{PhoneError}</p>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className={`${styles.button}`}>
          Sign Up
        </Button>
        <p className={`${styles.loginlink}`}>Already have an account? 
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
export default SignUp;