import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingComponent from "./Loading";
import axios from "axios";
import { HiOutlineChevronDown } from "react-icons/hi2";
import {motion} from "framer-motion"
import "../App.css"
import {  FormEvent, useState } from "react";
import { useOutsideClick } from "./outsideClick";
import ErrorMessage from "../subcomponents/errorMessage";
const UserTotalPreview = ({ userId ,  seeUser , setSeeUser}: { userId : string|null ; seeUser:boolean , setSeeUser:(value:boolean)=>void}) => {
    const [roleSelection , setRoleSelection] = useState<string>("")
    const [openSelection , setOpenSelection] = useState<boolean>(false)
    const [banUser ,setBanUser] = useState("")
    const [reason , setReason] = useState("")
    const [error , setError] =useState<string | null>("")
    const [banForm , setBanForm] =useState(false)
    const query = useQuery({
        queryKey:["userPreview"] , 
        queryFn:async()=>{
            try{
                if(!userId) {
                    throw  new Error("User's id is null !")
                }
                const response = await axios.get(`http://localhost:3000/api/user/admin/user-preview?userId=${userId}`)
                setRoleSelection(response.data.role)
                return response.data

            }catch(error : any){
                console.log(error.message)
            }
        }
        ,
        enabled:seeUser?true : false
    })
    const handleClose = ()=>{
        setSeeUser(false)
    }
    const roleMutation = useMutation({
        mutationFn:async(role:string)=>{
            const response = await axios.put(`http://localhost:3000/api/user/user-role?userId=${query.data.id}` , {role})
            return response.data
        } ,onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['userPreview']})
            queryClient.invalidateQueries({queryKey:["usersPreview"]})
            setOpenSelection(false)
        }
    })
    const handleSettingRole = (role:string)=>{
        try{
            roleMutation.mutateAsync(role)
        }catch(err:any){
            setError(err.message)
        }
    }
    const handleOpenSelection = ()=>{
        setOpenSelection(!openSelection)
    }
    const ref = useOutsideClick(()=>{
        setOpenSelection(false)
    })
    const banClick = (id:string)=>{
        setBanUser(id)
        setBanForm(true)
    }
    const banRef = useOutsideClick(()=>{
        setBanForm(false)
    })
    const queryClient =useQueryClient()
    const banMutation = useMutation({
        mutationFn:async()=>{
            const response = await axios.post(`http://localhost:3000/api/user/ban-user?userId=${banUser}` , {reason})
            return response.data
        } , 
        onSuccess:()=>{
            setBanForm(false)
            queryClient.invalidateQueries({queryKey:['userPreview']})
        }
    })
    const handleSubmit =()=>{
        try{
            if(reason === ""){
                throw new Error("Reason input cannot be empty") ; 
            }
            banMutation.mutateAsync()
        }catch(err:any){
            setError(err.message)
        }
    }
    const settingReason = (e:FormEvent<HTMLInputElement>)=>{
        let value =e.currentTarget.value ; 
        setReason(value)
    }
    
    return (

        <div className={`${seeUser ? "user-view" : "user-inview"} user-total-preview-wrapper`}>
            {query.isPending ? <LoadingComponent/> :
            <motion.div animate={seeUser ? {scale:1} : {scale:0}} className={` user-preview-wrapper`}>
                <div className="user-informations-admin">
                {query.data.images.length>0 ?<div className="user-image-container">
                            <img src={query.data.images[0].url} alt="" />
                    </div>: <div className="no-image-container"><p className="no-image">No image</p></div> }
                    <div className="info-container">
                        <p className="p-name">Name</p>
                        <hr />
                        <p className="p-value">{query.data.firstName} {query.data.lastName}</p>

                        <p className="p-name">Email</p>
                        <hr />
                        <p className="p-value">{query.data.email}</p>
                        <p className="p-name">Role</p>
                        <hr />
                        <p className="p-value">{query.data.role}</p>
                        <hr/>
                        {!query?.data?.ban ?  <button className="ban-btn" onClick={()=>banClick(query.data.id)}>Ban</button>:
                            <button className="un-ban ban-btn" onClick={()=>banClick(query.data.id)}>Unban</button>
                        }
                        <div ref={ref} className="role-select-container">
                                <div  onClick={handleOpenSelection} className="role-select">
                                    {roleSelection}
                                    <HiOutlineChevronDown className="select-down-icon"/>
                                </div>
                                <motion.div animate={openSelection ? {scale:1}:{scale:0}} className="role-options">
                                    <div className="role-option" onClick={()=>handleSettingRole("ADMIN")}>ADMIN</div>
                                    <div className="role-option" onClick={()=>handleSettingRole("MODERATOR")}>MODERATOR</div>
                                    <div className="role-option" onClick={()=>handleSettingRole("USER")}>USER</div>
                                </motion.div>
                                
                        </div>
                    </div>
                </div>
            </motion.div>}
            <div className="user-preview-bg" onClick={handleClose}></div>
            <motion.div animate={banForm ? {visibility:"visible", transition:{duration:0 , delay:0}}: {visibility: "hidden" , transition:{duration:0.2 ,delay:0.1}}}  className="ban-form-page">
                <motion.div ref={banRef} className="ban-form" animate={banForm?{ scale:1}:{ scale:0}}>
                    <h3 className="ban-user-h">Ban user <span>{banUser}</span></h3>
                    <label>
                        Reason
                    </label>
                    <input onChange={settingReason} value={reason} type="text" placeholder="Write the reason of banning..." required/>
                    <button onClick={handleSubmit}>Submit</button>
                </motion.div>
            </motion.div>
            <ErrorMessage setError={setError} error={error}/>
        </div>
    );
};

export default UserTotalPreview;
