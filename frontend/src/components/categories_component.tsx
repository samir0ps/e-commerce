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
import { GoArchive } from "react-icons/go";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";


type categoriesProps = {
    openAddCategory :boolean , 
    setOpenAddCategpry : (value:boolean)=>void
}
const AdminCategories:FC<categoriesProps> = ({ setOpenAddCategpry}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: ["adminCategories"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:3000/api/product/get-categories");
            return response.data;
        },
    
        
    });
    
    const setAddClick=()=>{
        setOpenAddCategpry(true)
    }
    const [editName , setEditName] = useState<string | null>(null)
    const [newName , setName] = useState<string>("")
    const [error,setError] = useState<string | null>(null)
    const [filteredCategories , setFilteredCategories] = useState<{
        id:string , 
        name : string ; 
        image:{id:string ; url:string}[] ; 
    }[] | null>(null)
    const [succMessage , setSuccMessage] = useState<string | null>(null)
    const [openConfirmation , setOpenConfirmation] = useState<boolean>(false)
    const confirmationMessage = "Are you sure you want to delete that category?"
    const [deleteName , setDeleteName] = useState<string>("")
    const handleEditing = (id:string  ,Name:string)=>{
        setEditName(id)
        setName(Name)
    }
    const mutation = useMutation({
        mutationFn:async(categoryName:string)=>{
            const response = await axios.put(`http://localhost:3000/api/product/edit-category-name?prevName=${categoryName}` , {name:newName})
            return response.data
        } , 
        onSuccess:async()=>{
            await queryClient.invalidateQueries({queryKey:["adminCategories"]}).then(()=>{
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
        console.log(e)
        if(typeof e !== "string"){
            searchTerm = e.currentTarget.value.toLowerCase();
        }else{
            searchTerm = e.toLowerCase()
        }
        if (searchTerm === '') {
            setFilteredCategories(null);
            } else {
            const filtered = query?.data?.categories.filter((cat:any) => cat.name.toLowerCase().includes(searchTerm));
            setFilteredCategories(filtered?filtered : null);
            }
        };
    const searchRef = useRef<HTMLInputElement>(null)
    const deleteMutation = useMutation({
        mutationFn:async(name:string)=>{
            const response = await axios.delete(`http://localhost:3000/api/product/delete-category?name=${name}`)
            return response
        },
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:["adminCategories"]})
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
    const archiveMutation = useMutation({
        mutationFn:async(id:string)=>{
            const response = await axios.post(`http://localhost:3000/api/product/add-suggest?categoryId=${id}`)
            return response.data
        } , onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['adminCategories']})
        }
    })
    const unArchiveMutation = useMutation({
        mutationFn:async(id:string)=>{
            const response = await axios.delete(`http://localhost:3000/api/product/remove-suggest?categoryId=${id}`)
            return response.data
        } , onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['adminCategories']})
        }
    })
    const handleArchive = (id:string)=>{
        try{    
            archiveMutation.mutateAsync(id)
        }catch(err:any){
            console.log(err.message)
        }
    }
    const handleUnArchive = (id:string)=>{
        try{    
            unArchiveMutation.mutateAsync(id)
        }catch(err:any){
            console.log(err.message)
        }
    }
return (
    <div className="admin-categories-container">
        <div className="category-opts">
            <h1 className="category-heading">Categories</h1>
            <div className="btn-container-new">
                <button onClick={setAddClick} className="add-new-btn">
                    Add <PiPlus/>
                </button>
            </div>
        </div>
        <div className="search-container">
            <input type="text" placeholder="Search category by name..." className="search-inp" ref={searchRef} onChange={handleSearch}/>
        </div>
    {query.isPending ? (
        <LoadingComponent />
    ) : query.isError ? (
        <div>Error: {query.error.message}</div>
    ) : (
        <div className="admin-categories-wrapper">
            
        {query?.data && Array.isArray(query.data.categories)
            ? ((Array.isArray(filteredCategories) && filteredCategories?.length > 0 )&& filteredCategories || query.data.categories).map((category:any) => (
                <div key={category.id} className="category-name-container">
                    <div className="category-image-container">
                        <img src={category.image[0].url} alt={category.image[0].id} />
                    </div>
                    {editName=== category.id ? <input value={newName} onChange={handleChangingName} className="edit-name-inp" placeholder="New name..."></input> : <p>{category.name}</p>}
                    {editName ===category.id  ? <MdOutlineDone onClick={()=>{handleMutateEditing(category.name)}} className="done-icon-btn"/>
                        :<div className="icons-container"><BsTrash onClick={()=>handleClickDelete(category.name)} className="trash-icon"/><VscEdit onClick={()=>handleEditing(category.id , category.name)} className="pencil-icon"/>
                        {!category.suggested ? <GoArchive onClick={()=>handleArchive(category.id)} className="archive-icon"/> : <HiOutlineArchiveBoxXMark onClick={()=>handleUnArchive(category.id)} className="archive-icon unarchive-icon"/>
}
                        </div>}
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

export default AdminCategories;
