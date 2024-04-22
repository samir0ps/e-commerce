import {   useRef, useState , useCallback } from "react"
import "./styles/editProduct.css"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import axios from "axios"
import Confirmation from "../components/confirmation"
import { MdDelete } from "react-icons/md"
import Dropzone from "react-dropzone"
import TextEditor from "../components/text_editor/TextEditor"
import PlaygroundEditorTheme from '../components/text_editor/themes/PlaygroundEditorTheme';
import PlaygroundNodes from "../components/text_editor/nodes/PlaygroundNodes";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SharedHistoryContext } from "../components/text_editor/context/SharedHistoryContext";
import { SharedAutocompleteContext } from "../components/text_editor/context/SharedAutocompleteContext";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import {TableContext} from '../components/text_editor/plugins/TablePlugin';
import "./styles/newProductPage.css"
import ErrorMessage from "../subcomponents/errorMessage"
import SuccMessage from "../components/succMessage"
import { LiaPercentSolid } from "react-icons/lia";
import { TbCurrencyDollar } from "react-icons/tb";
import CustomInputs from "../components/customInputs"

const EditProduct = ()=>{
    const nameRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const stockRef = useRef<HTMLInputElement>(null)
    const discountRef = useRef<HTMLInputElement>(null)
    const previewRef = useRef<HTMLTextAreaElement>(null)
    const imageRef  = useRef(null)
    const [images , setImages] = useState<{id:string , url:string}[]>([])
    const [confimrationMessage , setConfirmationMessage] = useState<string>("")
    const [openConfirmation , setOpenConfirmation] = useState<boolean> (false)
    const [imagesUploaded , setImagesUploaded] = useState<File []>([])
    const [imageId , setImageId] = useState<string | null>(null)
    const {id} = useParams()
    const queryClient = useQueryClient()
    const [editorContent , setEditorContent] = useState<string>('')
    const [initialContent , setInitialContent] = useState('')
    const [error , setError] = useState<string | null>(null)
    const [succMessage , setSuccMessage] = useState<string|null>(null)
    const [description ,setDescription] = useState<string>('')
    const [modifiedCustoms , setModifiedCustoms] = useState<any[]>([])
    useQuery({
        queryKey: ['product' , id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/product/get-product?productId=${id?.toString()}`)
            if(response.data){
                (nameRef.current as HTMLInputElement).value =response.data.product.name ; 
                (discountRef.current as HTMLInputElement).value =response.data.product.discount ; 
                (priceRef.current as HTMLInputElement).value =response.data.product.price ; 
                (stockRef.current as HTMLInputElement).value =response.data.product.countInStock ;
                (previewRef.current as HTMLTextAreaElement).value=response.data.product.preview.content ; 
                setInitialContent(response.data.product.description[0].content)
                setImages(response.data.product.images)
            }
            return response.data
        },
    })
    const deleteMutation = useMutation({
        mutationFn:async()=>{
            const response = await axios.delete(`http://localhost:3000/api/product/delete-product-image?imageId=${imageId}`)
            return response.data
        } , 
        onSuccess : ()=>{
            queryClient.invalidateQueries({queryKey:['product' , id]})
        }

    })
    const handleDeleteImage =(id:string)=>{
        setConfirmationMessage("Are you sure u want to delete this image you cannot find it any more?")
        setOpenConfirmation(true)
        setImageId(id)
    }
    const deleteImageFn = ()=>{
        deleteMutation.mutateAsync()
    }
    const onDrop = useCallback((acceptedFiles: any) => {
        setImagesUploaded(prev => [...(prev || []), ...acceptedFiles]);
    }, []);

    const handleDeleteUploadedImage = (image:File)=>{
        const filteredImages : File[] | undefined = imagesUploaded?.filter(img => img !== image)
        if(filteredImages && Array.isArray(filteredImages)){
            setImagesUploaded(filteredImages)
        }
    }
    
    const editMutation = useMutation({
        mutationFn: async (newData: any) => {
            const response = await axios.put(`http://localhost:3000/api/product/edit-product?productId=${id}`, newData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        },
        onSuccess: (data) => {
            setSuccMessage(data.message);
            queryClient.resetQueries({ queryKey: ["product" ,id] });
        },
        onError: (err: any) => {
            setError(err.error);
        }
    });

    const saveAction  =async()=>{
        try{
            const formData = new FormData();
            formData.append("name", (nameRef.current as HTMLInputElement).value.toString());
            formData.append("price", (priceRef.current as HTMLInputElement).value.toString());
            formData.append("countInStock", (stockRef.current as HTMLInputElement).value.toString());
            formData.append("preview", (previewRef.current as HTMLTextAreaElement).value.toString());
            formData.append("discount", (discountRef.current as HTMLInputElement).value.toString())
            for (let custom of modifiedCustoms) {
                formData.append("details[]" , JSON.stringify(custom))
            }
            if (imagesUploaded && imagesUploaded.length > 0) {
                for (const image of imagesUploaded) {
                    formData.append("images", image);
                }
            }
            
            await editMutation.mutateAsync(formData);
        }catch(err:any){
            setError(err.message)
        }

    }
    
    
    return (
        <div className="edit-product-wrapper">
            <h1>Edit The Product</h1>
            <div className="edit-page-container">
                <div className="details-container-edit">
                    <div className="new-product-name-container">
                        <label >Name</label>
                        <input ref={nameRef} type="text" placeholder="Write the new name..." />
                    </div>
                    <div className="new-product-price-container">
                        <div className="price-icon">
                            <TbCurrencyDollar />
                        </div>
                        <label >Price</label>
                        
                        <input ref={priceRef} min={0} type="number" placeholder="Write the new Price..." />
                    </div>
                    <div className="new-product-discount-container">
                        <label >Discount</label>
                        <div className="percent-icon">
                            <LiaPercentSolid />
                        </div>
                        <input ref={discountRef} min={1} type="number" placeholder="Write product discount..." />
                    </div>
                    <div className="new-product-stock-container">
                        <label >Stock</label>
                        <input ref={stockRef} min={1} type="number" placeholder="Write product count in stock..."/>
                    </div>
                    <div className="preview-edit-container">
                        <label >Preview</label>
                        <textarea ref={previewRef} placeholder="Write product's preview..."></textarea>
                    </div>
                    
                </div>

                <div className="edit-images-container">
                    <h3>Product's images</h3>
                    {images.length > 0 && 
                    <div className="images-grid-container">
                        {images.map((image ,index)=>(
                            <div key={image.id} className="image-container-uploaded">
                                <img ref={imageRef} className="product-image-edit"  src={image.url} alt={`image_${index}`} />
                                <button onClick={()=>handleDeleteImage(image.id)} className="delete-product-img-btn"><MdDelete/>Delete</button>
                            </div>
                        ))}
                    </div>
                    }
                    <h3>Upload New Images</h3>
                    <section className="drop-section">
                                    <section className="images-preview">
                                        {Array.isArray(imagesUploaded) && imagesUploaded.length > 0 ? (
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
                <div className="add-info-container">
                    <div className="save-btn-container">
                    <div className="custom-inputs-container">
                            <CustomInputs modifiedCustoms ={modifiedCustoms} setModifiedCustoms={setModifiedCustoms}/>
                        </div>
                </div>
                <button onClick={saveAction} className="save-btn">Save New Information</button>
            </div>
            </div>
            <div className="descriptionEditorContainer">
                        <div className="description-inp">
                            <LexicalComposer initialConfig={{namespace:"DescriptionEditor" , onError:(error:Error)=>{
                                throw error
                            } , nodes:[...PlaygroundNodes], theme:PlaygroundEditorTheme}} >
                                <SharedHistoryContext>
                                    <TableContext>
                                        <SharedAutocompleteContext>
                                            <TextEditor setDescription={setDescription} editingMode={true} editorContent={initialContent} setEditorContent={setEditorContent}/>
                                            <ClearEditorPlugin/>
                                        </SharedAutocompleteContext>
                                    </TableContext>
                                </SharedHistoryContext>
                            </LexicalComposer>
                        </div>
            </div>
            <Confirmation handleFn={deleteImageFn} message={confimrationMessage} openConfirmation={openConfirmation} setOpenConfirmation={setOpenConfirmation}/>
            
            <ErrorMessage error={error} setError={setError}/>
            <SuccMessage succMessage={succMessage} setSuccMessage={setSuccMessage}/>
        </div>
    )
}

export default EditProduct