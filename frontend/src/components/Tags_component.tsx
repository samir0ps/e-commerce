import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "../App.css";
import LoadingComponent from "./Loading";
import { PiPlus } from "react-icons/pi";
import { FC, FormEvent, useRef, useState } from "react";
import { VscEdit } from "react-icons/vsc";
import ErrorMessage from "../subcomponents/errorMessage";
import { MdOutlineDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import SuccMessage from "./succMessage";
import Confirmation from "./confirmation";

interface Tag {
    tags : {
        id: string;
        name: string;
        
    }[]
    
}
type tagsProps = {
    openAddTag :boolean , 
    setOpenAddTag : (value:boolean)=>void
}
const AdminTags:FC<tagsProps> = ({ setOpenAddTag}) => {
    const queryClient = useQueryClient()
    const query = useQuery<Tag, Error>({
        queryKey: ["adminTags"],
        queryFn: async () => {
            const response = await axios.get<Tag>("http://localhost:3000/api/product/get-all-tags");
            return response.data;
        },
    
        
    });
    
    const setAddClick=()=>{
        setOpenAddTag(true)
    }
    const [editName , setEditName] = useState<string | null>(null)
    const [newName , setName] = useState<string>("")
    const [error,setError] = useState<string | null>(null)
    const [filteredTags , setFilteredTags] = useState<{
        id:string , 
        name : string ; 
    }[] | null>(null)
    const [succMessage , setSuccMessage] = useState<string | null>(null)
    const [openConfirmation , setOpenConfirmation] = useState<boolean>(false)
    const confirmationMessage = "Are you sure you want to delete that tag?"
    const [deleteName , setDeleteName] = useState<string>("")
    const handleEditing = (id:string  ,Name:string)=>{
        setEditName(id)
        setName(Name)
    }
    const mutation = useMutation({
        mutationFn:async(TagName:string)=>{
            const response = await axios.put(`http://localhost:3000/api/product/edit-tag-name?prevName=${TagName}` , {name:newName})
            return response
        } , 
        onSuccess:async()=>{
            await queryClient.invalidateQueries({queryKey:["adminTags"]}).then(()=>{
                setEditName(null)
                handleSearch("")
            })
        }
        
    })
    const handleChangingName = (e:FormEvent)=>{
        const newName = (e.currentTarget as HTMLInputElement).value
        setName(newName)
    }
    const handleMutateEditing =(name:string)=>{
        try{
            if(name==='' || null){
                throw new Error("Name cannot be empty!")
            }
            if(name===newName){
                setEditName(null) 
                setName("")
            }{
                mutation.mutateAsync(name)
            }
        }catch(err:any){
            setError(err.message)
        }
    }
    const handleSearch = (e: FormEvent<HTMLInputElement> | string) => {
        let searchTerm : string
        if(typeof e !== "string"){
            searchTerm = e.currentTarget.value.toLowerCase();
        }else{
            searchTerm = e.toLowerCase()
        }
        if (searchTerm === '') {
            setFilteredTags(null);
            } else {
                const filtered = query?.data?.tags.filter(cat => cat.name.toLowerCase().includes(searchTerm));
                setFilteredTags(filtered?filtered : null);
            }
        };
    const searchRef = useRef<HTMLInputElement>(null)
    const deleteMutation = useMutation({
        mutationFn:async(name:string)=>{
            const response = await axios.delete(`http://localhost:3000/api/product/delete-tag?name=${name}`)
            return response
        },
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:["adminTags"]})
            setSuccMessage(data.data.message)
        }, 
        onError:(error:any)=>{
            setError(error.data.error)
        }
        
    })
    const handleDelete=()=>{
        try{
            deleteMutation.mutateAsync(deleteName)
        }catch(err:any){
            setError(err.message)
        }
    }
    const handleClickDelete=(name:string)=>{
        setDeleteName(name)
        setOpenConfirmation(true)
    }
return (
    <div className="admin-Tags-container">
        <div className="Tag-opts">
            <h1 className="Tag-heading">Tags</h1>
            <div className="btn-container-new">
                <button onClick={setAddClick} className="add-new-btn">
                    Add <PiPlus/>
                </button>
            </div>
        </div>
        <div className="search-container">
            <input type="text" placeholder="Search Tag by name..." className="search-inp" ref={searchRef} onChange={handleSearch}/>
        </div>
    {query.isPending ? (
        <LoadingComponent />
    ) : query.isError ? (
        <div>Error: {query.error.message}</div>
    ) : (
        <div className="admin-Tags-wrapper">
            
        {query.data && Array.isArray(query.data.tags)
            ? ((Array.isArray(filteredTags) && filteredTags?.length > 0 )&& filteredTags || query.data.tags).map((tag) => (
                <div key={tag.id} className="Tag-name-container">
                    
                    {editName=== tag.id ? <input value={newName} onChange={handleChangingName} className="edit-name-inp" placeholder="New name..."></input> : <p>{tag.name}</p>}
                    {editName ===tag.id  ? <MdOutlineDone onClick={()=>{handleMutateEditing(tag.name)}} className="done-icon-btn"/>
                        :<div className="icons-container"><BsTrash onClick={()=>handleClickDelete(tag.name)} className="trash-icon"/><VscEdit onClick={()=>handleEditing(tag.id , tag.name)} className="pencil-icon"/></div>}
                </div>
            ))
            : null}
        </div>
    )}
        <ErrorMessage error={error} setError={setError} />
        <SuccMessage succMessage={succMessage} setSuccMessage={setSuccMessage} />
        <Confirmation setOpenConfirmation={setOpenConfirmation} openConfirmation={openConfirmation} message={confirmationMessage} handleFn={handleDelete} />
    </div>
);
};

export default AdminTags;
