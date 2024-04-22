import {useState  , useRef, useEffect} from "react"
import ProductCarousel from "../subcomponents/productCarousel"
import Tabs from "../subcomponents/tabs"
import "./styles/hero.css"
import Menu from "../subcomponents/dropdown"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Stars from "../subcomponents/stars"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import {motion} from "framer-motion"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { BsThreeDotsVertical } from "react-icons/bs";
import { useOutsideClick } from "./outsideClick"
import HeartIcon from "../subcomponents/heartIcon"
import AddColor from "../pages/addColor"

function NameFunction ({product ,isAdmin , setOpenAddColor}:{product:any , isAdmin:boolean , setOpenAddColor : (value:boolean)=>void}){
    const [openDrop , setOpenDrop] = useState(false)
    const {id} = useParams()

    const handleSettingDrop =()=>{
        setOpenDrop(!openDrop)
    }
    const navigate = useNavigate()
    const handleOpenEdit = ()=>{
        navigate(`/product-edit/${id}`)
    }
    const DropRef = useOutsideClick(()=>{
        setOpenDrop(false)
    })
    const handleAddColor = ()=>{
        setOpenAddColor(true)
        setOpenDrop(false)
    }
    return (
        <div className="product-name-hero"><div className="product-name-p">{product.name} <HeartIcon/></div><div>{isAdmin &&<div>
            <div className="edit-container" ref={DropRef}>
                <button onClick={handleSettingDrop} className="product-opts-btn"><BsThreeDotsVertical /></button>
                <motion.div
                    className={` product-admin-options`}
                    initial={{scaleX:0.8}}
                    animate={openDrop ? {scaleX:1 , visibility:"visible"}:{scale:0 }}
                    >
                    <ul className="product-opts-list">
                        <li onClick={handleOpenEdit} className="product-edit">Edit</li>
                        <li className="product-delete">Delete</li>
                        <li onClick={handleAddColor}>Add color</li>
                    </ul>
                </motion.div>
            </div>
            </div>}</div></div>
    )
}
const Hero = ({isAdmin}:{isAdmin:boolean})=>{
    const ref = useRef<HTMLDivElement>(null);
    const {id} = useParams()
    const [quantity , setQuantity] = useState<number>(1)
    const [colorSelected , setColorSelected]  = useState<string>("color-main")
    const [readMore , setReadMore] = useState(false)
    const handleColorSelection = (color:string) =>{
            setColorSelected(color)
        
    }
    const queryClient = useQueryClient()
    const userData :any = queryClient.getQueryData(['user'])
    const query = queryClient.getQueryData<{product:{id:string ;name:string;colors:{
        name:string ;
        id:string ; 
        image:{id:string , url:string}[]
    }[] ; discount:number ;preview:{content:string}; price:number , rating:number , details:{name:string , value:string ,id:string}[] , tags:{
        tag:{
            name:string , 
            id:string
        }
    }[], categories:{
        category:{
            name:string ; 
            id:string ; 
        } , 
        
        
    }[]
    images:{id:string , url:string}[]
},
    }>(['product' , id])
    const product= query?.product
    const addToCartMutation = useMutation({
        mutationFn:async()=>{
            const response = await axios.post(`http://localhost:3000/api/product/add-to-cart?productId=${id}` , {quantity})
            
            return response.data
        }
        ,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['items']})
        }
        
    })
    const handleAddToCartClick =()=>{
        window.scrollTo({
            top:0 , 
            left:0 , 
            behavior:'smooth'
        })
        if(userData?.user?.info){
            addToCartMutation.mutateAsync()
        }else{
            queryClient.setQueryData(['cart_items'] , {
                name:product?.name , 
                id:product?.id ,
                images:product?.images , 
                price:product?.price , 
                quantity:quantity , 


            })
        }
    }
    const handleReadPreview = ()=>{
        setReadMore(!readMore)

    }
    
    
    
    const ColorDetail = product?.details?.find(det=> det.name.toLowerCase().includes('color'))
    const MainColor =ColorDetail?.value
    
    const [width , setWidth] =useState(0)
    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            setWidth(windowWidth);
        };
        console.log(product?.colors)
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const [openAddColor ,setOpenAddColor] = useState(false)
    const navigate = useNavigate()
    const handleOrdering=()=>{
        
        navigate(`/order/${product?.id}?quantity=${quantity}`)
    }
    return (
        <div className="product-hero" ref={ref}>
            {product? 
            <div className="product-hero">
                {width<720 && <NameFunction setOpenAddColor={setOpenAddColor} isAdmin={isAdmin} product={product}/>}
                <div className="product-image-carousel-container">
                <motion.div 
                className="product-image-carousel"
    >
                        <ProductCarousel colorSelected={colorSelected} colors={product.colors}/>
                    </motion.div>
            </div>
            <div className="product-details">
                {width>=720&&<NameFunction setOpenAddColor={setOpenAddColor} isAdmin={isAdmin} product={product}/>}
                <p className="price">
                    <span className={`${product.discount ?'price-text' : "product-price-page"}`}>
                        ${product.price}
                    </span>
                    {product.discount > 0 ? <span>-{product.discount}%</span>:null}
                </p>
                {product.discount ? <p className="after-discount-price">${((product.price)-(product.price*product.discount/100)).toFixed(2)}</p> : null}
                <div className="product-preview-container">
                    <motion.p animate={readMore?{height:"auto"}:{height:"5em"}} className="product-preview">
                        {product.preview.content}
                    </motion.p>
                    <button onClick={handleReadPreview} className="read-more-btn">
                        Read {readMore? `Less` : "More"} {readMore?<BsChevronUp></BsChevronUp>:<BsChevronDown></BsChevronDown>}
                    </button>
                </div>
                <div className="rate-container">
                    <Stars readonly={true} rating={product.rating}/>
                    <p className="rate-text" style={{gap:"0.25rem" , display:"flex"}}>
                        {Math.ceil(product.rating)} out of 5
                    </p>
                </div>
                <Tabs tags={product.tags} details={product.details} categories={product.categories}/>
            </div>
            <div className="add-container">
                <div className="add-box">
                    
                    {product.colors?.length > 0 && <div className="color-opt-container">
                        <h3 className="colors-header">Choose color</h3>
                        <div className="colors-opt-container">
                        {MainColor ? <div  className="one-color-container">
                                    <input  type="radio" name="color-opt-container"  onChange={()=>{handleColorSelection("color-main")}} id="color-main" />
                                    <div className="color-box">
                                        <label htmlFor="color-main"><div style={{backgroundColor:MainColor}} className={`${colorSelected==="color-main" && "colorSelected"} color`}></div></label>
                                    </div>
                                </div>:<div  className="no-color-container">
                                    <input  type="radio" name="color-opt-container"  onChange={()=>{handleColorSelection("color-main")}} id="color-main" />
                                    <div className="color-box">
                                        <label htmlFor="color-main"><div  className={`${colorSelected==="color-main" && "colorSelected"} no-color`}></div></label>
                                    </div>
                                </div>}
                            {product.colors.map((color ,index)=>(
                                <div key={color.id} className="one-color-container">
                                    <input  type="radio" name="color-opt-container" style={{backgroundColor:color.name}} onChange={()=>{handleColorSelection(`color-${index}`)}} id={`color-${index}`} />
                                    <div className="color-box">
                                        <label htmlFor={`color-${index}`}><div style={{backgroundColor:color.name}} className={`${colorSelected===`color-${index}` && "colorSelected"} color `}></div></label>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                    </div>}
                    <div className="price-info">
                        <h3 className="price-info-h">Price informations</h3>
                        <p className="main-price">
                            <span>price:</span>{product.price}
                        </p>

                        <p className="discount">
                            <span>Discount:</span>{product.discount}%
                        </p>
                        <p className="after-discount"><span>After discount:</span>${(product.price-(product.price)*(product.discount)/100).toFixed(2)}</p>
                        <p className="shipping"><span>Shipping:</span>+$10</p>
                        <p className="total-price">
                            <span>Total:</span>$2,619.1
                        </p>
                    </div>
                    <div className="add-to-cart">
                        <h3 className="quantity-h">Quantity</h3>
                        <div className="menu-container">
                            <Menu fn={()=>null} quantity={quantity} setQuantity={setQuantity}/> 
                        </div>
                        <div className="btns-container">
                            <button onClick={handleAddToCartClick} className="addToCart-btn">
                                Add To Cart 
                                <svg className="add-to-cart-icon" viewBox="0 0 20 20">
                                    <path  d="M9.941,4.515h1.671v1.671c0,0.231,0.187,0.417,0.417,0.417s0.418-0.187,0.418-0.417V4.515h1.672c0.229,0,0.417-0.187,0.417-0.418c0-0.23-0.188-0.417-0.417-0.417h-1.672V2.009c0-0.23-0.188-0.418-0.418-0.418s-0.417,0.188-0.417,0.418V3.68H9.941c-0.231,0-0.418,0.187-0.418,0.417C9.522,4.329,9.71,4.515,9.941,4.515 M17.445,15.479h0.003l1.672-7.52l-0.009-0.002c0.009-0.032,0.021-0.064,0.021-0.099c0-0.231-0.188-0.417-0.418-0.417H5.319L4.727,5.231L4.721,5.232C4.669,5.061,4.516,4.933,4.327,4.933H1.167c-0.23,0-0.418,0.188-0.418,0.417c0,0.231,0.188,0.418,0.418,0.418h2.839l2.609,9.729h0c0.036,0.118,0.122,0.214,0.233,0.263c-0.156,0.254-0.25,0.551-0.25,0.871c0,0.923,0.748,1.671,1.67,1.671c0.923,0,1.672-0.748,1.672-1.671c0-0.307-0.088-0.589-0.231-0.836h4.641c-0.144,0.247-0.231,0.529-0.231,0.836c0,0.923,0.747,1.671,1.671,1.671c0.922,0,1.671-0.748,1.671-1.671c0-0.32-0.095-0.617-0.252-0.871C17.327,15.709,17.414,15.604,17.445,15.479 M15.745,8.275h2.448l-0.371,1.672h-2.262L15.745,8.275z M5.543,8.275h2.77L8.5,9.947H5.992L5.543,8.275z M6.664,12.453l-0.448-1.671h2.375l0.187,1.671H6.664z M6.888,13.289h1.982l0.186,1.671h-1.72L6.888,13.289zM8.269,17.466c-0.461,0-0.835-0.374-0.835-0.835s0.374-0.836,0.835-0.836c0.462,0,0.836,0.375,0.836,0.836S8.731,17.466,8.269,17.466 M11.612,14.96H9.896l-0.186-1.671h1.901V14.96z M11.612,12.453H9.619l-0.186-1.671h2.18V12.453zM11.612,9.947H9.34L9.154,8.275h2.458V9.947z M14.162,14.96h-1.715v-1.671h1.9L14.162,14.96z M14.441,12.453h-1.994v-1.671h2.18L14.441,12.453z M14.72,9.947h-2.272V8.275h2.458L14.72,9.947z M15.79,17.466c-0.462,0-0.836-0.374-0.836-0.835s0.374-0.836,0.836-0.836c0.461,0,0.835,0.375,0.835,0.836S16.251,17.466,15.79,17.466 M16.708,14.96h-1.705l0.186-1.671h1.891L16.708,14.96z M15.281,12.453l0.187-1.671h2.169l-0.372,1.671H15.281z"></path>
                                </svg>
                            </button>
                            <button onClick={handleOrdering} className="addToCart-btn">
                                Buy Now 
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            </div>
            :
            null
            }
            <AddColor setOpenAddColor={setOpenAddColor} openAddColor={openAddColor}/>
        </div>
    )
}

export default Hero