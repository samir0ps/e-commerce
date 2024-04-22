import React, { SetStateAction} from "react"
import { useNavigate , useLocation } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import {motion} from "framer-motion"
interface userData {
        user:{
            info:{
                firstName : string ; 
                lastName : string ; 
                email :string ;
                id : string ; 
                role:string ;
            } ; 
            status:string
        }

}

const DropDown = ({openOptions , setOpenOptions}:{openOptions: boolean , setOpenOptions:React.Dispatch<SetStateAction<boolean>>})=>{
    const path = useLocation()
    const pathName = path.pathname
    
    const navigate = useNavigate()
    const handleClickAccount = ()=>{
        navigate(`/user/account/settings/${data?.user.info.id}`)
        setOpenOptions(false)
    }
    
    const queryClient = useQueryClient()
    const data = queryClient.getQueryData<userData>(["user"])
    const mutation = useMutation({
        mutationFn:async()=>{
            axios.defaults.withCredentials=true
            await axios.get("http://localhost:3000/api/user/logout")
        },
        onSuccess : ()=>{
            queryClient.resetQueries({queryKey:["user"]})
            queryClient.invalidateQueries({queryKey:["user"]})
            if(pathName === `/user/account/settings/${data?.user.info.id}`){
                navigate("/")
            }
            queryClient.resetQueries({queryKey:['items']})
        }
    })
    const handleLogout = ()=>{
        mutation.mutateAsync()
        setOpenOptions(false)
    }
    
    const handleAddProduct = ()=>{
        navigate("/admin/add-product")
        setOpenOptions(false)
    }
    const handleDashboard = ()=>{
        navigate("/admin/dashboard")
        setOpenOptions(false)
    }
    return(
        <motion.div initial={{scale:0}} animate={openOptions ? {scale:1}:{scale:0}} className={` drop-down-wrapper`} >
            <ul className="drop-down-options">
                <li className="drop-down-opt" onClick={handleClickAccount}><span>Profile</span></li>
                <li className="drop-down-opt"><span>Notifications</span></li>
                {data?.user?.info?.role === "ADMIN" && <li className="drop-down-opt" onClick={handleAddProduct}><span>Add New Product</span></li>
                    
                }
                {data?.user?.info?.role === "ADMIN" && <li className="drop-down-opt" onClick={handleDashboard}><span>Admin Dashboard</span></li>
                    
                }
                <li className="drop-down-opt" onClick={handleLogout}><span>Logout</span></li>
            </ul>
        </motion.div>
    )
}
export default DropDown