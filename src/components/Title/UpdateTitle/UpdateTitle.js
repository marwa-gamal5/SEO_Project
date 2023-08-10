
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../../network/axiosinstance';
import swal from 'sweetalert';
import Swal from 'sweetalert2';


function UpdateTitle(props) {

    const [id, setID] = useState(props.data)
    const [url_component, setUrlComponent] = useState('');
    const [name, setName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [addition_info, setAdditionInfo] = useState('');
    const [error, setError] = useState({});
    const token = localStorage.getItem("token");
    const [urlComponentsOptions, setUrlComponentsOptions] = useState([]);

    useEffect(() => {
        if (id) {
            console.log("from if")
             getOne(id)
         }
     
    }, [id]);

    function getOne(id) {
        console.log("from fun")
        axiosInstance.post('/seo/view_one_title', {
            id: id
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
      
            },
        })
            .then((res) => {
                // setRecord(res.data.success);
                console.log("One Record :", res.data.success)
                setUrlComponent(res.data.success.title.url_component_name);
                setIdentifier(res.data.success.title.url_component_id);
                setName(res.data.success.title.name);
                setAdditionInfo(res.data.success.title.addition_info)
            })
            .catch((err) => {
                console.log("Error while fetching urls:", err);
            });
      
      }

    useEffect(() => {
        axiosInstance.post('/seo/view_all_url', {},{
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type":"application/json"
          },
        })
        .then((res) => {
          console.log("View Url Res :", res)
            setUrlComponentsOptions(res.data.success);
        })
        .catch((err) => {
          console.log("Error while fetching titles:", err);
        });
     
    
    }, [token]);
  
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
        handleNameError(name)
        handleUrlErr(url_component)

        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            axiosInstance.post('/seo/update_title',
                {
                    id : id,
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
                        swal("Failed", "Name Already Exists", "error");
                    }
                    else if (apiError === "Url_component_exists") {
                        swal("Failed", "URL Component Already Exists", "error");
                    }
                    else if (apiError === "title_not_found") {
                        swal("Failed", "Title Not Found", "error");
                    } else if (apiError === "identifier_not_found&&url_component_not_found") {
                        swal("Failed", "URL Found", "error");
                    } else {
                        swal("Failed", "Please Try Again", "error");
                    }
                } else {
                    console.log("Response Data " ,res.data);
                    props.fetchData();
                   
                    Swal.fire({
                        position: 'cinter',
                        icon: 'success',
                        title: 'Title Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            }).catch((err) => {
                console.log("network error", err)
            })
            // setName("")
            // setUrlComponent("")
        }
    }

    return <>
        <Form>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    value={name}
                    type="text"
                    placeholder="Name"
                    onChange={(e) => {
                    setName(e.target.value)
                    handleNameError(e.target.value);
                    // console.log("Return : " ,errors.name)
                    setNameErr(errors.name)
                    }}
                    isInvalid={!!errors.name}
              />
              {nameErr && <p className='text-danger'>{nameErr}</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="url_component">
              <Form.Label>URL Component</Form.Label>
              <Form.Control
                as="select"
                // value={url_component}
                onChange={(e) =>{
                    setIdentifier(e.target.value);
                  
                    let element = urlComponentsOptions.find((ele)=>{
                        return ele.identifier == e.target.value;
                    });
                    setUrlComponent(element.url_component);
                    handleUrlErr(url_component)
                    setUrlError(errors.url_component)
                    console.log(element)
                }}
                isInvalid={!!error.url_component}
              >
                <option defaultValue value={identifier}>{url_component}</option>
                {urlComponentsOptions.map((ele , index) => (
                  <option key={index} value={ele.identifier} >
                    {ele.url_component}
                  </option>
                ))}
              </Form.Control>
              {urlError && <p className='text-danger'>{urlError}</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="addition_info">
                <Form.Label>Addition Information</Form.Label>
                <Form.Control
                    value={addition_info}
                    type="text"
                    placeholder="Addition Information"
                    onChange={(e) => setAdditionInfo(e.target.value)}
                    isInvalid={!!error.addition_info}
                />
                {error.addition_info && (
                    <Form.Control.Feedback type="invalid">
                        {error.addition_info}
                    </Form.Control.Feedback>
                )}
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                    e.preventDefault();
                    sendData();
                }}>
                Update
            </Button>
        </Form>

    </>
}
export default UpdateTitle;