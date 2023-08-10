import { useState, useEffect } from 'react';
import { axiosInstance } from '../../network/axiosinstance';
import { Form } from 'react-bootstrap';
function ViewOneSetting(props) {
  

  // const ID =  9;
  const id = props.id;
  // console.log("ID From View One " ,typeof ID)
  const [record, setRecord] = useState({});
  let token = localStorage.getItem('token');
  async function viewOne(){


    axiosInstance.post('/seo/view_one_setting',
    { id : id },
    {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type":"application/json"  
        }
      }
      )
      .then((res) => {
        console.log("view One :" ,res)
        setRecord(res.data.success);
      })
      .catch((err) => {
        console.log("Error while retrieving one record :", err);
      });
  }
   useEffect(() => {
  if(id){
    viewOne();
  }
    } ,[id])
  

  return <>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Base URL</Form.Label>
                  <Form.Control
                    value={record?record.base_url:""}
                    type="text"
                    disabled = {true}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Language Name</Form.Label>
                  <Form.Control
                    value={record?record.language_name:""}
                    type="text"
                    disabled = {true}

                  />
                  
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Language Active</Form.Label>
                  <Form.Control
                    value={record?record.language_active :""}
                    type="text"
                    disabled = {true}

                  />
                  
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Additional Information</Form.Label>
                  <Form.Control
                    value={record?record.addition_info:""}
                    type="text"
                    disabled = {true}

                  />
                </Form.Group>
              </Form>
</>

}
export default ViewOneSetting;