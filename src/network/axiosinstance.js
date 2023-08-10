import axios from "axios";
export const axiosInstance = axios.create({
    baseURL : "http://192.168.11.98:8000/"
})






// Add a request interceptor
// axiosInstance.interceptors.request.use(function (config) {


//     config["params"] = {
//         "api-key" : "Hello interceptors"
//     }
//     store.dispatch(setLoader(true));
//     // store.dispatch(setLoader(true));
//     console.log("interceptors" , config)
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// // Add a response interceptor
// axiosInstance.interceptors.response.use(function (response) {
//     console.log("interceptors response" , response)
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     store.dispatch(setLoader(false))
//     return response;
//   }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   });