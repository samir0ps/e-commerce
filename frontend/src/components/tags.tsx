import { useQuery } from '@tanstack/react-query'
import './styles/tags.css'
import axios from 'axios'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
type queryTypes = {
    tags : {
        id:string ; 
        name:string ; 
    }[]
}
type props ={
    setTagsChosen :Dispatch<SetStateAction<string[] | null>>
}
const ChooseTags:FC<props> = ({setTagsChosen})=>{
    const query=useQuery<queryTypes>({
        queryKey:['tags'] ,
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/product/get-all-tags")
            return response.data
        }
    })
    const [focus , setFocus] = useState(false)
    const handleTagsFocus =()=>{
        setFocus(true)
    }
    const handleTagsBlur = ()=>{
        setFocus(false)
    }
    const [tagsFiltered ,setTagsFiltered] = useState<{id:string ; name:string}[] | null>(null)
    const handleSetSearch = (e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value.toLowerCase() ;
        const filtered = query.data?.tags.filter(tag=>tag.name.toLowerCase().includes(value)) 
        if(filtered && Array.isArray(filtered)){
            setTagsFiltered(filtered)
        }
    }
    const handleSettingChosenTags = (name:string)=>{
        setTagsChosen((prev)=>[...(prev || []) , name])
    }
    return(
        <div className="tags-selection">
            <div className="select">
                <input onFocus={handleTagsFocus} onBlur={handleTagsBlur} onChange={handleSetSearch} type="text" placeholder='Write Tag name...' className="select-inp" />
                <div className="chevrons-container"><BsChevronUp className='chevron-up-inp'/><BsChevronDown className='chevron-down-inp'/></div>
                <div className={`${focus ? "open-options" : "close-options"} options`}>
                    {Array.isArray(query?.data?.tags) && query?.data?.tags ? (tagsFiltered || query.data.tags).map(tag=>(
                        <div key={tag.id} onClick={()=>{handleSettingChosenTags(tag.name)}} className="option">
                            <p>{tag.name} </p>
                        </div> 
                        
                    )): <p>Cannot find any Tag</p>}
                </div>
            </div>
        </div>
    )
}

export default ChooseTags