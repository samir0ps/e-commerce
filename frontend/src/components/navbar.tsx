import "./styles/navbarStyles.css"
import { useNavigate  , useLocation, Link} from "react-router-dom"
import MenuButton from "../subcomponents/menuButton"
import { useQuery , useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import Avatar from "./Avatar"
import { useState } from "react"
import DropDown from "./dropDown"
import LoadingComponent from "./Loading"
import { GiShoppingCart } from "react-icons/gi";
import Search from "../subcomponents/searchInp"
import { FaOpencart } from "react-icons/fa6"
import { useOutsideClick } from "./outsideClick"

const Navbar = ()=>{
    const navigate = useNavigate()
    const path = useLocation()
    const pathName = path.pathname
    const [openOptions , setOpenOptions] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const result= useQuery({
        queryKey : ["user"] , 
        queryFn :async()=>{
            axios.defaults.withCredentials =true
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            
            return response.data
        },
        
    })
    const cartItems = useQuery({
        queryKey:["items"] , 
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/product/cart-items-length")
            return response.data
        } , 
        enabled:result.data?.user?.info ? true  : false
    })
    const handleLoginClick =()=>{
        
        navigate("/login")
        queryClient.setQueryData(['pathName'] , ()=>{
            return pathName
        })
    }
    const ref = useOutsideClick(()=>{
        setOpenOptions(false)
    })
    return(
        <nav>
            <div onClick={()=>{navigate("/")}} className="logo-container" ><p className="logo-text"><FaOpencart />AEXSHOP</p></div>
                <Search/>
            <div className="nav-btns">
            <button className="search-btn-500px">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                        fill="currentColor"
                    />
                    </svg>
                    </button>
                <button onClick={()=>{navigate("/")}} className="home-btn nav-btn">HOME</button>
                <Link to={`/cart/${result.data?.user?.info?.id}`} className="cart-btn nav-btn">
                    {cartItems.isFetched && <p className="cart-badge">{cartItems.data?.length ? cartItems.data.length : 0}</p>}
                    <GiShoppingCart className="cart-icon"/>
                </Link>
                {result.isPending ?<LoadingComponent/>:result.data.user.status==="Logged out" ?<button onClick={handleLoginClick} className="acc-btn nav-btn">ACCOUNT</button>: <div className="avatar-nav-container" ref={ref}> <div className="avatar-relative-container"><Avatar openOptions={openOptions} setOpenOptions={setOpenOptions} classSpecific={"nav-bar-avatar"}/> <DropDown openOptions={openOptions} setOpenOptions={setOpenOptions}/></div></div>}
            </div>
            <div>
                <MenuButton></MenuButton>
            </div>
        </nav>
    )
}

export default Navbar ; 