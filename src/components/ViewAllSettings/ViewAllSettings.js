import { useState, useEffect } from 'react';
import { axiosInstance } from '../../network/axiosinstance';
import Table from 'react-bootstrap/Table';
import NavBar from '../../pages/NavBar/NavBar';
import SideBar from '../../pages/SideBar/SideBar';
import Modal from 'react-bootstrap/Modal';
import ViewOneSetting from '../ViewOneSetting/ViewOneSetting';
import AddGeneralSetting from '../AddGeneralSetting/AddGeneralSetting';
import UpdateGeneralSettings from '../UpdateGeneralSettings/UpdateGeneralSetting';
function ViewAllSettings() {
  const [titles, setTitles] = useState([]);
  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let token = localStorage.getItem("token")
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"

      },
    };
  

    axiosInstance.post('/seo/view_all_setting', {}, {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"

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
  const onDelete = (id) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"

      },
    };
    axiosInstance.post('/seo/delete_setting', { id: id }, config)
      .then((res) => {
        console.log(res);
        fetchData();
      })
      .catch((err) => {
        console.log("Error while deleting setting:", err);
      });
      handleClose();
  };
  
  //Updating
  const [data ,setData] = useState({})
  const [id ,setId] = useState('')

    return (
      <>
        <NavBar/>
        <div className='row' >
          <div className="col-md-3">
            <div>
            <SideBar/>
            </div>
          </div>
          <div className="col-md-9">
            <AddGeneralSetting  fetchData = {fetchData}/>

            <Table className={'${styles.table}'} striped bordered hover>
              <thead>
                <tr>
                  <th>Base URL</th>
                  <th>Language Name</th>
                  <th>Language Active</th>
                  <th>Additional Information</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>View</th>

                </tr>
              </thead>
              <tbody>
                {titles.map((title,index) => (
                  <tr key={index}>
                    <td>{title.base_url}</td>
                    <td>{title.lang_name}</td>
                    <td>{title.lang_active}</td>
                    <td>{title.addition_info}</td>
                    <td><i type="button" className="fa-solid fa-pen-to-square" onClick={() => {
                    setId(title.id);
                    setUpdate(true)
                    handleShow()
                  }}></i></td>

                  <td><i type="button" className="fa-solid fa-trash-can" onClick={() => onDelete(title.id)}></i></td>

                  <td><i type="button" className="fa-solid fa-eye" onClick={() => {
                    setId(title.id);
                    setUpdate(false)
                    handleShow()

                  }}>

                  </i></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>


        <Modal show={show} onHide={handleClose}>
        {update ? <><Modal.Header closeButton>
          <Modal.Title>Update General Setting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateGeneralSettings fetchData = {fetchData} data = {id}/>
          </Modal.Body> </>
          :
          <><Modal.Header closeButton>
            <Modal.Title>View One Setting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ViewOneSetting id = {id}/>
          </Modal.Body></>}
      </Modal>

      </>
    );
  }

export default ViewAllSettings;
