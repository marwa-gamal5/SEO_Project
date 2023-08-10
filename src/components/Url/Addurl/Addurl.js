import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './Addurl.module.css';
import swal from 'sweetalert';
import { axiosInstance } from '../../../network/axiosinstance';
import Swal from 'sweetalert2';

function Addurl(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const [url_component, setUrlComponent] = useState('');
    const token = localStorage.getItem("token");
    const [error, setError] = useState({});
    const errors = {};
    const [urlError , setUrlError] = useState('')
      const handleUrlBlur = (url_component) => {
        if (!url_component) {
          setUrlError('Url is required');
          errors.url = "Url is required"
          // console.log("From URL Handle Err")
        }
      };

    const sendData = () => {

      console.log("send data")

       // Validation rules
        handleUrlBlur(url_component)
        // Perform the API call if validations pass
    
        if (Object.keys(errors).length > 0) {
          setError(errors);
        } else {
          axiosInstance.post('/seo/add_url',
            {
                url_component: url_component,
              token: token,
    
            }, {
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "application/json"
    
            },
          }).then((res) => {
            console.log("res", res)
            if ('errors' in res.data) {
              if (res.data.errors === "Url_exists") {
                swal("Failed", "URL Component Already Exists", "error");
                setUrlComponent('')
              }
              else {
                swal("Failed", "Please Try Again", "error");
              }
            } else if ('success' in res.data) {
              // Clearing the errors if the submission is successful
              setError({});
              setUrlComponent('')
              props.fetchData();
              
              Swal.fire({
                position: 'cinter',
                icon: 'success',
                title: 'URL Added Successfullyy',
                showConfirmButton: false,
                timer: 1500
              })
            }
          }).catch((err) => {
            console.log("network error", err)
          })
          handleClose();
        }
       
    
    }
    return (
        <>
    
              <button className={`${styles.button}`} onClick={handleShow} >
                <i className="fa-solid fa-circle-plus fa-2xl" ></i>
              </button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add URL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                 
                  <Form>
    
                    <Form.Group className="mb-3" controlId="UrlComponent">
                      <Form.Label>URL Component</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter URL Component"
                        onChange={(e) =>{ setUrlComponent(e.target.value);
                          handleUrlBlur(e.target.value);}}
                      isInvalid={!!urlError}
                      // onBlur={handleUrlBlur}
                  />
                  {urlError && (<p className='text-danger'>{urlError}</p> )}
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
        </>
      )
}
  export default Addurl;