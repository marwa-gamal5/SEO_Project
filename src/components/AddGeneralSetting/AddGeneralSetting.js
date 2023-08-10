import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './AddGeneralSetting.module.css';
import { axiosInstance } from '../../network/axiosinstance';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function AddGeneralSetting(props) {


  console.log(props)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [base_url, setBaseUrl] = useState('');
  const [lang_name, setLangName] = useState('');
  const [lang_active, setLangActive] = useState('');
  const [addition_info, setAdditionInfo] = useState('');
  const token = localStorage.getItem("token");
  const [error, setError] = useState({});
  const errors = {};


  // Validation rules functions
  const[langNameErr , setLangNameErr] = useState("")
  const handleLangNameError = (lang_name) => {
    if (!lang_name) {
      errors.lang_name = 'Language is required';
    }
  };

  const[langActiveErr , setLangActiveErr] = useState("")
  const handleLangActiveError = (lang_active) => {
    if (!lang_active) {
      errors.lang_active = 'Language Activation is required';
    }
  };

  const [urlError , setUrlError] = useState('')
  const handleUrlErr = (base_url) => {
    const urlRegex = new RegExp('^https?://([a-zA-Z0-9.-]{3,}\\.[a-zA-Z]{2,})$');
    if (!base_url) {
      errors.base_url = 'Base URL is required';
    } else if (!base_url.trim()) {
      errors.base_url = 'Base URL is required.';
    } else if (!urlRegex.test(base_url)) {
      errors.base_url = 'Invalid URL format. Please enter a valid URL.';
      console.log("From Invalid Format" , errors.base_url)
    }
  };


  const sendData = () => {


    // Validation rules
    handleUrlErr(base_url);
    handleLangNameError(lang_name);
    handleLangActiveError(lang_active);


    // Perform the API call if validations pass
    // console.log("tokennnnnn :" , token)
    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      axiosInstance.post('/seo/add_setting',
        {
          base_url: base_url,
          lang_name: lang_name,
          lang_active: lang_active,
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
          if (res.data.error === "base_url_exists") {
            // window.alert("Base URL Already Exists")
            swal("Failed", "Base URL Already Exists", "error");
            setBaseUrl('')
            setAdditionInfo('')
            setLangActive('')
            setLangName('')
          }
          else {
            // window.alert("Please Check Data You Entered")
            swal("Failed", "Please Check Data You Entered", "error");
          }
        } else if ('success' in res.data) {
          // Clearing the errors if the submission is successful
          setError({});
          setAdditionInfo('')
          setLangActive('')
          setLangName('')
          setBaseUrl('')
          props.fetchData();
          // window.alert(res.data.success); // Show the success message
         
          Swal.fire({
            position: 'cinter',
            icon: 'success',
            title: '"General Settings Added Successfully',
            showConfirmButton: false,
            timer: 1500
          })
      }
      }).catch((err) => {
        console.log("network error", err)
      })
     
      handleClose();
    }
    // window.alert(error.base_url) ;

  }
  return (
    <>

          <button className={`${styles.button}`} onClick={handleShow} >
            <i className="fa-solid fa-circle-plus fa-2xl" ></i>
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add General Setting</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* {error && <Alert variant="danger">{error}</Alert>}  */}
              <Form>
                <Form.Group className="mb-3" controlId="base_url">
                  <Form.Label>Base URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Base URL"
                    onChange={(e) => {setBaseUrl(e.target.value)
                      handleUrlErr(e.target.value)
                      setUrlError(errors.base_url)
                    }}
                    isInvalid={!!error.base_url}
                  />
                  {urlError && (
                     <p className='text-danger'>{urlError}</p>
                  )}

                </Form.Group>
                <Form.Group className="mb-3" controlId="lang_name">
                  <Form.Label>Language Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Language Name"
                    onChange={(e) => {setLangName(e.target.value)
                      handleLangNameError(e.target.value)
                      setLangNameErr(errors.lang_name)
                    }}
                    isInvalid={!!error.lang_name}
                  />
                  {langNameErr && (
                    <p className='text-danger'>{langNameErr}</p>
                  )}

                </Form.Group>
                <Form.Group className="mb-3" controlId="lang_active">
                  <Form.Label>Language Active</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Language Active"
                    onChange={(e) => {setLangActive(e.target.value)
                      handleLangActiveError(e.target.value)
                      setLangActiveErr(errors.lang_active)
                    }}
                    isInvalid={!!error.lang_active}
                  />
                   {langActiveErr && (
                    <p className='text-danger'>{langActiveErr}</p>
                  )}


                </Form.Group>
                <Form.Group className="mb-3" controlId="additionInfo">
                  <Form.Label>Additional Information</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Additional Information"
                    onChange={(e) => setAdditionInfo(e.target.value)}
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
    </>
  )

}
export default AddGeneralSetting;