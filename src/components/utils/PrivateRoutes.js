import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
// import axiosInstance from '../axiosConfig/instanse';
import { axiosInstance } from '../../network/axiosinstance';
const PrivateRoutes = () => {

    const [isBusy, setIsBusy] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [authent, setAuthent] = useState({ "token": false });

    async function check() {
        axiosInstance.post(`/user/check/`,
            {
                token: token
            }).then(res => {
            setIsBusy(true);

            setAuthent({ "token": true });


        }).catch(err => {
            // console.log(err);
        })
    }

    useEffect(() => {

        if (token) {
            check();
        } else {
            navigate('/login');
        }

    }, [token]);

    return (
        <>
            {
                isBusy ? (authent.token ? <Outlet /> : <Navigate to="/login" />) : (<div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
                    <div>
                        <ReactLoading type="spin" color="#00537f"
                                      height={100} width={50} />
                    </div>

                </div>)

            }


        </>
    )


}
export default PrivateRoutes;