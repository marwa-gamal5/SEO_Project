import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../network/axiosinstance';
import Table from 'react-bootstrap/Table';
import NavBar from '../../../pages/NavBar/NavBar';
import SideBar from '../../../pages/SideBar/SideBar';
import SearchforTitleByURL from '../SearchforTitleByURL/SearchforTitleByURL';
import AddTitle from '../AddTitle/AddTitle';
import UpdateTitle from '../UpdateTitle/UpdateTitle';
import ViewOneTitle from '../ViewOneTitle/ViewOneTitle';
import { Modal } from 'react-bootstrap';

function ViewAllTitles() {
  const [titles, setTitles] = useState([]);
  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [id, setId] = useState('')
  
  useEffect(() => {
    fetchData();
  }, []);
  
  let token = localStorage.getItem("token")

  const fetchData = () => {
    axiosInstance.post('/seo/view_all_title', {},{
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type":"application/json"
        },
      })
      .then((res) => {
        console.log(res)
        setTitles(res.data.success);
        setFilteredTitles(res.data.success);
        handleClose();
      })
      .catch((err) => {
        console.log("Error while fetching titles:", err);
      });
  };



  const onDelete = (id) => {
   
    axiosInstance.post('/seo/delete_title',{id:id },{
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type":"application/json"

      },
    })  
    .then((res) => {
      console.log(res);
      fetchData();
    })
    .catch((err) => {
      console.log("Error while deleting setting:", err);
    });
  };

 // Function to handle search input change and update filtered suggestions
 const handleSearchInputChange = (event) => {
  const searchValue = event.target.value;
  setSearchInput(searchValue);
  const filtered = titles.filter(
    (title) =>
      title.url_component.toLowerCase().includes(searchValue.toLowerCase())||
      title.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  console.log(filtered)
  setFilteredTitles(filtered);
};


  return (
    <>
    <NavBar/>
    <div className='row' >
        <div className="col-md-3">
            <SideBar/>
        </div>
        <div className="col-md-9">
          <AddTitle fetchData = {fetchData}/>
          <SearchforTitleByURL/>
                    {/*  Search input */}
                    <input  
            type="search"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search..."
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
              width: '100%',
              maxWidth: '400px',
              marginBottom: '10px',
            }}
          />
         <Table  className={'${styles.table}'} striped bordered hover>
            <thead>
            <tr>
                <th  style={{width: "35%"}} >Name</th>
                <th  style={{width: "35%"}} >URL Component</th>
                <th  style={{width: "10%"}} >Edit</th>
                <th  style={{width: "10%"}} >Delete</th>
                <th  style={{width: "10%"}} >View</th>
              
              </tr>
            </thead>
            <tbody>
              {filteredTitles.map((title, index) => (
                <tr key={index}>
                  <td>{title.name}</td>
                  <td>{title.url_component}</td>
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

                  }}></i></td>
                </tr>
              ))}

            </tbody>
          </Table>
        </div>
    </div>
    <Modal show={show} onHide={handleClose}>
        {update ? <><Modal.Header closeButton>
          <Modal.Title>Update Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateTitle fetchData = {fetchData} data = {id}/>
          </Modal.Body> </>
          :
          <><Modal.Header closeButton>
            <Modal.Title>View Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ViewOneTitle id = {id}/>
          </Modal.Body></>}
      </Modal>
    </>
  );
}



export default ViewAllTitles;