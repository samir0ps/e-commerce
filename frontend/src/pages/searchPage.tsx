import {  useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate, useSearchParams } from "react-router-dom"
import LoadingComponent from "../components/Loading"
import { FormEvent, useEffect, useState } from "react"
import "./styles/searchPage.css"
import Stars from "../subcomponents/stars"
import _ from "lodash-es"
import {motion} from "framer-motion"
import Pagination from "../subcomponents/pagination"
import { useRef } from "react"
import img from "../components/images/No Image.png"
import { MdMenu } from "react-icons/md"
import { useOutsideClick } from "../components/outsideClick"
type producttype = {
    id:string ; 
    name:string ; 
    images : {id:string ; url:string}[] ; 
    preview:{id:string ; content:string} ;
    price:number ;
    rating : number ; 
}
interface Product {
    id: number;
    name: string;
    price: number;
    }
    
    interface ProductsResponse {
        products: Product[];
        max_price: number;
        categories : string [] ; 
        totalPages : number ; 
    }
export default function SearchPage(){
    const [searchParams ] = useSearchParams()
    const [page ,setPage] = useState<number>(0)
    const [minPrice , setMinPrice] = useState<number |string>(0)
    const [maxPrice , setMaxPrice] = useState<number | string>('')
    const [initialMax , setInitialMax] = useState(10000)
    const [percentMin , setPercentMin] =useState(0)
    const [percentMax , setPercentMax] = useState(0)
    const [products , setProducts] = useState<producttype[] | null>(null)
    const [categories , setCategories] = useState<[]>([])
    const [selectedCategories , setSelectedCategories] = useState<string[]>([])
    const [openMenu , setOpenMenu] = useState(false)
    let q = searchParams.get('q')
    const ref = useRef<HTMLDivElement>(null)
    const query = useQuery<ProductsResponse>({
        queryKey: ['products', q ],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/product/search?q=${q}&page=${page}`);
            setProducts(response.data.products);
            const prices = _.map(response.data.products, 'price');
            const maxPrice = _.maxBy(prices) as number;
            setMaxPrice(Math.ceil(maxPrice));
            setInitialMax(Math.ceil(maxPrice))
            const percent = (Number(Math.ceil(maxPrice))/Math.ceil(Number(maxPrice)))*100
            setPercentMax(percent)
            setCategories(response.data.categories)
            return response.data;
            },
            refetchOnWindowFocus:false , 
            refetchOnReconnect:false , 
        });
    
    const navigate = useNavigate()
    const handleRedirect = (id:string)=>{
        navigate(`/product/${id}`)
    }
    const handleSettingMin = (e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value
        if(Number(value) <= Number(maxPrice) && Number(value) <= Number(initialMax) ){
            setMinPrice(value)
            const percent = (Number(value)/Math.ceil(Number(initialMax)))*100
            setPercentMin(percent)
        }else{
            return
        }
    }
    const handleSettingMax = (e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value ; 
        if(Number(value) >= Number(minPrice)){
            setMaxPrice(value)
            const percent = (Number(value)/Math.ceil(Number(initialMax)))*100
            setPercentMax(percent)
        }else{
            return
        }

    }
    
        const filterFetching = async()=>{
            const response = await axios.get(`http://localhost:3000/api/product/filter-products?q=${q}&categories=${selectedCategories}&maxPrice=${maxPrice}&minPrice=${minPrice}&page=${page}`)
            setProducts(response.data.products)
            return response.data
        }
    const newQuery  = useQuery({
        queryKey:['products' ,  selectedCategories , maxPrice , minPrice] , 
        queryFn:filterFetching , 
        refetchOnMount:false , 
        refetchOnReconnect:false , 
        refetchOnWindowFocus:false
        
    })
    const handleSettingCategory =(e:FormEvent<HTMLInputElement> , c:string)=>{
        if(e.currentTarget.checked){
            setSelectedCategories(prev=>[...(prev || []) , c])
            
        }else{
            const filtered = selectedCategories.filter(category => category !== c)
            setSelectedCategories(filtered)
            
        }
    }
    const handleOpenMenu  =()=>{
        setOpenMenu(!openMenu)
    }
    const [width , setWidth] = useState(window.innerWidth)
    useEffect(()=>{
        const handleResizing = ()=>{
                setWidth(window.innerWidth)
        }
        window.addEventListener('resize' , handleResizing)
        return ()=>{
            window.removeEventListener('resize' , handleResizing)
        }
    } ,[])
    const sideRef = useOutsideClick(()=>{
        setOpenMenu(false)
    })
    return (
        <div className="div">
            {!query.isPending || !newQuery.isPending  ? 
            <div className="search-wrapper" ref={ref}>

                <motion.aside ref={sideRef} initial={!openMenu && width <750 && {translateX:"-100%" ,width:"50%"}} animate={openMenu  && width < 750? {translateX:"0%" , width:width < 750 && width > 450 ?"50%":width < 450 ? "75%":"25"}:width < 750 ?{translateX:'-100%' , width:"50%"} :{translateX:0 , width:"25%"}} transition={{type:"just"}} className="search-filter-options">
                        <h3>Filter The Results</h3>
                    <div className="price-filter">
                        <div className="price-filter-range">
                            <div className="min-field">
                                <span>Min</span>
                                <input type="number" onChange={handleSettingMin} value={minPrice} />
                            </div>
                            <div className="max-field">
                                <span>Max</span>
                                <input type="number" onChange={handleSettingMax} value={maxPrice} />
                            </div>
                        </div>
                            <div className="slider">
                                <div style={{left:`${percentMin}%` , right:`${100-percentMax}%`}}  className="progress">

                                </div>
                                <div className="range-input">
                                    <input type="range" className="min-range" min={0} value={minPrice} onChange={handleSettingMin} max={Math.ceil(Number(initialMax))} maxLength={50} />
                                    <input type="range" onChange={handleSettingMax} className="max-range" min={0 } max={Math.ceil(Number(initialMax))} value={maxPrice}  />
                                </div>
                            </div>
                        <div className="categories-filter">
                            <h3>Categories</h3>
                            {categories.map((c,index)=>
                            <div className="checkbox-wrapper" key={index}>
                                <input checked={selectedCategories.includes(c)} type="checkbox" id={`${index}`} onChange={(e)=>{handleSettingCategory(e , c)}} className="inp-cbx" />
                                <label htmlFor={`${index}`} className="cbx"
                                ><span>
                                    <svg viewBox="0 0 12 10" height="10px" width="12px">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
                                ><span>{c}</span>
                                </label>
                            </div>
                            )}
                        </div>
                    </div>
                </motion.aside>
                <motion.div initial={{visibility:"hidden"}} animate={openMenu ? {visibility:"visible"} : {visibility:"hidden"}} className="side-background">

                </motion.div>
                <div className="search-body">
                        <h3>                    <MdMenu onClick={handleOpenMenu} className="menu-opts-btn"/>
Results for <span className="query-name">{q}</span></h3>
                        <div className="results-container">
                            {Array.isArray(products) && products ? products.map((product,index)=>(
                                <motion.div  initial={{scale:0}} animate={{scale:1}} transition={{duration:0.3 , delay:0.2*index}} key={product.id} className="product-card">
                                        <p className="card-price">${product.price}</p>
                                    <div onClick={()=>handleRedirect(product.id)} className="card-image-container">
                                        <img src={product.images.length >0 ? product.images[0].url : img} alt="" /> 
                                    </div>
                                    <div className="card-name-container">
                                        <p className="card-name">{product.name}</p>
                                        <div className="name-tooltip">{product.name}</div>
                                    </div>
                                    <div className="card-rate"><Stars rating={product.rating}  readonly={true}/> {product.rating}/5</div>
                                    <p className="card-preview">{product.preview.content}</p>
                                </motion.div> 
                            ))
                            : 
                            null
                        }
                        <div className="pagination-search-container" >
                            {products && <Pagination  page={page} setPage={setPage} ref={ref} length={query.data?.totalPages || Math.ceil(products?.length/30)}/>}
                        </div>
                        </div>
                        
                    </div>
            </div> : <div className='loading-suspense-container'><LoadingComponent/></div>}
        </div>
    )
}

