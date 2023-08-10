import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './AddMeta.module.css';
import { axiosInstance } from '../../../network/axiosinstance';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function AddMeta(props) {
    const [titles, setTitles] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setname] = useState('');
    const [url_component, seturl_component] = useState('');
    const [identifier, setidentifier] = useState('');
    const [description, setdescription] = useState('');
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

     // Validation rules functions
     const errors = {};
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
        // console.log("From handle : " , errors)
    };

    const [urlError , setUrlError] = useState('')
    const handleUrlErr = (url_component) => {
      if (!url_component) {
        errors.url_component = 'Url is required';
        // console.log("From URL Handle Err")
      } 
    };

    const [descriptionError , setDescriptionError] = useState('')
    const handleDescriptionErr = (description) => {
      if (!description) {
        errors.description = 'Description is required';
      } 
    };

    
    const sendData = () => {

        // Validation rules
        handleNameError(name);
        handleUrlErr(url_component);
        handleDescriptionErr(description);
       
        // Perform the API call if validations pass
        // console.log("tokennnnnn :" , token)
        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            axiosInstance.post('/seo/add_meta',
                {
                    name: name,
                    url_component: url_component,
                    identifier: identifier,
                    addition_info: addition_info,
                    description: description,
                    token: token,

                }, {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"

                },
            }).then((res) => {
                console.log('res', res);
                if ('error' in res.data) {
                    const apiError = res.data.error;
                    if (apiError === 'name_exists') {
                        setError({ name: 'Name Already Exists' });
                    } else if (apiError === 'identifier_not_found') {
                        setError({ url_component: 'Invalid URL Component' });
                    } else if (apiError === 'url_component_not_found') {
                        setError({ url_component: 'URL Component Not Found' });
                    } else {
                        setError({ base: 'Please Check Data You Entered' });
                    }
                } else if ('success' in res.data) {
                    // Clearing the errors if the submission is successful
                    setError({});
                    props.fetchData();
                    // window.alert(res.data.success); // Show the success message
                   
                    Swal.fire({
                        position: 'cinter',
                        icon: 'success',
                        title: 'Meta Added Successfully',
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
                    <Modal.Title>Add Meta</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=" Enter the Name"
                                onChange={(e) => {
                                    setname(e.target.value)
                                    handleNameError(e.target.value);
                                    setNameErr(errors.name)
                                  }}
                                isInvalid={!!error.name}
                            />
                            {nameErr && <p className='text-danger'>{nameErr}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=" Enter the description"
                                onChange={(e) => {
                                    setdescription(e.target.value)
                                    handleDescriptionErr(e.target.value)
                                    setDescriptionError(errors.description)
                                }}
                                isInvalid={!!error.description}
                            />
                            {descriptionError && (<p className='text-danger'>{descriptionError}</p> )}

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
                            {urlError && <p className='text-danger'>{urlError}</p>}
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
        </>
    )

}
export default AddMeta;
