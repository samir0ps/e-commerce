import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react"
import "./styles/customInputs.css"
import { useQuery } from "@tanstack/react-query";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingComponent from "./Loading";
import { MdEdit } from "react-icons/md";

const CustomInputs =({modifiedCustoms , setModifiedCustoms}:{modifiedCustoms:any[] , setModifiedCustoms:Dispatch<SetStateAction<any[]>>})=>{
    const [editMode , setEditMode] = useState("")
    const [addOption , setAddOption] = useState(false)
    const [name , setName] = useState('')
    const [value , setValue] = useState("")
    const nameInp = useRef<HTMLInputElement>(null)
    const valueInp = useRef<HTMLInputElement>(null)
    const [error , setError] =  useState("")
    const {id} = useParams()

    const handleClickEdit = (c:any)=>{
        setName(c.name) ; 
        setValue(c.value) ; 
        setEditMode(c.id)
    }  
    const handleSettingName = (e:FormEvent<HTMLInputElement>)=>{
        setName(e.currentTarget.value)
    } 
    const handleSettingValue = (e:FormEvent<HTMLInputElement>)=>{
        setValue(e.currentTarget.value)
    }
    const handleSettingAdd = ()=>{
        
        if(addOption){
            const name = (nameInp.current as HTMLInputElement).value
            const value = (valueInp.current as HTMLInputElement).value
            if(name && value){
                const nameExist = modifiedCustoms.filter(custom=>{
                    const Name = custom.name.toLowerCase() ; 

                    return Name.includes(name.toLowerCase().replace(/\s/g, ''))
                })
                console.log(nameExist)
                if(nameExist.length === 0){
                    setModifiedCustoms(prev=>([...(prev || []) , {id:Math.random() , name , value}])) ; 
                    (nameInp.current as HTMLInputElement).value = '' ; 
                    (valueInp.current as HTMLInputElement).value = '' ; 
                    setError("")
                }else{
                    setError("this custom already added!")
                    return
                }
            }
        }else{  
            setAddOption(true)
        }
    }
    const handleCancelling = ()=>{
        setAddOption(false)
        setError("")
    }
    const query = useQuery({
        queryKey:['product_details'] , 
        queryFn:async()=>{
            const response  = await axios.get(`http://localhost:3000/api/product/get-details?productId=${id}`)
            setModifiedCustoms(response.data)
            return response.data
        },
        refetchOnWindowFocus:false
    })
    const handleCancellingEdit = ()=>{
        setEditMode("")
    }
    const saveEditted = (id:string)=>{
        const custom = modifiedCustoms.find(c=>c.id === id)
        custom.name =name ;
        custom.value = value ; 
        setEditMode('')
    }
    const deleteEdit = (id :string)=>{
        const newCustoms = modifiedCustoms.filter(c=> c.id !== id)
        setModifiedCustoms(newCustoms)
    }
    return (
        <div className="specifications-container">
            <h3>Specifications</h3>
            {query.isFetched ?<div className="edit-customs-container">
                    {modifiedCustoms&&Array.isArray(modifiedCustoms) && modifiedCustoms.map((custom)=>(
                        <div key={custom.id} className="edit-custom-container">
                            {editMode === custom.id  ? <div className="new-inp">
                                <input onChange={handleSettingName} type="text" placeholder="specific name" value={name}/>  
                                <input onChange={handleSettingValue} type="text" placeholder="specific value" value={value} />
                                <button className="cancel-editing save-edit" onClick={()=>saveEditted(custom.id)}>Save</button>
                                <button onClick={handleCancellingEdit} className="cancel-editing" >cancel</button>
                            </div> : 
                            <div className="view-mode-custom">
                                <p className="name">{custom.name}</p> : <p className="value">{custom.value}</p>
                                <div className="edit-icons">
                                    <MdOutlineDeleteOutline onClick={()=>deleteEdit(custom.id)} className="delete-icon-custom"/>
                                    <MdEdit onClick={()=>handleClickEdit(custom)} className="edit-icon-custom"/>
                                </div>
                            </div>}
                        </div>
                    ))

                    }
                {addOption && <div className="new-inp">
                    <input type="text" placeholder="name" ref={nameInp}/><input type="text" ref={valueInp} placeholder="value"></input>
                    {error && <p className="err-p">{error}</p>}
                </div>}
            </div> : <LoadingComponent/>}
                <div className="add-custom-btns-container">
                    {addOption && <button onClick={handleCancelling} className="cancel-adding-btn">Cancel</button>}
                    <button onClick={handleSettingAdd}>Add</button>
                    
                </div>
        </div>
    )
}

export default CustomInputs