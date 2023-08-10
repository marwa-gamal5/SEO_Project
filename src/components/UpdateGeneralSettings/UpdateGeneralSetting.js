import {useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from '../../network/axiosinstance';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function UpdateGeneralSettings(props) {

  const [id , setID] = useState(props.data)
  const [base_url, setBaseUrl] = useState('');
  const [lang_name, setLangName] = useState('');
  const [lang_active, setLangActive] = useState('');
  const [addition_info, setAdditionInfo] = useState('');
  const token = localStorage.getItem("token");
  const [error, setError] = useState({});


  useEffect(() => {
    if (id) {
      console.log("from if")
       getOne(id)
   }

}, [id]);

function getOne(id) {
  console.log("from fun")
  axiosInstance.post('/seo/view_one_setting', {
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
          setBaseUrl(res.data.success.base_url);
          setLangName(res.data.success.language_name);
          setLangActive(res.data.success.language_active)
          setAdditionInfo(res.data.success.addition_info)
      })
      .catch((err) => {
          console.log("Error while fetching urls:", err);
      });

}

// Validation rules functions
const errors = {};
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
    console.log("From Send " ,base_url)

       // Validation rules
       handleUrlErr(base_url);
       handleLangNameError(lang_name);
       handleLangActiveError(lang_active);

    // Perform the API call if validations pass

    // console.log("tokennnnnn :" , token)
    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      axiosInstance.post('/seo/update_setting',
        {
          id : id,
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
            swal("Failed", "Base URL Already Exists", "error");
          }
          else {
            swal("Failed", "Please Try Again", "error");
          }
        } else {
          console.log(res.data);
          props.fetchData();
          
          Swal.fire({
            position: 'cinter',
            icon: 'success',
            title: 'General Settings Updated Successfully',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }).catch((err) => {
        console.log("network error", err)
      })

    }

  }
  return (
    <>           
              <Form>
                <Form.Group className="mb-3" controlId="base_url">
                  <Form.Label>Base URL</Form.Label>
                  <Form.Control
                    value={base_url}
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
                    value={lang_name}
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
                    value={lang_active}
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
                <Form.Group className="mb-3" controlId="addition_info">
                  <Form.Label>Additional Information</Form.Label>
                  <Form.Control
                    value={addition_info }
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
                  }}>
                  Update
                </Button>
              </Form>
    </>
  )

}
export default UpdateGeneralSettings;