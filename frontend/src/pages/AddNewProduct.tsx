import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { PiCurrencyDollar } from "react-icons/pi";
import axios from "axios";
import TextEditor from "../components/text_editor/TextEditor";
import "./styles/newProductPage.css"
import { FormEvent, useCallback  , useRef, useState} from "react";
import Dropzone from "react-dropzone";
import CategoriesDropdown from "../subcomponents/categoriesInput";
import {TableContext} from '../components/text_editor/plugins/TablePlugin';
import { BsTrash3 } from "react-icons/bs";
import PlaygroundEditorTheme from '../components/text_editor/themes/PlaygroundEditorTheme';
import PlaygroundNodes from "../components/text_editor/nodes/PlaygroundNodes";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SharedHistoryContext } from "../components/text_editor/context/SharedHistoryContext";
import { SharedAutocompleteContext } from "../components/text_editor/context/SharedAutocompleteContext";
import ErrorMessage from "../subcomponents/errorMessage";
import { VscEdit } from "react-icons/vsc";
import { MdClose, MdOutlineDone } from "react-icons/md";
import ChooseTags from "../components/tags";
import SuccMessage from "../components/succMessage";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import DeleteButton from "../subcomponents/deleteButton";


type CustomInputsTypes={
        name:string ;
        value:string
}
type errorsTypes = {
    name?:{
        message:string
    } ; 
    price?:{
        message:string
    } ; 
    stock?:{
        message:string ; 

    }
    preview?:{
        message:string ; 
    }
    details?:{
        message:string ; 
    }
    description?:{
        message:string ; 
    }
    categories?:{
        message:string ; 
    } ; 
    tags?:{
        message:string ; 
    } ; 
    images?:{
        message:string ; 
    }
}
const AddNewProduct = ()=>{
    const navigate = useNavigate()
    const [images , setImages] = useState<File[] | null>(null)
    const [categoriesSelected , setCategoriesSelected] = useState<string[] | null>([])
    const [editorContent , setEditorContent] = useState<string>("")
    const [customInputs , setCustomInputs] = useState<CustomInputsTypes[]>([])
    const [customName , setCustomName] = useState<string>('')
    const [customValue , setCustomValue] = useState<string> ("")
    const [editMode , setEditMode ] = useState<number | null>(null)
    const [editingName , setEditingName] = useState<string > ('')
    const [editingValue , setEditingValue] = useState<string>('')
    const [error , setError] = useState<string |null>(null)
    const [tagsChosen , setTagsChosen] = useState<string[] | null>(null)
    const [productName , setProductName] = useState<string>('')
    const [price , setPrice] = useState<number | null>(null)
    const [countInStock , setCountInStock] = useState<number | null>(null)
    const [errors , setErrors] = useState<errorsTypes | null>(null)
    const [preview , setPreview] = useState<string>('')
    const [succ ,setSucc] = useState<string | null>(null)
    useQuery({
        queryKey: ["isAdmin"],
        queryFn: async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/get-user");
                const status = response.data.user.status;
                if (status === "Logged out") {
                    navigate("/");
                    throw new Error("Cannot load this page for normal user");
                } else {
                    const role = response.data.user.info.role;
                    if (role !== "ADMIN") {
                        navigate("/");
                        throw new Error("Cannot load this page for normal user");
                    } else {
                        return response.data;
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        }
    });
    const mutation = useMutation({
        mutationFn:async(productData:any)=>{
            const response = await axios.post("http://localhost:3000/api/product/create-new-product" ,productData , {
                headers:{
                    'Content-Type' : "multipart/form-data"
                }
            } )
            return response.data
        } , 
        onSuccess:(data)=>{
            setPreview('')
            setProductName('')
            setPrice(null)
            setEditorContent('')
            setCountInStock(null)
            setImages(null)
            setCustomInputs([])
            setCategoriesSelected([])
            setTagsChosen([])
            setSucc(data.message)
            
        } ,
        onError:(error:any)=>{
            setError(error.error)
        } , 
    })
    const handleErrors = (operation : string , message:string)=>{
        if(operation==="price"){
            setErrors(prev => ({ ...(prev || {}), price: { message } }));
        }else if(operation==="name"){
            setErrors(prev => ({ ...(prev || {}), name: { message } }));
        }
        else if(operation==="stock"){
            setErrors(prev => ({ ...(prev || {}), stock: { message } }));
        }
        else if(operation==="preview"){
            setErrors(prev => ({ ...(prev || {}), preview: { message } }));
        }
        else if(operation==="details"){
            setErrors(prev => ({ ...(prev || {}), details: { message } }));
        }
        else if(operation==="description"){
            setErrors(prev => ({ ...(prev || {}), description: { message } }));
        }
        else if(operation==="images"){
            setErrors(prev => ({ ...(prev || {}), images: { message } }));
        }
        else if(operation==="tags"){
            setErrors(prev => ({ ...(prev || {}), tags: { message } }));
        }
        else if(operation==="categories"){
            setErrors(prev => ({ ...(prev || {}), categories: { message } }));
        }
        
    }
    const onDrop = useCallback((acceptedFiles: any) => {
        setErrors(null)
        setImages(prev => [...(prev || []), ...acceptedFiles]);
    }, []);
    const handleAddingCustoms = () => {
        try{
            if(customName==="" || customValue==="" ){
                throw new Error("Not allowed adding empty specified!")
            }
            setCustomInputs(prev => [...(prev || []), { name: customName, value: customValue }]);
            setCustomName('')
            setCustomValue("")

        }catch(err:any){
            setError(err.message)
        }
    };
    
    const handleCustomName = (e:FormEvent<HTMLInputElement>)=>{
        const name = (e.currentTarget as HTMLInputElement).value ; 
        setCustomName(name)
        setErrors(null)
    }
    const handleCustomValue=(e:FormEvent<HTMLInputElement>)=>{
        const value = (e.currentTarget as HTMLInputElement).value ; 
        setCustomValue(value)
        setErrors(null)
    }
    const handleDeleteCustom = (name:string)=>{
        try{
            const customInp = customInputs?.find(inp=> inp.name === name)
            const filteredCustoms = customInputs?.filter(inp=> inp !== customInp)
            if(!Array.isArray(filteredCustoms) ){
                throw new Error("there's problem in filtered customs variable")
            }
            setCustomInputs(filteredCustoms)

        }catch(err:any){
            setError(err.message)
        }
    }
    const handlingEditMode= (name:string , value:string , index:number)=>{
        setEditMode(index)
        setEditingName(name)
        setEditingValue(value)
    }
    const handleSavingChanges = (name:string)=>{
        const customInp = customInputs?.find(inp=> inp.name === name)
        if(!customInp) {
            return 
        }
        customInp.name = editingName
        customInp.value = editingValue
        setEditMode(null)
    }
    const handleEditingName = (e:FormEvent<HTMLInputElement>)=>{
        const editedName = (e.currentTarget as HTMLInputElement).value
        setEditingName(editedName)
    }
    const handleEditingValue= (e:FormEvent<HTMLInputElement>)=>{
        const editedValue = (e.currentTarget as HTMLInputElement).value
        setEditingValue(editedValue)
    }
    const handleDelete =(name:string , operater:string)=>{
        if(operater === "tags"){
            const filter = tagsChosen?.filter(tag=>tag !== name )
            console.log(filter)
            if(filter){
                setTagsChosen(filter)
            }
        }
        else if(operater === "category"){
            const filter = categoriesSelected?.filter(category=>category !== name)
            if(filter){
                setCategoriesSelected(filter)
            }
        }
    }
    const handleSettingName=(e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value ; 
        setProductName(value)
        setErrors(null)
    }
    const handleSettingPreview=(e:FormEvent<HTMLTextAreaElement>)=>{
        const value = e.currentTarget.value ; 
        setPreview(value)
        setErrors(null)
    }
    const handleSettingPrice =(e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value ; 
        if(Number(value) <= 0 && value !== ''){
            setPrice(null)
            handleErrors("price", "Price cannot be negative(-ve:-less than zero(0))!")
        }else{
            setPrice(Number(value))
            setErrors(null)
        }

    }
    const handleSettingStock =(e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value ; 
        if(Number(value) <= 0 && value !== ''){
            setCountInStock(null)
            handleErrors("stock", "Stock cannot be negative(-ve:-less than zero(0))!")
        }else{
            setCountInStock(Number(value))
            setErrors(null)
        }
    }
    
    const handleSubmit = async()=>{
        try{
            if(productName === "" || productName === null){
                handleErrors("name" , "Product's name required!")
                throw new Error("Invalid input")
            }
            if(price === null){
                handleErrors("price" , "Product's price required!")
                throw new Error("Invalid input")
            }
            if(countInStock === null){
                handleErrors("stock" , "Product's stock required!")
                throw new Error("Invalid input")
            }
            if(preview === null || preview === ""){
                handleErrors("preview" , "Product's stock required!")
                throw new Error("Invalid input")
            }
            if(images?.length === 0){
                handleErrors("images" , "You should upload at least one image!")
                throw new Error("Invalid input")
            }
            if(categoriesSelected?.length ===0){
                handleErrors("categories" , "You should at least select one category!")
                throw new Error("Invalid input")
            }
            if(tagsChosen?.length ===0){
                handleErrors("tags" , "You should at least select one tag!")
                throw new Error("Invalid input")
            }
            if(!customInputs){
                handleErrors("details" , "You should at least type five customs");
                throw new Error("Invalid input");
            }
            if (customInputs && (Array.isArray(customInputs) && customInputs.length <= 5)) {
                handleErrors("details" , "You should at least type five customs!");
                throw new Error("Invalid input");
            }
            if(!editorContent || editorContent === '' ){
                handleErrors("description" , "You should write at least 255 char of product description");
                throw new Error("Invalid input");
            }
            const formData = new FormData();
            formData.append("name", productName);
            formData.append("price", price.toString());
            formData.append("countInStock", countInStock.toString());
            formData.append("preview", preview);
            if (images && images.length > 0) {
                for (const image of images) {
                    formData.append("images", image);
                }
            }
            if (customInputs && customInputs.length > 0) {
                customInputs.forEach((inp) => {
                    formData.append(`details`, JSON.stringify(inp));
                });
            }
            if (categoriesSelected && categoriesSelected.length > 0) {
                categoriesSelected.forEach((category) => {
                    formData.append(`categories`, category);
                });
            }
            if (tagsChosen && tagsChosen.length > 0) {
                tagsChosen.forEach((tag) => {
                    formData.append(`tags`, tag);
                });
            }
            formData.append("description", editorContent);
            await mutation.mutateAsync(formData);
        }catch(error:any){
            setError(error.message)
        }
    }
    const imageRef = useRef<HTMLInputElement>(null)
    return (
        <div className="add-new-product-wrapper">
            <h1 className="new-product-heading">New Product</h1>
            <div className="product-inp-wrapper">
                <div className="product-details">
                    <div className="product-inps">
                        <div className="product-name">
                            <label>Product Name</label>
                            <input value={productName} onChange={handleSettingName} type="text" placeholder="Product's name..." className="add-new-product-inp" />
                            <p className={`${errors?.name?.message? "inp-error": "not-error"} error-product`}>{errors?.name?.message}</p>
                        </div>
                        <div className="add-product-price">
                            <label>Product Price</label>
                            <div className="price-container">
                                <PiCurrencyDollar className="dollar-icon"/>
                                <input value={price ? price : ""} onChange={handleSettingPrice} min={0} type="number" placeholder="Price..." className="add-new-product-inp" id="price-inp" />
                                <p className={`${errors?.price?.message? "inp-error": "not-error"} error-product`}>{errors?.price?.message}</p>
                            </div>
                        </div>
                        <div className="product-count-in">
                            <label >Stock</label>
                            <input value={countInStock? countInStock : ''} onChange={handleSettingStock} min={0} type="number" placeholder="Count in stock..." className="add-new-product-inp" />
                            <p className={`${errors?.stock?.message? "inp-error": "not-error"} error-product`}>{errors?.stock?.message}</p>
                        </div>
                    </div>
                    <div className="preview">
                        <label>Product Preview</label>
                        <textarea onChange={handleSettingPreview} value={preview}  placeholder="Product's preview..." className="product-preview-text-area"></textarea>
                    </div>
                    <div className="product-specifications">
                            <label >Product Specifications</label>
                            {Array.isArray(customInputs) && customInputs?.length>0 && 
                                customInputs.map((inp , index)=>(
                                    <div className="custom-view-container">
                                        {editMode === index ?  
                                        <div className="detail-container editing-container">
                                            <input value={editingName} onChange={handleEditingName} type="text" className="detail-name" /> : <input onChange={handleEditingValue} value={editingValue} type="text" className="detail-value" />
                                            <MdOutlineDone onClick={()=>{handleSavingChanges(inp.name)}} className="done-icon"/>
                                        </div>:                                        
                                        <div className="custom-inp-view">
                                            <p className="custom-name">{inp.name}</p>  <p className="custom-value">{inp.value}</p>
                                            <div className="icons-container">
                                                <div onClick={()=>{handleDeleteCustom(inp.name)}} className="trash-container">
                                                    <BsTrash3  className="trash-icon"/>
                                                </div>
                                                <div onClick={()=>{handlingEditMode(inp.name , inp.value , index)}} className="pencil-container">
                                                    <VscEdit  className="pencil-icon"/>
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                ))
                            }
                            <div className="detail-container">
                                <div className="name-det-container">
                                    <label>Name</label>
                                    <input onChange={handleCustomName} value={customName} type="text" placeholder="Specific detail name..." className="detail-name"/>
                                </div>
                                : 
                                <div className="value-det-container">
                                    <label >Value</label>
                                    <input onChange={handleCustomValue} value={customValue} placeholder="Specific detail value..." type="text" className="detail-value" />
                                </div>
                                <p className={`${errors?.details?.message? "inp-error": "not-error"} error-product`}>{errors?.details?.message}</p>
                            </div>
                            <button className="add-new-specific-btn" onClick={handleAddingCustoms}>Add</button>
                        </div>
                </div>

                <div className="product-description">
                    <div className="add-product-images">
                                <label>Product Images</label>
                                <section className="drop-section">
                                    <section className="images-preview">
                                        {Array.isArray(images) && images.length > 0 ? (
                                            <div className="images-container">
                                                {images.map((image, index) => (
                                                    <div key={index} className="image-uploaded-container">
                                                        <div className="delete-container"><DeleteButton images={images} handleConfirmation={()=>null} operation={JSON.stringify(image)} settingPage={false} setImageUploaded={()=>null} setImagesUploaded={setImages} imageRef={imageRef}/></div>
                                                        <img  src={URL.createObjectURL(image)} alt="" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-container">No images added</div>
                                        )}
                                    </section>
                                    <Dropzone  multiple onDrop={onDrop}>
                                        {({getRootProps, getInputProps}) => (
                                            <div {...getRootProps()}>
                                                <div className="add-page"><svg className="gallery-icon" viewBox="0 0 20 20">
                                            <path d="M18.555,15.354V4.592c0-0.248-0.202-0.451-0.45-0.451H1.888c-0.248,0-0.451,0.203-0.451,0.451v10.808c0,0.559,0.751,0.451,0.451,0.451h16.217h0.005C18.793,15.851,18.478,14.814,18.555,15.354 M2.8,14.949l4.944-6.464l4.144,5.419c0.003,0.003,0.003,0.003,0.003,0.005l0.797,1.04H2.8z M13.822,14.949l-1.006-1.317l1.689-2.218l2.688,3.535H13.822z M17.654,14.064l-2.791-3.666c-0.181-0.237-0.535-0.237-0.716,0l-1.899,2.493l-4.146-5.42c-0.18-0.237-0.536-0.237-0.716,0l-5.047,6.598V5.042h15.316V14.064z M12.474,6.393c-0.869,0-1.577,0.707-1.577,1.576s0.708,1.576,1.577,1.576s1.577-0.707,1.577-1.576S13.343,6.393,12.474,6.393 M12.474,8.645c-0.371,0-0.676-0.304-0.676-0.676s0.305-0.676,0.676-0.676c0.372,0,0.676,0.304,0.676,0.676S12.846,8.645,12.474,8.645"></path>
                                        </svg>
                                        <p>Drag & drop some files here, or click to select files</p>
                                        </div>
                                                <input {...getInputProps()} />
                                                
                                            </div>
                                        )}
                                        </Dropzone>
                                        <p className={`${errors?.images?.message? "inp-error": "not-error"} error-product`}>{errors?.images?.message}</p>
                                </section>
                                <CategoriesDropdown categoriesSelected={categoriesSelected} setCategoriesSelected={setCategoriesSelected}/>
                                <div className="categories-container">
                                    {categoriesSelected?.map((category , index)=>(
                                        <div className="categories-badges"  key={index}><p>{category}</p><MdClose onClick={()=>handleDelete(category , "category")} className="delete-badge"/></div>

                                    ))
                                    }
                                    <p className={`${errors?.categories?.message? "inp-error": "not-error"} error-product`}>{errors?.categories?.message}</p>
                                </div>
                                <ChooseTags setTagsChosen={setTagsChosen}/>
                                <div className="categories-container">
                                    {tagsChosen?.map((tag , index)=>(
                                        <div className="categories-badges" key={index}><p>{tag}</p><MdClose onClick={()=>{handleDelete(tag , "tags")}} className="delete-badge"/></div>
                                    ))
                                    }
                                </div>
                                <button onClick={handleSubmit} className="add-product-btn">Save product</button>
                        </div>
                    
                </div>

            </div>
                    <div className="descriptionEditorContainer">
                        <h1 className="new-product-heading" style={{marginLeft:"5%"}}>Product's Description</h1>
                        <div className="description-inp">
                            <LexicalComposer initialConfig={{namespace:"DescriptionEditor" , onError:(error:Error)=>{
                                throw error
                            } , nodes:[...PlaygroundNodes], theme:PlaygroundEditorTheme}} >
                                <SharedHistoryContext>
                                    <TableContext>
                                        <SharedAutocompleteContext>
                                            <TextEditor setDescription={()=>null} editingMode={false} editorContent={editorContent} setEditorContent={setEditorContent}/>
                                            <ClearEditorPlugin/>
                                        </SharedAutocompleteContext>
                                    </TableContext>
                                </SharedHistoryContext>
                            </LexicalComposer>
                        </div>
                        <p className={`${errors?.description?.message? "inp-error": "not-error"} error-product`}>{errors?.description?.message}</p>

                    </div>
                    <ErrorMessage error={error} setError={setError}/>
                    <SuccMessage succMessage={succ} setSuccMessage={setSucc}/>
        </div>
    )
}

export default AddNewProduct