import { FC, FormEvent, useState } from "react";
import "./styles/tags.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ErrorMessage from "../subcomponents/errorMessage";
import SuccMessage from "./succMessage";
type addTypes = {
    openAddTag : boolean ; 
    setOpenAddTag : (value:boolean)=>void ; 
}
const AddTagsComponent:FC<addTypes> = ({openAddTag , setOpenAddTag})=>{
    const [error , setError]  = useState<string |null>(null)
    const [succMessage, setSuccMessage] = useState<string | null>(null)
    const [name , setName] = useState<string>("")
    const handleClosing = ()=>{
        setOpenAddTag(false)
    }
    const queryClient = useQueryClient()
    const mutation =useMutation({
        mutationFn:async()=>{
            const response = await axios.post("http://localhost:3000/api/product/create-tag" , {name})
            return response
        },
        onSuccess:(data:any)=>{
            setSuccMessage(data.data.message)
            queryClient.invalidateQueries({queryKey:['adminTags']})
            setOpenAddTag(false)
            setName("")
        } , 
        onError : (error:any)=>{
            setError(error.data.message)
        }
    })
    const handleAddingTag = ()=>{
        try{
            mutation.mutateAsync()
        }catch(err:any){
            setError(err.message)
        }
    }
    const handleSettingName = (e:FormEvent<HTMLInputElement>)=>{
        const value : string= e.currentTarget.value
        setName(value)
    }
    return (
        <div className={`${openAddTag? "opn-wrapper":"cls-wrapper"} add-tags-wrapper`}>
            <div className={`${openAddTag ? 'open-add' : 'close-add'} add-tags-container`}>
                <input value={name} onChange={handleSettingName} type="text" className="add-tag-inp" placeholder="Tag name" />
                <button className="add-tag-button" onClick={handleAddingTag}>Submit</button>
            </div>
            <div className="add-tags-bg" onClick={handleClosing}></div>
            <ErrorMessage error={error} setError={setError} />
            <SuccMessage succMessage={succMessage} setSuccMessage={setSuccMessage} />
        </div>
    )
}

export default AddTagsComponent