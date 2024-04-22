import { Request, Response } from "express";
import path from "path"
import { CategoriesOnProducts, TagsOnProducts, addReview, createCategory, createProduct, createProductDescription, createProductDetails, createProductImage, createProductPreview, createTag, deleteCategory, deleteTag, editCategory, editTag, findCategory, findProductById, findTag, getAllCategories_admin, getAllReview, getAllTags, get_10_categories, reviewsLength, searchProducts, uploadCategoryImage ,getReviews, updateRating, createColorImage, addColor, addProductToCart, AllReviews, findCartItem, updateQuntity, findCart, cartItemsLength, cartItems, deleteItem, filter_search, deleteProductImage, FindProductImage, EditProduct, DeleteProduct, Set_Favourite, Remove_Favourite, productCustoms, editCustoms, category_suggested, remove_suggested, findSuggested, allproducts, createCarousel, Carousels, findNewProducts } from "../productPrisma";
import Stripe from "stripe";

import _ from "lodash"
import fs from "fs"

export const create_Category = async(req:Request , res:Response)=>{
    try{
        const {name}  = req.body
        const getCategory = await findCategory(name)
        if(getCategory){
            throw new Error("There's already category with that name!")
        }else{
            if(!req.file){
                throw new Error("you should add an image for category!")
            }else{
                const category = await createCategory(name)
                if(req.file){
                    const image = req.file
                    const imagePath = path.normalize(image.path)
                    const imageUrl = `${req.protocol}://${req.get("host")}/${imagePath}`
                    const createdImage = await uploadCategoryImage(imageUrl , category.id)
                    if(!createdImage){
                        throw new Error("image not Uploaded!")
                    }else if(category && createdImage){
                        return res.status(201).json({message:"Category created successfuly"})
                    }
                }

            }
        }

    }catch(error:any){
        return res.status(501).json({error:error.message})
    }

}


export const AddProduct = async (req: any, res: Response) => {
    try {
        let { name, price, details, description, preview, countInStock, categories, tags } = req.body;
        if (!name || !price || !details || !description || !preview || !countInStock || !categories || !tags || !req.files) {
            throw new Error("All fields are required");
        
        }
        const trader :any= req?.trader
        const price_to_number = Number(price);
        const stock_to_number = Number(countInStock);
        if (!price_to_number || price_to_number <= 0 || !stock_to_number || stock_to_number <= 0) {
            throw new Error("Price and Count in Stock should be positive numbers");
        }
        const product = await createProduct(name, price_to_number, stock_to_number , trader.id);
        if (!product) {
            throw new Error("Failed to create product!");
        }
        const productDescription = await createProductDescription(description, product.id);
        if (!productDescription) {
            throw new Error("Failed to create product description!");
        }
        if (Array.isArray(details)) {
            await Promise.all(details.map(async (det: any) => {
                const detail_json = JSON.parse(det);
                const productDetail = await createProductDetails(detail_json.name, detail_json.value, product.id);
                if (!productDetail) {
                    throw new Error("Failed to create product details!");
                }
            }));
        }
        const productPreview = await createProductPreview(preview, product.id);
        if (!productPreview) {
            throw new Error("Failed to create product preview!");
        }
            const productImages = req.files;
            if(Array.isArray(productImages)){
                await Promise.all(productImages.map(async (image: any) => {
                    const imagePath = image.path;
                    const url = `${req.protocol}://${req.get("host")}/product-images/${imagePath}`;
                    const createdImage = await createProductImage(url, product.id);
                    if (!createdImage) {
                        throw new Error("Failed to create product image!");
                    }
                }));
            }

        if (!Array.isArray(categories)) {
            categories = [categories]; 
        }
        await Promise.all(categories.map(async (cat: string) => {
            const category_query = await findCategory(cat);
            if (!category_query) {
                throw new Error("Cannot find that category");
            }
            await CategoriesOnProducts(product.id, category_query.id);
        }));

        if (!Array.isArray(tags)) {
            tags = [tags];
        }
        await Promise.all(tags.map(async (tag: string) => {
            const tag_query = await findTag(tag);
            if (!tag_query) {
                throw new Error("Cannot find any tag with that name!");
            }
            await TagsOnProducts(tag_query.id, product.id);
        }));

        return res.status(201).json({ message: "Product created successfully!" });
    } catch (error: any) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: error.message });
    }
}
export const createTagAdmin= async(req:Request , res:Response)=>{
    try{
        const {name} = req.body ; 
        if(!name){
            throw new Error("Name cannot be empty!")
        }
        const tag_query = await findTag(name)
        if(tag_query){
            throw new Error("Tags cannot be duplicated!")
        }
        const tag = await createTag(name)
        if(!tag){
            throw new Error("Error while creating tag")
        }
        return res.status(201).json({message:"Tag Added successfuly!"})
    }catch(err:any){
        return res.status(500).json({error:err.message})
    }
}
export const getAllCategories = async(req:Request , res:Response)=>{
    try{
        const categories = await getAllCategories_admin()
        if(Array.isArray(categories) && categories?.length===0){
            return res.status(201).json({message:"There's no categories yet!"})
        }
        return res.status(201).json(categories)
    }catch(error:any){
        return res.status(501).json({error:error.message})
    }
}

export const getAllTags_function = async(req:Request , res:Response)=>{
    try{
        const tags = await getAllTags()
        if(!tags){
            return res.status(201).json({message:"No tags yet"})
        }
        return res.status(201).json({tags})
    }catch(err:any){
        return res.status(500).json({error:err.message})
    }
}

export const editCategories = async(req:Request , res:Response)=>{
    try{
        const {prevName} = req.query
        const {name} = req.body
        if(!name){
            throw new Error("name cannot empty!")
        }
        const categoryEdited = await editCategory(`${prevName}` , {name})
        if(!categoryEdited){
            throw new Error("error while editing category name")
        }
        return res.status(201).json({message:"category edited successfuly!"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const editTags = async(req:Request , res:Response)=>{
    try{
        const {prevName} = req.query
        const {name} = req.body
        if(!name){
            throw new Error("name cannot empty!")
        }
        const tagEdited = await editTag(`${prevName}` , {name})
        if(!tagEdited){
            throw new Error("error while editing tag name")
        }
        return res.status(201).json({message:"category edited successfuly!"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const get_10_categories_admin =async(req:Request , res:Response)=>{
    try{
        const categories = await get_10_categories()
        if(!categories){
            return res.status(201).json({message:"there's no categories yet!"})
        }
        return res.status(201).json({categories})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const DeleteCategory =async(req:Request  , res : Response)=>{
    try{
        const {name} = req.query
        if(!name){
            throw new Error("Name cannot be null!")
        }
        const deletedCategory = await deleteCategory(name.toString())
        if(!deletedCategory){
            throw new  Error("sorry cannot delete that category!")
        }
        return res.status(201).json({message:"Category deleted successfuly"})
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }

}
export const DeleteTag =async(req:Request  , res : Response)=>{
    try{
        const {name} = req.query
        if(!name){
            throw new Error("Name cannot be null!")
        }
        const deletedTag = await deleteTag(name.toString())
        if(!deletedTag){
            throw new  Error("sorry cannot delete that tag!")
        }
        return res.status(201).json({message:"Tag deleted successfuly"})
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}
export const Search_Products = async (req: Request, res: Response) => {
    try {
        const { q, page } = req.query;
        const searchQuery = q?.toString();
        const pageNumber = Number(page);

        if (!searchQuery) {
            throw new Error('Cannot search empty!');
        }

        if (!page || isNaN(pageNumber)) {
            throw new Error('Invalid page number!');
        }

        const products = await searchProducts(searchQuery, pageNumber);
        let categories: string[] = [];

        _.forEach(products, (p) => {
            _.forEach(p.categories, (c) => {
                categories.push(c.category.name);
            });
        });

        const totalPages = Math.ceil(products.length / 10);

        return res.status(200).json({ products, categories, totalPages });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const getProduct = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query
        if(!productId){
            throw new Error("Cannot search empty!")
        }
        const product=await findProductById(productId.toString())
        if(!product){
            throw new Error("cannot find this product")
        }
        return res.status(201).json({product})
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}

export const AddReview = async(req:Request , res:Response)=>{
    try{
        const {content , rating , productId }= req.body ; 
        const user:any = req.user
        if(!user || !user.id){
            throw new Error("cannot find user")
        }
        const review = await addReview(content , rating , productId , user?.id)
        const reviews = await getReviews(productId)
        let ratingSummation:number = 0
        if(Array.isArray(reviews)) {
            reviews.forEach(review => {
                return ratingSummation = ratingSummation + Number(review.rating)
            })
            const averageRating = ratingSummation/reviews?.length
            const rating_average = averageRating.toFixed(2)
            await updateRating(productId , Number(rating_average))
        } 
        if(!review){
            throw new Error("Cannot create review!")
        }
        return res.status(201).json({message:"Review added succesfuly"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const GetReviews = async(req:Request , res:Response)=>{
    try{
        const {page , productId} = req.query
        if(!productId){
            throw new Error("cannot resolve product id")
        }
        const reviews = await getAllReview(Number(page) , productId?.toString())
        const length = await reviewsLength(productId.toString())
        if(!reviews){
            return res.status(201).json({message: "No reviews yet!"})
        }
        return res.status(201).json({reviews  ,length})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const AddColor = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query
        const {color} = req.body ; 
        console.log(req.file)
        if(!productId){
            throw new Error("error handle product id")
        }
        if(!color){
            throw new Error("Color cannot be null!")
        }
        if(!req.files){
            throw new Error("at least one image!")
        }
        const Color = await addColor(color ,productId?.toString())
        if(!Color){
            throw new Error("cannot create color")
        }
        if(req.files){
            const images = req.files ; 
            if(Array.isArray(images)){
                images.map(async(image)=>{
                    const imageUrl = image.path
                    const url = `${req.protocol}://${req.get("host")}/product-images/${imageUrl}`;
                    const createdImage = await createColorImage(url ,Color.id)
                    if(!createdImage){
                        throw new Error("image not added!")
                    }
                })
        }
        return res.status(201).json({message:"color created successfuly"})
    }}catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}

export const add_product_to_cart = async(req:Request , res:Response)=>{
    try{
        const {quantity} = req.body
        const {productId} = req.query
        const user : any= req.user
        if(!user || !productId || !quantity){
            throw new Error("error something is missing!")
        }
        const cart = await findCart(user.id)
        if(cart){
            const cartItem_exist = await findCartItem(productId.toString() , cart.id)
            if(cartItem_exist){
                const product = await findProductById(productId?.toString())
                const price = (Number(product?.price) * (quantity+cartItem_exist.quantity)).toFixed(2)
                if(isNaN(Number(price))){
                    throw new Error("price is NaN")
                }
                updateQuntity(cartItem_exist.id , Number(quantity+cartItem_exist.quantity) , Number(price))
            }else{
                const product = await findProductById(productId?.toString())
                const price = (Number(product?.price) * quantity).toFixed(2)
                if(isNaN(Number(price))){
                    throw new Error("price is NaN")
                }
                const cartItem = await addProductToCart(productId?.toString() ,user.id , quantity , Number(price))
                if(!cartItem){
                    throw new Error("cart item cannot be created!")
                }
            }
        }
        else{
            const product = await findProductById(productId?.toString())
            const price = (Number(product?.price) * quantity).toFixed(2)
            if(isNaN(Number(price))){
                throw new Error("price is NaN")
            }
            const cartItem = await addProductToCart(productId?.toString() ,user.id , quantity , Number(price)-Number(product?.discount))
            if(!cartItem){
                throw new Error("cart item cannot be created!")
            }
        }
        return res.status(201).json({message:"product add successfuly to cart!"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const AdvancedRating = async(req:Request , res:Response)=>{
    try{
        const {productId }= req.query
        if(!productId){
            throw new Error("cannot resolve the product id!")
        }
        const reviews = await AllReviews(productId?.toString())
        if(!reviews){
            return res.status(201).json({message:"No reviews Yet!"})
        }
        const rating = reviews?.map(review => Math.ceil(review.rating)).filter(rating => rating !== undefined);
        const five_stars = rating?.filter(rating => rating === 5);
        const four_stars = rating?.filter(rating=>rating===4)
        const three_stars = rating?.filter(rating=>rating===3)
        const two_stars = rating?.filter(rating=>rating===2)
        const one_stars = rating?.filter(rating=>rating===1)
        const percentage5 = (five_stars?.length/reviews?.length)*100
        const percentage4 = (four_stars?.length/reviews?.length)*100
        const percentage3 = (three_stars?.length/reviews?.length)*100
        const percentage2= (two_stars?.length/reviews?.length)*100
        const percentage1= (one_stars?.length/reviews?.length)*100
        return res.status(201).json({
            five :percentage5 , 
            four:percentage4 , 
            three:percentage3 , 
            two:percentage2 , 
            one:percentage1
        })
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const findCartItemsLength = async(req:Request, res:Response)=>{
    try{
        const user : any = req.user ; 
        const cart = await findCart(user.id)
        if(!cart){
            throw new Error("cannot find ur cart there's error") 
        }
        const cartItems = await cartItemsLength(cart.id)
        return res.status(201).json({length:cartItems})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const findCartItems = async(req:Request, res:Response)=>{
    try{
        const user : any = req.user ; 
        const cart = await findCart(user.id)
        if(!cart){
            throw new Error("cannot find ur cart there's error") 
        }
        const cart_items = await cartItems(cart.id)
        if(cart_items && Array.isArray(cart_items)){
            const totalPrice = _.sumBy(cart_items , (c)=>{
                return Number(c.price)
            })
            const totalQuantities = _.sumBy(cart_items,(c)=>{
                return Number(c.quantity)
            })

            return res.status(201).json({cart_items ,totalPrice , totalQuantities})
        }
        
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const UpdateQuantity = async(req:Request, res:Response)=>{
    try{
        const user : any = req.user ; 
        const {productId} = req.query
        const {quantity} = req.body
        const cart = await findCart(user.id)
        if(!productId){
            throw new Error("error resolving the product id")
        }
        if(!cart){
            throw new Error("cannot find the cart")
        }
        const product = await findProductById(productId.toString())
        if(!product){
            throw new Error("cannot find the product")
        }
        const cartItem = await findCartItem(productId?.toString() ,cart.id )
        if(!cartItem){
            throw new Error("cannot find the cartItem")
        }
        const update = await updateQuntity(cartItem.id , quantity , Number(product?.price*quantity))
        if(!update){
            throw new Error("cannot update!")
        }
        return res.status(201).json({message:"done!"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const handleDeleteItem = async(req:Request , res:Response)=>{
    try{
        const user : any = req.user ; 
        const cart = await findCart(user.id)
        const {productId} = req.query
        if(!productId){
            throw new Error("error resolving the product id!")
        }
        if(!cart){
            throw new Error("cannot find ur cart there's error") 
        }
        const delete_item = await deleteItem(productId.toString() , cart.id)
        return res.status(201).json({message:"done!"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const filterSearch = async(req:Request, res:Response)=>{
    try{
        const {minPrice , maxPrice , categories ,q ,page} =req.query
        if(!q){
            throw new Error("Query cannot be empty!")
        }
        const minPrice_number = Number(minPrice) ? Number(minPrice) : 0
        const categoriesArray = categories && categories?.toString().length>0 ?categories?.toString().split(',') : []
        const categoriesSelected: string[] = Array.isArray(categoriesArray) && categoriesArray.every(category => typeof category === 'string') ? categoriesArray.map(category => category as string) : [];  
        const products = await filter_search(q.toString() , categoriesSelected, minPrice_number , Number(maxPrice ),Number(page))
        res.status(201).json({products})    
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const DeleteProductImage = async(req:Request , res:Response)=>{
    try{
        const {imageId} = req.query
        if(!imageId){
            throw new Error("cannot find the image id!")
        }
        const image = await FindProductImage(imageId.toString())
        if(!image){
            throw new Error("cannot find that image")
            
        }
        const pathname = path.resolve(__dirname , ".." , ".." , "product_images" , path.basename(image.url))
        if(fs.existsSync(pathname)){
            fs.unlinkSync(pathname)
        }
        const imageDeleted= await deleteProductImage(imageId.toString())
        if(!imageDeleted){
            throw new Error("cannot Delete this image")
        }
        return res.status(201).json({message:"Image deleted succesfuly!"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const edit_product =async(req:Request , res:Response)=>{
    try{
        const {productId}= req.query
        if(!productId){
            throw new Error("Cannot find product id")
        }
        const product = await findProductById(productId.toString())
        if(!product){
            throw new Error("cannot find this product")
        }
        const {name , price , countInStock , discount , preview ,description , details} = req.body
        let editingDetails:{name?:string , price?:number , preview?:string , countInStock?:number , description?:string , discount?:number ,details?:any[]} = {} ; 
        if(name && name!== product.name){
            editingDetails.name = name
        }
        if(price && price !== product.price){
            editingDetails.price = Number(price)
        }
        if(Number(countInStock)&& Number(countInStock) !== Number(product?.countInStock)){
            editingDetails.countInStock = Number(countInStock)
        }
        if(discount && discount !== product.discount){
            editingDetails.discount = Number(discount)
        }
        if(preview && preview !== product.preview?.content){
            editingDetails.preview = preview
        } 
        if(description && description !== product.description[0].content){
            editingDetails.description = description
        }
        const info = EditProduct(productId.toString() , editingDetails)
        if(req.files){
            const images = req.files
            if(Array.isArray(images) && images.length > 0){
                images.map(async(image)=>{
                    const imagePath = image.path
                    const imageUrl = `${req.protocol}://${req.get("host")}/product-images/${imagePath}` ; 
                    return await createProductImage(imageUrl, productId.toString());
                })
            }

        }
        if(details && details.length> 0){
            const detailsEdited = await editCustoms(productId.toString() ,details)
        }
        return res.status(201).json({message:"Product informations updated"})
    }catch(err:any){
        console.log(err.message)
        res.status(501).json({error:err.message})
    }
}
export const Delete_Product = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query
        if(!productId){
            throw new Error("cannot find product id")
        }
        const product = await findProductById(productId.toString())
        if(!product){
            throw new Error("cannot find that product")
        }
        const deleteProduct = DeleteProduct(product.id)
        if(!deleteProduct){
            throw new Error("error occured while deleting the product")
        }
        return res.status(201).json({message:"product deleted succesfuly"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const AddFavourite = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query
        const user:any = req.user
        if(!productId || !user?.id){
            throw new Error("cannot find product id or user id")
        }
        const add_favourite = await Set_Favourite(user.id.toString() , productId.toString())
        if(!add_favourite){
            throw new Error("error occured while adding product to favourites")
        }
        return res.status(201).json({message:"Product added to favourites"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const RemoveFavourite = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query ; 
        const user :any= req.user
        if(!productId || !user.id) {
            throw new Error("cannot find product id or user id")
        }
        const deleteFavourite = await Remove_Favourite(user.id.toString() , productId.toString())
        if(!deleteFavourite){
            throw new Error("an error occured while removing product from favourites")
        }
        return res.status(201).json({message:"Product removed from favourites"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const getDetails = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query ; 
        if(!productId){
            throw new Error("cannot find the product id")
        }
        const details = await productCustoms(productId.toString())
        return res.status(201).json(details)

    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const setSuggest = async(req:Request , res:Response)=>{
    try{
        const {categoryId} = req.query ; 
        if(!categoryId){
            throw new Error("cannot find the product id")
        }
        const suggested = await category_suggested(categoryId.toString())
        return res.status(201).json({message:"done"})

    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const removeOfSuggest = async(req:Request , res:Response)=>{
    try{
        const {categoryId} = req.query ; 
        if(!categoryId){
            throw new Error("cannot find the product id")
        }
        const suggested = await remove_suggested(categoryId.toString())
        return res.status(201).json({message:"done"})

    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const getAllSuggested = async(req:Request , res:Response)=>{
    try{
        const suggested = await findSuggested()
        if(!suggested){
            return res.status(201).json({message:"cannot find any suggested categories"})
        }else{
            return res.status(201).json(suggested)
        }

    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const getAllProducts = async(req:Request , res:Response)=>{
    try{
        const products = await allproducts()
        if(!products){
            return res.status(201).json({message:"no products yet!"})
        }else{
            return res.status(201).json(products)
        }

    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}
export const createNewCarousel = async(req:Request , res:Response)=>{
    try{
        const {products , title} = req.body
        if(!products){
            return res.status(201).json({message:"no products yet!"})
        }
        const carousel = await createCarousel(products , title)
        
        return res.status(201).json({message:"done"})
        

    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const getAllCarousels = async(req:Request , res:Response)=>{
    try{
        const carousels = await Carousels()  ;
        return res.status(201).json(carousels)
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}


export const BuyNow = async(req:Request , res:Response)=>{
    try{
        const {productId} = req.query
        const {quantity} = req.body
        if(!productId || !quantity){
            throw new Error ("error solving the quantity or product id ")
        }
        const product  = await findProductById(productId.toString()) ; 
        if(!product){
            throw new Error ("Sorry, cannot find this product"); 
        }
        return res.status(201).json({product , quantity})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const checkOutPayment =async (req:Request , res:Response)=>{
    try{
        if(process?.env?.Secret_Key){
            const {productId} = req.query ; 
            const {quantity ,orderId} = req.body ; 
            console.log(orderId)
            if(!productId || !quantity || !orderId){
                throw new Error("cannot find product id or quantity")
            }
            const product = await findProductById(productId.toString())
            if(!product){
                throw new Error("error:cannot find this product")
            }
            const currency = 'usd'
            const price = (product.price - (product.discount*product.price))*quantity*100
            const lineItem = {
                price_data: {
                    currency: currency,
                    unit_amount: price,
                    product_data: {
                        name: product.name,
                        images: [product.images[0].url], 
                    },
                },
                quantity: quantity,
            };
            
            
            const stripe = new Stripe(process.env.Secret_Key)
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [lineItem],
                mode: "payment",
                success_url: `http://localhost:5173/success?orderId=${orderId}`,
                cancel_url: "http://localhost:5173/cancel" , 
                
                metadata:{
                    orderId
                }
            });
            console.log(session.metadata)
            return res.status(201).json({id:session.id})
        }else{
            throw new Error("cannot find the secret key")
        }
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}

export const NewArrivalProducts = async(req:Request , res:Response)=>{
    try{
        const products = await findNewProducts() ; 
        
        return res.status(201).json(products)
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}


export const checkOutPayment_products =async (req:any , res:Response)=>{
    try{
        if(process?.env?.Secret_Key){
            const {orderId } = req.body ;
            const user = req.user 
            if(!user ||!orderId){
                throw new Error("cannot find product id or quantity")
            }
            const cart=await  findCart(user.id)
            if(!cart){
                throw new Error("cannot find user's cart")
            }
            const cart_items = await cartItems(cart.id)
            if(!cart_items){
                throw new Error ("your cart is empty to order")
            }
            const productsInfo = cart_items.map(product=>({
                name:product.product.name , 
                images:product.product.images , 
                price:(product.product.price - ((product.product.discount/100) * product.product.price)) * product.quantity , 
                quantity : product.quantity
            }))
            const currency = 'usd'
            
            const lineItem = productsInfo.map(p=>({
                price_data: {
                    currency: currency,
                    unit_amount:Math.round(p.price*100) ,
                    product_data: {
                        name: p.name,
                        images: p.images.map(image=>image.url), 
                    },
                },
                quantity: p.quantity,
            }));
            
            
            const stripe = new Stripe(process.env.Secret_Key)
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItem,
                mode: "payment",
                success_url: `http://localhost:5173/success?orderId=${orderId}`,
                cancel_url: "http://localhost:5173/cancel" , 
                

            });
            return res.status(201).json({id:session.id})
        }else{
            throw new Error("cannot find the secret key")
        }
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}
