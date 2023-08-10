import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './SearchforTitleByURL.module.css';
import { axiosInstance } from '../../../network/axiosinstance';

function SearchforTitleByURL() {
    const [titles, setTitles] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [url_component, setUrl_component] = useState('');
    const [identifier, setIdentifier] = useState('');
    const token = localStorage.getItem('token');
    const [error, setError] = useState({});
    const [urlComponentsOptions, setUrlComponentsOptions] = useState([]);
    // const [name, setname] = useState('');

    const fetchTitleName = (selectedIdentifier) => {
        axiosInstance
            .post(
                '/seo/search_title',
                {
                    url_component: url_component,
                    identifier: selectedIdentifier,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((res) => {
                console.log('Title name response:', res);
                if (res.data && 'title_name' in res.data) {
                    // setname(res.data.name);
                }
            })
            .catch((err) => {
                console.log('Error while fetching Title name:', err);
            });
    };


    useEffect(() => {
        axiosInstance
            .post('/seo/view_all_url', {}, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log('res:', res);
                setUrlComponentsOptions(res.data.success);
            })
            .catch((err) => {
                console.log('Error while fetching titles:', err);
            });
    }, [token]);

    const searchTitle = (identifier , urlComponent) => {
        const requestData = {
            url_component: urlComponent,
            identifier: identifier,
        };

        axiosInstance
            .post('/seo/search_title', requestData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log('Search result:', res.data);

                setTitles(res.data.success.name);
            })
            .catch((err) => {
                console.log('Error while searching title:', err);
            });
    };

    const sendData = (identifier , urlComponent) => {
        const errors = {};

        // Validation rules
        if (!urlComponent) {
            errors.url_component = 'url_component is required';
        }

        // Perform the API call if validations pass
        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            searchTitle(identifier , urlComponent);
        }
    };

    return (
        <>
            <button className={`${styles.button}`} onClick={handleShow}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Search for Title by Url_Component</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>URL Component</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => {
                                    // setIdentifier(e.target.value);

                                    let element = urlComponentsOptions.find((ele) => {
                                        return ele.identifier == e.target.value;
                                    });
                                    // setUrl_component(element.url_component);

                                    sendData(e.target.value , element.url_component)
                                    console.log(element);
                                }}
                                isInvalid={!!error.url_component}
                            >
                                <option value="">Choose URL Component</option>
                                {urlComponentsOptions.map((ele, index) => (
                                    <option key={index} value={ele.identifier}>
                                        {ele.url_component}
                                    </option>
                                ))}
                            </Form.Control>
                            {error.url_component && (
                                <Form.Control.Feedback type="invalid">
                                    {error.url_component}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Title Name</Form.Label>
                            <Form.Control type="text" placeholder=" Name of Title is " />
                        </Form.Group> */}
                        {/* Display the fetched Title name */}
                        {titles && (
                            <>
                            <h5>Title Name : <span className='fw-light text-muted'>{titles}</span></h5>
                         
                                
                            </>
                          
                     
                        )}

                        {/* <Button
                            variant="primary"
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                sendData();
                            }}
                        >
                            Submit
                        </Button> */}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SearchforTitleByURL;
