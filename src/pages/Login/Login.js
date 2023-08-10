import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../network/axiosinstance';
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);


  const errors = {};
  // Validation rules functions
  const[nameErr , setNameErr] = useState("")
  const handleNameError = (username) => {
    if (!username) {

      errors.username = 'Username is required';
    }
  };

  const[passwordErr , setpasswordErr] = useState("")
  const handlpasswordErr = (password) => {
    if (!password) {

      errors.password = 'Password is required';
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    handleNameError(username);
    handlpasswordErr(password);

  
    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      await axiosInstance.post('/user/login/', {
        username: username,
        password: password
      }).then((res) => {
        console.log("res", res)
        if ('error' in res.data) {
          if (res.data.error === "username_not_exist") {
            //Username Err
            swal("Failed", "This Username is not registered", "error");

          }
          if (res.data.error === "user_is_not_active") {
            //Username Active Err
            swal("Failed", "This Username is not Active", "error");

          } else if (res.data.error ===  "wrong_username_or_password"){
            //Password Err
            swal("Failed", "Password is Incorrect", "error");
          }
        } else  {
          const token = res.data.token;
          // Store token in local storage
          localStorage.setItem('token', token);
          
          // Redirect the user to the logged-in area of your app
          navigate('/ViewAllSettings');
          

          Swal.fire({
            position: 'cinter',
            icon: 'success',
            title: 'Logged In Successfully',
            showConfirmButton: false,
            timer: 1500
          })

        } 
      }).catch((err) => {
        //Network Err
        console.log("err", err)
      });

      
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (

    <>
      <div className={`${styles.body}`}>
        <div className={`${styles.container}`}>
          <h3 className={`${styles.title}`}>Login</h3>
          <Form onSubmit={handleSubmit} className={`${styles.content}`}>
            <Form.Group className={`${styles.inputbox}`} controlId="formBasicUsername">
              <Form.Label className={`${styles.label}`}>Username</Form.Label>
              <Form.Control
                className={`${styles.input}`}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {setUsername(e.target.value)
                  handleNameError(e.target.value);
                setNameErr(errors.username)}}
                isInvalid={!!errors.username}
              />
              {nameErr && (
                <p className='text-danger'>{nameErr}</p>
            )}
            </Form.Group>

            <Form.Group className={`${styles.inputbox}`} controlId="Password">
              <Form.Label className={`${styles.label}`}>Password</Form.Label>
              <div className='position-relative'>
                  <Form.Control
                  className={`${styles.input}`}
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password type
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)
                    handlpasswordErr(e.target.value);
                    setpasswordErr(errors.password)
                  }}
                  isInvalid={!!errors.password}
                
                  
                  />
                  <i
                  className={`position-absolute ${
                    styles.iconEye
                  }  fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} // Change the icon based on showPassword state
                  onClick={togglePasswordVisibility}
                  // style={{ color : "white" }}
                  />

             
             
              {passwordErr&& (
               <p className='text-danger'>{passwordErr}</p>
              )}
               </div>
           
            </Form.Group>
            <p className={`${styles.passlink}`}>
              <Link className="text-primary" as={Link} to="/forgotpassword">
                Forgot password?
              </Link>
            </p>
            <Button variant="primary" type="submit" className={`${styles.button}`}>
              Login
            </Button>
            <p className={`${styles.signuplink}`}>Not a member?
              <Link className="text-primary" as={Link} to="/signup">
                Create account
              </Link>
            </p>
          </Form>

        </div>
      </div>

    </>
  );
}

export default Login;








