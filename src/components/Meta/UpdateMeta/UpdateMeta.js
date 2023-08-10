
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../../network/axiosinstance';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function UpdateMeta(props) {

    const [id, setId] = useState(props.data);
    const [name, setName] = useState('');
    const [url_component_name, setUrlComponentName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [description, setDescription] = useState('');
    const [addition_info, setAdditionInfo] = useState('');

    const token = localStorage.getItem("token");
    const [error, setError] = useState({});
    const [urlComponentsOptions, setUrlComponentsOptions] = useState([]);

    useEffect(() => {
        console.log("props", props.data)
        if (props.data) {
           console.log("from if")
            getOne(props.data)
        }
            // console.log("addition_info" , addition_info)
    }, [props.data]);

    function getOne(id) {
        console.log("from fun")
        axiosInstance.post('/seo/view_one_meta', {
            id: id
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"

            },
        })
            .then((res) => {
                
                // setRecord(res.data.success);
                console.log("One Record :", res.success)
                setUrlComponentName(res.data.success.url_component_name);
                setName(res.data.success.name);
                // console.log("Name :" , res.data.success.name)
                setAdditionInfo(res.data.success.addition_info)
                setDescription(res.data.success.description)
                setIdentifier(res.data.success.url_component_id)
                // setUrlComponentsOptions(res.data.success);
            })
            .catch((err) => {
                console.log("Error while fetching urls:", err);
            });

    }

    useEffect(() => {
        axiosInstance.post('/seo/view_all_url', {}, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then((res) => {
                console.log("URL response :", res)
                setUrlComponentsOptions(res.data.success);
            })
            .catch((err) => {
                console.log("Error while fetching urls:", err);
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
    const handleUrlErr = (url_component_name) => {
      if (!url_component_name) {
        errors.url_component_name = 'Url is required';
        // console.log("From URL Handle Err")
      } 
    };

    const [descriptionError , setDescriptionError] = useState('')
    const handleDescriptionErr = (description) => {
      if (!description) {
        errors.description = 'DescriptionUrl is required';
      } 
    };

    const sendData = () => {
        
        handleNameError(name);
        handleUrlErr(url_component_name);
        handleDescriptionErr(description);
        
        // Perform the API call if validations pass
        // console.log("tokennnnnn :" , token)
        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            axiosInstance.post('/seo/update_meta',
                {
                    id: id,
                    name: name,
                    url_component: url_component_name,
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
                    setError({});
                    props.fetchData();
                    // window.alert(res.data.success); // Show the success message
                    
                    Swal.fire({
                        position: 'cinter',
                        icon: 'success',
                        title: 'Meta Record Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })

                }
                setName("")
                setUrlComponentName("")

            }).catch((err) => {
                console.log("network error", err)
            })
        }
        // window.alert(error.base_url) ;

    }

    return <>

        <Form>

            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    value={name}
                    type="text"
                    placeholder="Enter the Name"
                    onChange={(e) => {
                        setName(e.target.value)
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
                    value={description}
                    type="text"
                    placeholder=" Enter the description"
                    onChange={(e) => {
                            setDescription(e.target.value)
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
                        setIdentifier(e.target.value);
                        let element = urlComponentsOptions.find((ele) => {
                            return ele.identifier == e.target.value;
                        });
                        setUrlComponentName(element.url_component);
                        handleUrlErr(url_component_name)
                        setUrlError(errors.url_component_name)
                        console.log(element)
                    }}
                    isInvalid={!!error.url_component}
                >
                    <option defaultValue value={identifier}>{url_component_name}</option>

                    {urlComponentsOptions.map((ele, index) => (
                        <option key={index} value={ele.identifier} >
                            {ele.url_component}
                        </option>
                    ))}
                </Form.Control>
                {urlError && <p className='text-danger'>{urlError}</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="addition_info">
                <Form.Label>Additional Information</Form.Label>
                <Form.Control
                    value={addition_info}
                    type="text"
                    placeholder="Enter the Additional Information"
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
                Update
            </Button>
        </Form>
    </>
}
export default UpdateMeta;