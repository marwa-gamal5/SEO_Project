import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './AddTitle.module.css';
import { axiosInstance } from '../../../network/axiosinstance';
import swal from 'sweetalert';

import Swal from 'sweetalert2';


function AddTitle(props) {
  const [titles, setTitles] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState('');
  const [url_component, seturl_component] = useState('');
  const [identifier, setidentifier] = useState('');
  const [addition_info, setaddition_info] = useState('');
  const token = localStorage.getItem("token");
  const [error, setError] = useState({});
  const [urlComponentsOptions, setUrlComponentsOptions] = useState([]);
  useEffect(() => {

    axiosInstance.post('/seo/view_all_url', {}, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"

      },
    })
      .then((res) => {
        console.log("res:", res)
        setUrlComponentsOptions(res.data.success);
      })
      .catch((err) => {
        console.log("Error while fetching titles:", err);
      });

  }, [token]);
  const errors = {};

    // Validation rules functions
  const[nameErr , setNameErr] = useState("")
  const handleNameError = (name) => {
    if (!name) {
      errors.name = 'Name is required';
      setNameErr(errors.name)
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (/[@_&*():]/.test(name)) {
      errors.name = 'Name cannot contain special characters [@_&*():]';
    } 
    console.log("From handle : " , errors)
  };

  const [urlError , setUrlError] = useState('')
  const handleUrlErr = (url_component) => {
    if (!url_component) {
      errors.url_component = 'Url is required';
      // console.log("From URL Handle Err")
    } 
  };



  const sendData = () => {

    // setError({});


    // Validation rules
    handleNameError(name);
    handleUrlErr(url_component)
   
    // Perform the API call if validations pass

    // console.log("tokennnnnn :" , token)
    if (Object.keys(errors).length > 0) {
      // console.log("From IF" , Object.keys(errors))
      setError(errors);
    } else {
      axiosInstance.post('/seo/add_title',
        {
          name: name,
          url_component: url_component,
          identifier: identifier,
          addition_info: addition_info,
          token: token,

        }, {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"

        },
      }).then((res) => {
        console.log("res", res)
        if ('error' in res.data) {
          const apiError = res.data.error;
          if (apiError === "name_exists") {
            // window.alert("Name Already Exists")
            swal("Failed", "Name Already Exists", "error");
          }
          else if (apiError === "Url_component_exists") {
            swal("Failed", "URL Component Already Exists", "error");
            // window.alert("URL Component Already Exists")
          }
          else {
            // window.alert("Please Check Data You Entered")
            swal("Failed", "Please Try Again", "error");
          }
        } else {
          console.log(res.data);
          setTitles(res.data.success);
          // window.alert("Title Added Successfully")
          
          Swal.fire({
            position: 'cinter',
            icon: 'success',
            title: 'Title Added Successfully',
            showConfirmButton: false,
            timer: 1500
          })

          props.fetchData();
        }
        setName("")
        seturl_component("")
      }
      ).catch((err) => {
        console.log("network error", err)
      })
      handleClose();
  }
    //} window.alert(error.base_url) ;


  }
  return (
    <>

      <button className={`${styles.button}`} onClick={handleShow} >
        <i className="fa-solid fa-circle-plus fa-2xl" ></i>
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {error && <Alert variant="danger">{error}</Alert>}  */}
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder=" Enter the Name"
                onChange={(e) => {
                  setName(e.target.value)
                  handleNameError(e.target.value);
                  // console.log("Return : " ,errors.name)
                  setNameErr(errors.name)
                }}
                isInvalid={!!errors.name}
              />
              {/* {(errors.name ? console.log("TRUE") : console.log("FALSE"))} */}
              {nameErr && <p className='text-danger'>{nameErr}</p>}
            </Form.Group>


            <Form.Group className="mb-3" controlId="url_component">
              <Form.Label>URL Component</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  setidentifier(e.target.value);

                  let element = urlComponentsOptions.find((ele) => {
                    return ele.identifier == e.target.value;
                  });
                  seturl_component(element.url_component);
                  handleUrlErr(url_component)
                  setUrlError(errors.url_component)
                  console.log(element)
                }}
                isInvalid={!!error.url_component}
              >
                <option value="" disabled>Choose URL Component</option>
                {urlComponentsOptions.map((ele, index) => (
                  <option key={index} value={ele.identifier} >
                    {ele.url_component}
                  </option>
                ))}
              </Form.Control>
              {/* {urlError && <p className='text-danger'>{urlError}</p>} */}

            </Form.Group>
            <Form.Group className="mb-3" controlId="additionInfo">
              <Form.Label>Additional Information</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the Additional Information"
                onChange={(e) => setaddition_info(e.target.value)}
              />

            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                sendData();
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>



      {/* <select onChange={(e)=>{

          }}>
    {titles.map((ele,index)=>{
        <option value={ele.identifier}>{ele.url_component}</option>
    
    })}
   
</select> */}
    </>
  )

}
export default AddTitle;