import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../network/axiosinstance';
import Table from 'react-bootstrap/Table';
import NavBar from '../../../pages/NavBar/NavBar';
import SideBar from '../../../pages/SideBar/SideBar';
import { Form, Modal } from 'react-bootstrap';
import ViewOneMeta from '../ViewOneMeta/ViewOneMeta';
import UpdateMeta from '../UpdateMeta/UpdateMeta';
import AddMeta from '../AddMeta/AddMeta';

function ViewAllMeta() {
    const [titles, setTitles] = useState([]);
    const [update, setUpdate] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [id, setId] = useState('')
    const [data, setData] = useState({});
    const [url_component, setUrlComponent] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [urlComponentsOptions, setUrlComponentsOptions] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [filteredTitles, setFilteredTitles] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);


    let token = localStorage.getItem("token")

    useEffect(() => {

        axiosInstance.post('/seo/view_all_url', {}, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then((res) => {
                console.log("res:", res)
                setUrlComponentsOptions(res.data.success);
            })
            .catch((err) => {
                console.log("Error while fetching titles:", err);
            });

    }, [token]);


    const fetchData = () => {
        axiosInstance.post('/seo/view_all_meta', {}, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
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

        axiosInstance.post('/seo/delete_meta', { id: id }, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
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
                title.url_component.toLowerCase().includes(searchValue.toLowerCase()) ||
                title.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                title.description.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(filtered)
        setFilteredTitles(filtered);
    };

    return <>
        <NavBar />
        <div className='row' >
            <div className="col-md-3">
                <SideBar />

            </div>
            <div className="col-md-9">
                <AddMeta fetchdata={fetchData} />
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label style={{ marginTop: "20px" }}>URL Component</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={(e) => {
                                setIdentifier(e.target.value);
                                let element = urlComponentsOptions.find((ele) => {
                                    return ele.identifier == e.target.value;
                                });
                                setUrlComponent(element.url_component);
                                fetchData()
                                console.log(element)
                            }}
                        >
                            <option value="" disabled>Choose URL Component</option>
                            {urlComponentsOptions.map((ele, index) => (
                                <option key={index} value={ele.identifier} >
                                    {ele.url_component}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                </Form>
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
                <Table className={'${styles.table}'} striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: "25%" }} >Name</th>
                            <th style={{ width: "25%" }}>URL Component</th>
                            <th style={{ width: "25%" }}>Description</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTitles.filter(filtered => filtered.url_component == url_component).map((title , index) => (
                            <tr key={index}>
                                <td>{title.name}</td>
                                <td>{title.url_component}</td>
                                <td>{title.description}</td>
                                <td><i type="button" className="fa-solid fa-pen-to-square" onClick={() => {
                                    setId(title.id);
                                    setUpdate(true)
                                    handleShow()
                                }}></i></td>
                                <td><i type="button" className="fa-solid fa-trash-can" onClick={() => onDelete(title.id)}></i></td>
                                <td><i type="button" className="fa-solid fa-eye" onClick={() => {
                                    setId(title.id);
                                    // check(title.id);
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
                <Modal.Title>Update Meta</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <UpdateMeta data={id} fetchData={fetchData} />
                </Modal.Body> </>
                :
                <><Modal.Header closeButton>
                    <Modal.Title>View Meta</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <ViewOneMeta id={id} />
                    </Modal.Body></>}
        </Modal>
    </>
}
export default ViewAllMeta;