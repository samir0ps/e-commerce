import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import {useState ,useRef,  ChangeEvent, FC} from "react"
import "../App.css"
import { useNavigate } from "react-router-dom"
import LoadingComponent from "./Loading"
import DeleteButton from "../subcomponents/deleteButton"
import ErrorMessage from "../subcomponents/errorMessage"
import SuccMessage from "./succMessage"
import { BsCamera } from "react-icons/bs"
import { MdClose } from "react-icons/md"
type ErrorType = {
    response : {
        data:{
            error : string
        }
    }
}

type categoryProps = {
    openAddCategory:boolean ; 
    setOpenAddCategory :(value:boolean)=>void ;
}
const CreateCategory : FC<categoryProps>= ({openAddCategory , setOpenAddCategory})=>{
    const query = useQuery({
        queryKey:["isAdmin"] , 
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            const status = response.data.user.status
            if(status === "Logged out"){
                navigate("/")
                throw new Error("Cannot load this page for normal user") 
            }else {
                const role = response.data.user.info.role
                if(role !== "ADMIN"){
                    navigate("/")
                throw new Error("Cannot load this page for normal user") 
            }else{
                return response.data
            }

        }
                
            
        }
    })
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [error , setError] = useState<string | null>(null)
    const [succMessage , setSuccMessage] = useState<string | null>(null)
    const [imageUploaded , setImageUploaded] = useState<File |null >(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const mutation = useMutation({
        mutationFn:async(userData:any)=>{
            return await axios.post("http://localhost:3000/api/product/create-category" , userData , {
                headers:{
                    "Content-Type" : "multipart/form-data"
                }
            })
        } , 
        onSuccess : ()=>{
            queryClient.invalidateQueries({queryKey:['adminCategories']})
            setImageUploaded(null)
            if(imageRef?.current?.value){
                imageRef.current.value = ""
            }
            if(nameRef.current?.value){
                nameRef.current.value = ""
            }
            setSuccMessage("Category created successfuly")
        },
        onError:(error:ErrorType)=>{
            console.log(error)
            setError(error.response.data.error)
            
        }
    })
    const handleUploadingImage= (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files.length>0){
            setImageUploaded(e.target.files[0])
        }
    }
    const handleSubmittion = ()=>{
        try{
            if(!nameRef.current?.value){
                setError("Name cannot be null!")
                throw new Error("Name cannot be null!")
            }
            if(!imageUploaded){
                setError("You should upload image")
                throw new Error("You should upload image")
            }
            const formData = new FormData
            formData.append("name" , nameRef.current.value)
            formData.append("image" , imageUploaded)
            mutation.mutateAsync(formData)
        }catch(error:any){
            setError(error.message)
        }
    }
    const handleClosing =()=>{
        setOpenAddCategory(false)
    }
    
    return (
        <div className={`${openAddCategory? "open-create-category":"close-create-category"} create-category-wrapper`}>
                    {!query.isPending ? <div className={`${openAddCategory? "open-container":"close-container"} create-category-container`}>
                        <MdClose className="close-icon" onClick={handleClosing}/>
                        <h1>Add new category</h1>
                        <input type="text" className="category-name-inp user-edit-mode-inp" placeholder="Name" ref={nameRef} />
                    <div className="image-upload-container">
                        {imageUploaded  ? <div className="image-uploaded-container">
                            <div className="delete-container"><DeleteButton images={null} operation="image" setImagesUploaded={()=>null} handleConfirmation={()=>null} settingPage={false} setImageUploaded={setImageUploaded} imageRef={imageRef}/></div>
                            <img className="image-uploaded" src={URL.createObjectURL(imageUploaded)}></img></div> : null}
                        <label>
                            <input type="file" className="uploading-image-inp" onChange={handleUploadingImage} ref={imageRef} />
                            <p className="upload-btn">
                                UPLOAD
                                <BsCamera/>
                            </p>
                        </label>
                    </div>
                    
                    <button onClick={handleSubmittion} className="submit-btn-category">Submit</button>
                    </div> : <div className="loading-suspense-container">
                            <LoadingComponent/>
                        </div>}
                    <div className="create-category-bg" onClick={handleClosing}>

                    </div>
                
                <ErrorMessage error={error} setError={setError}/>
                <SuccMessage succMessage={succMessage} setSuccMessage={setSuccMessage} />
        </div>
    )
}

export default CreateCategory