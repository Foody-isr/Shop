import axios from "axios";


const baseURL = process.env.REACT_APP_BASE_API_URL;
const axiosInstance = axios.create({
  baseURL,
//   withCredentials: true
});

// axiosInstance.interceptors.request.use(function (config) {
//   const token = localStorage.getItem("accessToken");
//   if(token){
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => {
//     if(response.status === 401){
//     window.location.replace("http://localhost:3001/auth/signin");
//     }else {
//       return response
//     }
//   },
//   (error) =>
//     {

//       error && console.log('ERROR' , error)
//       if(error.status === 401){
//         window.location.replace("http://localhost:3001/auth/signin");
//       }
//       // const dispatch = useDispatch();
//       // console.log('error ', error)
//       // dispatch({type: SET_ERROR, error})
//     //   Promise.reject(
//     //   (error.response && error.response.data) || "Something went wrong"
//     // )
//   }
// );

export default axiosInstance;
