import { useState ,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { axiosInstance } from '../../../network/axiosinstance';

function ViewOneMeta(props) {
    console.log("Props : " , props)
    const id = props.id
    const [record, setRecord] = useState({});
    let token = localStorage.getItem('token');

    async function viewOne(){

        axiosInstance.post('/seo/view_one_meta',
        { id : id },
        
        {
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type":"application/json"  
            }
          }
          )
          .then((res) => {
            console.log("view One Meta :" ,res)
            setRecord(res.data.success);
            console.log("view One Meta Record :" ,record)
          })
          .catch((err) => {
            console.log("Error while retrieving one record :", err);
          });
      }
    useEffect(() => {
        if(id){
            viewOne();
        }} ,[id])

        return <>
  <Form>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Name</Form.Label>
        <Form.Control
          value={record ? record.name : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>URL Component</Form.Label>
        <Form.Control
          value={record ? record.url_component_name : ""}
          type="text"
          disabled={true}
        />

      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Description</Form.Label>
        <Form.Control
          value={record ? record.description : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>
    
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Additional Information</Form.Label>
        <Form.Control
          value={record ? record.addition_info : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>
    </Form>
        </>
}
export default ViewOneMeta ;