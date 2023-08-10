import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../network/axiosinstance';
import Table from 'react-bootstrap/Table';
import NavBar from '../../../pages/NavBar/NavBar';
import SideBar from '../../../pages/SideBar/SideBar';
import { Modal } from 'react-bootstrap';
import UpdateUrl from '../UpdateUrl/UpdateUrl';
import ViewOneURL from "../ViewOneUrl/ViewOneUrl";
import Addurl from '../Addurl/Addurl';
function ViewAllUrl() {
  const [titles, setTitles] = useState([]);
  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [identifier ,setIdentifier] = useState('')


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let token = localStorage.getItem("token")
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type":"application/json"

      },
    };

    axiosInstance.post('/seo/view_all_url', {},{
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type":"application/json"
  
        },
      })
      .then((res) => {
        console.log(res)
        setTitles(res.data.success);
        handleClose();
      })
      .catch((err) => {
        console.log("Error while fetching titles:", err);
      });
  };

  const token = localStorage.getItem("token");

  const onDelete = (identifier) => {
  
 
    axiosInstance.post('/seo/delete_url',{
      identifier:identifier 
    },{
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type":"application/json"

      },
    })  
    .then((res) => {
      console.log("ondelete:" ,res);
      fetchData();
    })
    .catch((err) => {
      console.log("Error while deleting url_component:", err);
    });
  };

  return (
    <>
     <NavBar/>

<div className='row' >
    <div className="col-md-3">
        <SideBar/>
    </div>
    <div className="col-md-9">
      <Addurl fetchData = {fetchData}/>
    

      <Table  className={'${styles.table}'} striped bordered hover>
        <thead>
        <tr>
            <th style={{width: "35%"}} >URL Component</th>
            <th style={{width: "20%"}}>Edit</th>
            <th style={{width: "20%"}}>Delete</th>
            <th style={{width: "20%"}}>View</th>
           
          </tr>
         
        </thead>
        <tbody>
          {titles.map((title , index) => (
            <tr key={index}>
             <td>{title.url_component}</td>

            <td><i className="fa-solid fa-pen-to-square"  onClick={() => {
                    setIdentifier(title.identifier);
                    setUpdate(true)
                    handleShow()
                  }} ></i></td>
              <td><i type="button" className="fa-solid fa-trash-can" onClick={() =>onDelete(title.identifier)}></i></td>
              <td><i className="fa-solid fa-eye" onClick={() => {
                    setIdentifier(title.identifier);
                    setUpdate(false)
                    handleShow()
                  }}></i></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
    <Modal show={show} onHide={handleClose}>
        {update ? <><Modal.Header closeButton>
          <Modal.Title>Update URL</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateUrl fetchData = {fetchData} data = {identifier}/>
          </Modal.Body> </>
          :
          <><Modal.Header closeButton>
            <Modal.Title>View One URL</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ViewOneURL identifier = {identifier}/>
          </Modal.Body></>}
      </Modal>
    </>
  );
}

export default ViewAllUrl;
