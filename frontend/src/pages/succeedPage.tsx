import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../components/Loading";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SucceededPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

            useQuery({
                queryKey:['succeed'] , 
                queryFn: async () => {
                    const response = await axios.post(`http://localhost:3000/api/succeeded-payment?orderId=${orderId}`);
                    if(response.data){
                        navigate('/')
                    }
                    return response.data;
                },
                
            });

        

    return (
        <div className='loading-suspense-container'><LoadingComponent/></div>
    );
};

export default SucceededPage;
