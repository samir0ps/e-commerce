import { FormEvent, useCallback, useState } from "react"
import {HexColorPicker} from "react-colorful"
import Dropzone from "react-dropzone"
import {motion} from "framer-motion"
import "../components/styles/addcolor.css"
import { useOutsideClick } from "../components/outsideClick"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
export default function AddColor ({openAddColor, setOpenAddColor}:{openAddColor:boolean, setOpenAddColor:(value:boolean)=>void}){
    const [color,setColor] = useState("#aabbcc")
    const [imagesUploaded, setImagesUploaded] = useState<File []>([])
    const {id} = useParams()
    const handleDeleteUploadedImage = (image:File)=>{
        const filteredImages : File[] | undefined = imagesUploaded?.filter(img => img!== image)
        if(filteredImages && Array.isArray(filteredImages)){
            setImagesUploaded(filteredImages)
        }
    }
    const onDrop = useCallback((acceptedFiles: any) => {
        setImagesUploaded(prev => [...(prev || []),...acceptedFiles]);
    }, []);
    const ref = useOutsideClick(()=>{
        setOpenAddColor(false)
    })
    const handleSettingColor = (e:FormEvent<HTMLInputElement>)=>{
        setColor(e.currentTarget.value)
    }
    const mutation = useMutation({
        mutationFn:async(data:any)=>{
            const response = await axios.post(`http://localhost:3000/api/product/add-color?productId=${id} `, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            } )
            return response.data
        },
        onSuccess:()=>{
            setOpenAddColor(false)
        }
    })
    const onSubmit = async () => {
            
        
            try {
                const formData = new FormData()
        
                formData.append('color', color)
                
                
                for (const file of imagesUploaded) {
                formData.append('images', file)
                }
        
                await mutation.mutateAsync(formData)
            } catch (error) {
                console.error(error)
            }
            
        }


    
    return (
        <motion.div initial={{visibility:"hidden"}} animate={openAddColor? {visibility:"visible"} : { visibility:'hidden', transition:{delay:0.2}}} className="color-container">
            <div className="normal-container">
                <motion.div initial={{scale:0}} animate={openAddColor? {scale:1} : {scale:0}} className="add-color-form" ref={ref}>
                    <h1>Adding Color for The Product</h1>
                    <div className="pick-color-container">
                        <h3>Pick Color</h3>
                        <HexColorPicker color={color} onChange={setColor}/>
                        <input type="text" value={color}  onChange={handleSettingColor}/>
                    </div>
                    <div className="upload-color-images">
                        <h3>Upload The New Product's Color images</h3>
                        <section className="drop-section">
                                            <section className="images-preview">
                                                {Array.isArray(imagesUploaded) && imagesUploaded.length > 0? (
                                                    <div className="images-container">
                                                        {imagesUploaded?.map((image, index) => (
                                                            <div key={index} className="image-uploaded-container">
                                                                <img  src={URL.createObjectURL(image)} alt="" />
                                                                <button onClick={()=>handleDeleteUploadedImage(image)} className="delete-product-img-btn">Delete</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="empty-container">No images added</div>
                                                )}
                                            </section>
                                            
                                            <Dropzone multiple onDrop={onDrop}>
                                                {({getRootProps, getInputProps}) => (
                                                    <div className="image-upload-container" {...getRootProps()}>
                                                        <div className="add-page"><svg className="gallery-icon" viewBox="0 0 20 20">
                                                    <path d="M18.555,15.354V4.592c0-0.248-0.202-0.451-0.45-0.451H1.888c-0.248,0-0.451,0.203-0.451,0.451v10.808c0,0.559,0.751,0.451,0.451,0.451h16.217h0.005C18.793,15.851,18.478,14.814,18.555,15.354 M2.8,14.949l4.944-6.464l4.144,5.419c0.003,0.003,0.003,0.003,0.003,0.005l0.797,1.04H2.8z M13.822,14.949l-1.006-1.317l1.689-2.218l2.688,3.535H13.822z M17.654,14.064l-2.791-3.666c-0.181-0.237-0.535-0.237-0.716,0l-1.899,2.493l-4.146-5.42c-0.18-0.237-0.536-0.237-0.716,0l-5.047,6.598V5.042h15.316V14.064z M12.474,6.393c-0.869,0-1.577,0.707-1.577,1.576s0.708,1.576,1.577,1.576s1.577-0.707,1.577-1.576S13.343,6.393,12.474,6.393 M12.474,8.645c-0.371,0-0.676-0.304-0.676-0.676s0.305-0.676,0.676-0.676c0.372,0,0.676,0.304,0.676,0.676S12.846,8.645,12.474,8.645"></path>
                                                </svg>
                                                <p>Drag & drop some files here, or click to select files</p>
                                                </div>
                                                        <input {...getInputProps()} />
                                                        
                                                    </div>
                                                )}
                                                </Dropzone>
                                        </section>
                    </div>
                    <button onClick={onSubmit}>Submit</button>
                </motion.div>

            </div>
        </motion.div>
    )
}