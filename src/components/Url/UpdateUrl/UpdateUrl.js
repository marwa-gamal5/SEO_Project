import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../../network/axiosinstance';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function UpdateUrl(props) {
    const [id, setID] = useState(props.data)
    const [url_component, setUrlComponent] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [error, setError] = useState({});
    const token = localStorage.getItem("token");


    useEffect(() => {
        if (id) {
            console.log("from if")
             getOne(id)
         }
    }, [id]);

    function getOne(id) {
        console.log("from fun")
        axiosInstance.post("/seo/view_one_url", {
            identifier: id
        }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then((res) => {
                // setRecord(res.data.success);
                console.log("One Record :", res.data)
                if ('error' in res.data) {
                    if (res.data.error === "url_not_found") {
                        swal("Failed", "URL Not Found", "error");
                    } else if (res.data.error === "this_url_no_have_titles") {
                        swal("Failed", "This URL has no title", "error");
                    }
                  } else {
                    setUrlComponent(res.data.success.url_component);
                    setIdentifier(res.data.success.identifier);
                 }})
            .catch((err) => {
                console.log("Error while fetching urls:", err);
            });
      
      }
      const [urlError , setUrlError] = useState('')
      const handleUrlBlur = (url_component) => {
        if (!url_component) {
          setUrlError('Url is required');
          console.log("From URL Handle Err")
        } else {
          setUrlError('');
        }
      };


    const sendData = () => {
        const errors = {};
        // Validation rules
        handleUrlBlur(url_component)
        // Perform the API call if validations pass

        // console.log("tokennnnnn :" , token)
        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            axiosInstance.post('/seo/update_url',
                {
                    url_component: url_component,
                    token: token,
                    identifier: identifier
                }, {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
            }).then((res) => {
                console.log("res", res)
                if ('error' in res.data) {
                    if (res.data.error === "url_component_exists") {
                        swal("Failed", "URL Component Already Exists", "error");
                    } else {
                        swal("Failed", "URL Not Found", "error");
                    }
                } else {
                    console.log(res.data);
                    props.fetchData();
                    
                    Swal.fire({
                        position: 'cinter',
                        icon: 'success',
                        title: 'URL Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            }).catch((err) => {
                console.log("network error", err)
            })
   
    }

    }
    return <>

        <Form>
            <Form.Group className="mb-3" controlId="url_component">
                <Form.Label>URL Component</Form.Label>
                <Form.Control
                    value={url_component}
                    type="text"
                    placeholder="Enter URL Component"
                    onChange={(e) =>{ setUrlComponent(e.target.value);
                    handleUrlBlur(e.target.value);}}
                    isInvalid={!!urlError}
                    // onBlur={handleUrlBlur}
                />
                {urlError && (
                    <Form.Control.Feedback type="invalid">
                        {urlError}
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
export default UpdateUrl;