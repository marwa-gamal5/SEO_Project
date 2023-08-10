import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../network/axiosinstance';
import { Form, Table } from 'react-bootstrap';
import swal from 'sweetalert';

function ViewOneUrl(props) {
  const identifier = props.identifier;
  let token = localStorage.getItem('token');
  // console.log(token)
  const [record, setRecord] = useState({});
  const [metaList, setMetaList] = useState([]);
  const [title, setTitle] = useState({})

  async function viewOne() {


    axiosInstance.post('/seo/view_one_url',
      { identifier: identifier },
      {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => {
        console.log(res.data)
        if ('error' in res.data) {
          if (res.data.error === "url_not_found") {
            swal("Failed", "URL Not Found", "error");
          } else if (res.data.error === "this_url_no_have_titles") {
            swal("Failed", "This URL has no title", "error");
          }
        } else {
          console.log("View one URL : ", res.data);
          setRecord(res.data.success);
          setMetaList(res.data.success.meta);
          setTitle(res.data.success.title)
        }
      })
      .catch((err) => {
        console.log("Error while retrieving one record :", err);
      });
  }

  useEffect(() => {
    if (identifier) {
      viewOne();
    }
  }, [identifier])

  return <>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>URL Component</Form.Label>
        <Form.Control
          value={record.url_component ? record.url_component : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={title.name ? title.name : ""}
          type="text"
          disabled={true}
        />
      </Form.Group>

    <Form.Group style={{borderTop : "1px solid #ccc", borderRadius:"8px", padding:"8px"}}>
      <Form.Label>Meta List</Form.Label>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "35%" }} >Name</th>
            <th style={{ width: "65%" }}>URL Component</th>
          </tr>
        </thead>
        <tbody>
          {
            metaList.map((meta , index) => (
              <tr key={index}>
                <td>{meta[0]}</td>
                <td>{meta[1]}</td>
              </tr>

            ))}
        </tbody>
      </Table>
      </Form.Group>
    </Form>

  </>

}
export default ViewOneUrl