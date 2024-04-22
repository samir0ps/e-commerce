
import Error from "../components/errorsMessage"
import 'react-lazy-load-image-component/src/effects/blur.css';
import React, { FormEvent, useState , useRef } from "react";
import Avatar from "../components/Avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import MenuToggle from "../subcomponents/menuToggle";
import LoadingComponent from "../components/Loading";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../subcomponents/deleteButton";

const AccountSettings = ()=>{
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const result  = useQuery({
        queryKey:["userProfile"],
        queryFn : async()=>{
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            setFirstNm(`${response.data.user.info.firstName}`)
            setLastNm (`${response.data.user.info.lastName}`)
            setEmail(`${response.data.user.info.email}`)
            return response.data
        }
    })
    const handleSettingEditMode = ()=>{
        setEditMode(true)
    }
    const mutation = useMutation({
        mutationFn:async(userData:any)=>{
            const response = await axios.put(`http://localhost:3000/api/user/edit/profile?user=${result.data.user.info.id}` , userData , {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            return response.data
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["user"]})
            queryClient.invalidateQueries({queryKey:["userProfile"]})
            navigate(`/user/account/settings/${result.data?.user.info.id}`)
            setEditMode(false)
        }
    })
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editMode , setEditMode] = useState<boolean>(false)
    const [toggleUserMenu , setToggleUserMenu] = useState<boolean>(false)
    const [firstNm , setFirstNm] = useState<string>("")
    const [lastNm , setLastNm] = useState<string>("")
    const [email , setEmail] = useState<string>("")
    const [currentPassword , setCurrentPassword] = useState<string>("")
    const [newPassword , setNewPassword] = useState<string>("")
    const [confirmPassword , setConfirmPassword] = useState<string >("")
    const [imageUploaded , setImageUploaded] = useState<File | null>(null)
    const [confirmMessage , setConfirmMessage] = useState<boolean>(false)
    const [message , setMessage] = useState<string | null>(null)
    const [error , setError] = useState<string | null> (null)
    const handleSettingFirstName = (e : FormEvent<HTMLInputElement>)=>{
        setFirstNm((e.target as HTMLInputElement).value)
    }
    const handleSettingLastName = (e:FormEvent<HTMLInputElement>)=>{
        setLastNm((e.target as HTMLInputElement).value)
    }
    const handleSettingEmail = (e:FormEvent<HTMLInputElement>)=>{
        setEmail((e.target as HTMLInputElement).value)
    }
    const handleSettingCurrentPassword = (e:FormEvent<HTMLInputElement>)=>{
        setCurrentPassword((e.target as HTMLInputElement).value)
    }
    const handleSettingNewPassword = (e:FormEvent<HTMLInputElement>)=>{
        setNewPassword((e.target as HTMLInputElement).value)
    }
    const handleSettingConfirmPassword = (e:FormEvent<HTMLInputElement>)=>{
        setConfirmPassword((e.target as HTMLInputElement).value)
    }
    const handleUploadingImage = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files.length > 0){
            setImageUploaded(e.target.files[0])
        }
    }
    const deleteMutation = useMutation({
        mutationFn:async()=>{
            const image = result.data.user.info.images[0]
            const response = await axios.delete(`http://localhost:3000/api/user/delete/user-image?imageId=${image.id}&imageUrl=${image.url}`);
            return response
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["user"]})
            queryClient.invalidateQueries({queryKey:["userProfile"]})
        }
    })
    const handleDeleteImageUploaded = async()=>{
        if(result.data.user.info.images && !imageUploaded){
            await deleteMutation.mutateAsync()
        }else{
            setImageUploaded(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
        }
    }
    const handleConfirmation = (actionType : string)=>{
        if(actionType==="delete image"){
            setMessage("Are you sure you want to delete this image? Note that you cannot get it back!")
        }else if(actionType === "save info"){
            setMessage("Are you sure you want to save the new informations?")
        }
        if(newPassword !== confirmPassword){
            return setError("password and password confirmation is't match!")
        }
        setConfirmMessage(true)
    }
    const handleCancel = ()=>{
        setConfirmMessage(false)
    }
    const handleSureAction = (actionType:string)=>{
        if(actionType === "delete image"){
            handleDeleteImageUploaded()
            setConfirmMessage(false)
        }else{
            handleSubmit()
            setConfirmMessage(false)
            setImageUploaded(null)
        }
    }
    const handleSubmit = ()=>{
        const formData = new FormData()
        formData.append("firstName" , firstNm)
        formData.append("lastName" , lastNm)
        formData.append("email" , email)
        formData.append("password" , currentPassword)
        formData.append("newPassword" , newPassword)
        if(imageUploaded){
            formData.append("image" , imageUploaded)
        }
        mutation.mutateAsync(formData)

    }
    const logOutMutation = useMutation({
        mutationFn:async()=>{
            axios.defaults.withCredentials=true
            await axios.get("http://localhost:3000/api/user/logout")
        },
        onSuccess : ()=>{
            queryClient.resetQueries({queryKey:["user"]})
            queryClient.invalidateQueries({queryKey:["user"]})
            navigate("/login")
            queryClient.resetQueries({queryKey:['items']})
        }
    })
    const handleLogout = ()=>{
        logOutMutation.mutateAsync()
    }
    const handleCart  = ()=>{
        navigate(`/cart/${result.data.user.info.id}`)
    }
    return (
        <div >
            {result.isPending ? <div className="loading-suspense-container">
                <LoadingComponent/>
            </div> :
            <div className="accountSettings-wrapper">
            {result.isError ? <Error error={"error fetching"} /> : (result.data)?
            <div className="account-settings">
                <div className="menu-toggle-container">
                    <MenuToggle toggleUserMenu={toggleUserMenu} setToggleUserMenu={setToggleUserMenu}/>
                </div>
                <aside className={`${toggleUserMenu ? "open-full" : "close-user-menu"} user-options-side`}>
                    <p className="user-option"><span>Favourites</span></p>
                    <p className="user-option"><span>Notifications</span></p>
                    <p className="user-option"><span>Orders</span></p>
                    <p className="user-option" onClick={handleCart}><span>Cart</span></p>
                    <p className="user-option" onClick={handleLogout}><span>Logout</span></p>
                    <p className="user-option"><span>Contact us</span></p>
                    <p className="user-option"><span>About us</span></p>
                </aside>
                
                {editMode ? 
                    <div className="edit-mode-inp-container">
                        <div className="image-upload-user">
                            {imageUploaded || result.data.user.info.images.length > 0 ? 
                                <div className="image-container-uploaded">
                                    <img src={imageUploaded ? URL.createObjectURL(imageUploaded):result.data.user.info.images[0].url}  alt="" className="user-image-uploaded" />
                                    <div className="delete-container"><DeleteButton operation="image" images={null} setImagesUploaded={()=>null} handleConfirmation={handleConfirmation} setImageUploaded={setImageUploaded} settingPage={true} imageRef={fileInputRef}/></div>
                                </div>
                                :
                                null
                            }
                            <label >
                                <input ref={fileInputRef} onChange={handleUploadingImage} className="upload-image-inp"  type="file" name="" id="" />
                                <p className="upload-image-btn">
                                    <svg className="camera-icon" viewBox="0 0 20 20">
                                        <path d="M10,6.536c-2.263,0-4.099,1.836-4.099,4.098S7.737,14.732,10,14.732s4.099-1.836,4.099-4.098S12.263,6.536,10,6.536M10,13.871c-1.784,0-3.235-1.453-3.235-3.237S8.216,7.399,10,7.399c1.784,0,3.235,1.452,3.235,3.235S11.784,13.871,10,13.871M17.118,5.672l-3.237,0.014L12.52,3.697c-0.082-0.105-0.209-0.168-0.343-0.168H7.824c-0.134,0-0.261,0.062-0.343,0.168L6.12,5.686H2.882c-0.951,0-1.726,0.748-1.726,1.699v7.362c0,0.951,0.774,1.725,1.726,1.725h14.236c0.951,0,1.726-0.773,1.726-1.725V7.195C18.844,6.244,18.069,5.672,17.118,5.672 M17.98,14.746c0,0.477-0.386,0.861-0.862,0.861H2.882c-0.477,0-0.863-0.385-0.863-0.861V7.384c0-0.477,0.386-0.85,0.863-0.85l3.451,0.014c0.134,0,0.261-0.062,0.343-0.168l1.361-1.989h3.926l1.361,1.989c0.082,0.105,0.209,0.168,0.343,0.168l3.451-0.014c0.477,0,0.862,0.184,0.862,0.661V14.746z"></path>
                                    </svg>
                                    Upload
                                </p>
                            </label>
                        </div>
                        <div className="name-edit-container">
                            <label>Name:</label>
                            <input value={firstNm} onChange={handleSettingFirstName} type="text" placeholder="First name" className="user-edit-mode-inp first-name-edit" />
                            <input value={lastNm} onChange={handleSettingLastName} type="text" placeholder="Last name" className="user-edit-mode-inp last-name-edit" />
                        </div>
                        <div className="email-edit-container">
                            <label >Email:</label>
                            <input value={email} onChange={handleSettingEmail} type="text" placeholder="Email" className="user-edit-mode-inp email-edit" />
                        </div>
                        <div className="password-change-container">
                            <label >Change password:</label>    
                            <input value={currentPassword} onChange={handleSettingCurrentPassword} type="password" placeholder="Current password" className="user-edit-mode-inp current-password" />
                            <input value={newPassword} onChange={handleSettingNewPassword} type="password" placeholder="New password" className="user-edit-mode-inp password-edit" />
                            <input value={confirmPassword} onChange={handleSettingConfirmPassword} type="password" placeholder="Confirm new password" className="user-edit-mode-inp confirm-password-edit" />
                            <p className="error-p inp-err">{error}</p>
                        </div>
                        <button onClick={()=>{handleConfirmation("save info")}} className="save-edit-btn">Save</button>
                        
                    </div>
                :   
                    <div className="user-info-container">
                        <Avatar  classSpecific={"setting-page-avatar"} openOptions={false} />
                        <p className="user-inf-p user-name-account">
                            <span className="info-value">{result.data.user.info.firstName} {result.data.user.info.lastName}</span>
                        </p>

                        <p className="user-inf-p user-name-account">
                            <span className="info-value">{result.data.user.info.email}</span>
                        </p>
                        
                    </div>

            }
            <aside className="settings-options-side">
                <p onClick={handleSettingEditMode} className="setttings-option"><span>Edit your informations</span></p>
                <p className="setttings-option"><span>Change the password</span></p>
                <p className="setttings-option"><span>Privacy and security</span></p>
                <p className="setttings-option"><span>Deactivate or delete your account</span></p>
            </aside>
            </div>
            :<p>none</p>}
        </div>}
        <div className={`${confirmMessage ? "container-appear" : "container-disappear"} confirm-message-container`}>
                            <div className={`${confirmMessage ? "appear" : "disappear"} confirm-message`}>
                                <p>{message}</p>
                                <div className="message-btns">
                                    <button onClick={()=>message?.includes("image")|| message?.includes("delete") ? handleSureAction("delete image") : handleSureAction("edit info")} className="sure-btn">Confirm</button>
                                    <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                                </div>
                            </div>
                            <div className="confirm-message-bg"></div>
                        </div>
        </div>
        
    ) 
}
    export default AccountSettings