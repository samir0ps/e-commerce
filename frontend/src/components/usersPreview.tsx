import { useQuery } from "@tanstack/react-query"
import "../pages/styles/adminPageStyles.css"
import axios from "axios"
import LoadingComponent from "./Loading"
import { FormEvent, useRef, useState } from "react"
import UserTotalPreview from "./userPreview"
import Pagination from "../subcomponents/pagination"
import {motion} from "framer-motion"
const UserPreview = ()=>{
    const [page, setPage] = useState<number>(0)
    const [length , setLength] = useState<number>(1)
    const [q , setQ] = useState('')
    
    const {data : usersPreview , isPending} = useQuery({
        queryKey:["usersPreview" ,page] , 
        queryFn:async()=>{
            const response= await axios.get(`http://localhost:3000/api/user/admin/users-preview?page=${page}`)
            setLength(Math.ceil(response?.data?.usersLength / 10))
            return response.data
        }
    })
    

    const [userId , setUserId] = useState<string | null>(null)
    const [seeUser , setSeeUser] = useState<boolean>(false)
    const [results , setResults] = useState<any[]>([])
    const handleUserTotalInfo =  (user_Id:string)=>{
        setUserId(user_Id)
            setSeeUser(true)
    }
    const containerRef = useRef<HTMLDivElement>(null)
    const handleSettingSearch =(e:FormEvent<HTMLInputElement>)=>{
        const query = e.currentTarget.value 
        setQ(query)
    }
    useQuery({
        queryKey:['users-search' , q] , 
        queryFn:async()=>{
            const response = await axios.get(`http://localhost:3000/api/user/search-users?query=${q}`) ; 
            setResults(response.data)
            return response.data
        },
        enabled:q.length >0
    })
    const copyText = (id:string)=>{
        navigator.clipboard.writeText(id)
    }
    return (
        <div className="users-preview-container">
                <h1>Users</h1><p>Users count:{usersPreview?.usersLength}</p>
                <div  className="user-search-container">
                    <input  value={q} onChange={handleSettingSearch} type="search" className="user-search search-inp" placeholder="search user by name,id,email..."></input>
                    <motion.div initial={{scale:0}} animate={results.length > 0 && q  ? {scale:1} : {scale:0 , transition:{type:"just"}}}  className="user-results-container">
                        {results.map(result=>(
                            <div  onClick={()=>handleUserTotalInfo(result.id)} className="user-result-container">
                                <p className="user-id-preview">{result.id}</p>
                                <p>{result.firstName} {result.lastName}</p>
                                <p>{result.email}</p>
                                <p>{result.role}</p>
                            </div>
                        ))
                        }
                    </motion.div>
                </div>

            {!isPending ? <div className="user-admin-preview" ref={containerRef}>
                {usersPreview.users.map((user:any )=>(
                    <div className="user-preview-container" key={user.id}>
                        <div className="user-id-container" ><p className="user-id-preview" onClick={()=>copyText(user.id)}>{user.id}</p>
                            <div className="id-content-container">{user.id}</div>
                        </div>
                        <p onClick={()=>handleUserTotalInfo(user.id)} >{user.firstName}</p>
                        <p onClick={()=>handleUserTotalInfo(user.id)} >{user.email}</p>
                        <p onClick={()=>handleUserTotalInfo(user.id)} >{user.role}</p>
                    </div>
                ) )}
                <div className="users-pagination-container">
                    <Pagination page={page} setPage={setPage} length={length} ref={containerRef}/>
                </div>
            </div>
                :
                <LoadingComponent/>
            }   
            <UserTotalPreview userId={userId} seeUser={seeUser} setSeeUser={ setSeeUser}/>
        </div>
    )
}

export default UserPreview