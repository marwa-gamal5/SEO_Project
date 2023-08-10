import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../network/axiosinstance';
import { Form } from 'react-bootstrap';

function ViewOneTitle(props) {
  const ID = props.id
  const [record, setRecord] = useState({});
  let token = localStorage.getItem('token');

  async function viewOne() {

    axiosInstance.post('/seo/view_one_title',
      { id: ID },
      {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => {
        console.log("view One :", res)
        setRecord(res.data.success.title);
        console.log("view One Record :", record)
      })
      .catch((err) => {
        console.log("Error while retrieving one record :", err);
      });
  }
  useEffect(() => {
    if (ID) {
      viewOne();
    }
  }, [ID])

  return <>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Name</Form.Label>
        <Form.Control
          value={record.name ? record.name : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>URL Component</Form.Label>
        <Form.Control
          value={record.url_component_name ? record.url_component_name : ""}
          type="text"
          disabled={true}
        />

      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Additional Information</Form.Label>
        <Form.Control
          value={record.addition_info ? record.addition_info : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>
    </Form>

  </>
}
export default ViewOneTitle;