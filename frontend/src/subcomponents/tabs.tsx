import { BsChevronDoubleDown } from "react-icons/bs";
import "../components/styles/tabs.css"
import {FC, useState } from "react"
import {motion} from "framer-motion"
type propsTypes ={
    categories : {
        category:{
            id:string ; 
            name:string ; 

        }
    }[] ;
    details : {id:string ; name : string ; value:string;}[] , 
    tags:{
        tag:{
            id:string , 
            name:string
        }

    }[]
}
const Tabs:FC<propsTypes> = ({categories ,details , tags})=>{
    const [tab , setTab] = useState<string>("categories")
    const handleSettingTabCategories = ()=>{
        setTab("categories")
        setOpenFull(false)
    }
    const handleSettingTabTags = ()=>{
        setTab("tags")
        setOpenFull(false)
    }
    const handleSettingTabDetails= ()=>{
        setTab("details")
    }
    const [openFull , setOpenFull] = useState<boolean>(false)
    const handleOpen = ()=>{
        setOpenFull(!openFull)
    }

    return(
        <div className="tabs-container">
            <div className="tabs-headers">
                <input type="radio" id="tab-category" name="tabs-headers"  onChange={handleSettingTabCategories} className="tabCheck" />
                <input type="radio" id="tab-tags" name="tabs-headers" onChange={handleSettingTabTags}  className="tabCheck" />
                <input type="radio" id="tab-details" name="tabs-headers" onChange={handleSettingTabDetails} className="tabCheck" />
                <label htmlFor="tab-category" className="tab">
                    <motion.div className="tab-header categories-h" animate={tab === "categories"&& {color:"#dbd3c9"}|| {}} transition={{duration:0.1}}>Categories</motion.div>
                </label>
                <label htmlFor="tab-tags" className="tab">
                    <motion.div className="tab-header"  animate={tab === "tags"&& {color:"#dbd3c9"}|| {}} transition={{duration:0.1}} >Tags</motion.div>
                </label>
                <label htmlFor="tab-details" className="tab">
                    <motion.div className="tab-header"  animate={tab === "details"&& {color:"#dbd3c9"}|| {}} transition={{duration:0.1}}>Info</motion.div>
                </label>
                <motion.span animate={tab === "tags"? {translateX:"100%"}:tab ==="details"?{translateX:"200%"}:{translateX:0}} transition={{type:"spring" , stiffness:200 , damping:10  , duration:0.1}} className="glider"></motion.span>
                
            </div>
            <div className="tab-content-container">
                <div className={`${tab==="categories"? "front-tab":"back-tab"} categories-tab`}>
                    {categories.map(category=>(
                        <div key={category.category.id} className="category-badge">{category.category.name}</div>
                    ))}
                </div>
                <div className={`${tab==="tags"? "front-tab":"back-tab"} tags-tab`}>
                    {tags.map(tag=><div key={tag.tag.id} className="product-tag">
                        {tag.tag.name} 
                    </div>)}                    
                </div>
                <div className={`${tab==="details"? "front-tab":"back-tab"} details-tab`}>
                <motion.div initial={{height:'3em'}} animate={openFull?{height:`${details.length*3}em`}:{height:"7em"}} className={`table`}>
                        <div className="tbody">
                        {details.map(detail=>(<div key={detail.id} className="tr">
                            <div className="td-1">
                                {detail.name} 
                            </div>
                            <div className="td">
                                {detail.value}
                            </div>
                        </div>))}
                        </div>
                        {details.length > 4 && (<div onClick={handleOpen} className={`${openFull ? "top-full": "bottom-0"} gradient-effect`}>
                            See {openFull ? "Less": "More"} <motion.div initial={{rotate:0}} transition={{duration:0.25}} animate={openFull? {rotate:180 , y:-2} : {rotate:0}}><BsChevronDoubleDown/></motion.div>
                        </div>)}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Tabs;