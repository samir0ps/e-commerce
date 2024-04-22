import { PrismaClient } from '@prisma/client'
import { generateUniqueId } from './userPrisma'
import path from "path"
import fs from "fs"
const prisma = new PrismaClient()


export const createCategory = async(name:string)=>{
    return await prisma.category.create({data:{id :generateUniqueId(name)  , name}})
}

export const uploadCategoryImage = async (imageUrl:string , categoryId : string)=>{
    return await prisma.categoriesImages.create({data:{
        id:generateUniqueId(imageUrl) , 
        url:imageUrl , 
        categoryId
    }})
}
export const findCategory  = async(name:string)=>{
    return await prisma.category.findFirst({where:{name:{equals:name , mode:"insensitive"}}})

}
export const createProduct = async(name:string , price:number  , countInStock:number , traderId:string)=>{
    try{
        return await prisma.product.create({data:{id:generateUniqueId(name) , price , name , countInStock , traderId}})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const createProductImage =async(url:string , productId:string)=>{
    try{
        return await prisma.productImage.create({data:{id:generateUniqueId(url) , url ,productId}})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const createProductDetails = async(name:string , value : string , productId:string)=>{
    try{
        return await prisma.productDetail.create({data:{id:generateUniqueId(name) , name , value , productId}})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const createProductDescription = async( content:string , productId:string)=>{
    try{
        return await prisma.productDescription.create({data:{id:generateUniqueId(crypto.randomUUID().toString()) , content  , productId}})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const createProductPreview = async(content:string , productId:string)=>{
    try{
        return await prisma.productPreview.create({data:{id:generateUniqueId(crypto.randomUUID().toString()), content , productId} })
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const addReview = async(content:string , rating :number , productId : string , userId : string)=>{
    try{
        return await prisma.review.create({data:{content , rating , productId , userId , id:generateUniqueId(Date.now().toString())}})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const getReviews = async(productId:string)=>{
    try{
        return await prisma.review.findMany({where:{productId}})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const getAllCategories_admin = async()=>{
    try{
        return await prisma.category.findMany()
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const isSuggested = async(categoryId:string)=>{
    try{
        return await prisma.suggestedCategories.findFirst({where:{
            categoryId
        }})
    }catch(error:any){
        console.log(error.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const createTag = async(name:string)=>{
    try{
        return await prisma.tag.create({data:{id:generateUniqueId(name) ,name}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const CategoriesOnProducts = async(productId:string , categoryId:string)=>{
    try{
        const product  = await prisma.product.findFirst({where:{id:productId}})
        if(!product){
            throw new Error("cannot find that product")
        }
        return await prisma.categoriesOnProducts.create({data:{productId , categoryId}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const TagsOnProducts = async(tagId:string , productId:string)=>{
    try{
        return await prisma.tagsOnProducts.create({data:{TagId:tagId , productId}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const findTag=async(name:string)=>{
    try{
        return await prisma.tag.findFirst({where:{name}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const getAllTags = async()=>{
    try{
        return await prisma.tag.findMany({orderBy:{name:"asc"}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const editTag = async(name:string , info:any)=>{
    try{
        const tag = await findTag(name)
        if(!tag){
            throw new Error("cannot find that tag")
        }
        return await prisma.tag.update({where:{id:tag.id} , data:info})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const editCategory = async(name:string , info:any)=>{
    try{
        const category = await findCategory(name)
        if(!category){
            throw new Error("cannot find that category")
        }
        return await prisma.category.update({where:{id:category.id} , data:info})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const get_10_categories = async()=>{
    try{
        return await prisma.category.findMany({orderBy:{name:'asc'} , include:{
            image:true , suggested:true
        }})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const deleteCategory = async(name:string)=>{
    try{
        const category = await findCategory(name)
        if(!category){
            throw new Error("cannot find this category")
        }
        const relatedProducts = await prisma.categoriesOnProducts.findMany({where:{categoryId:category.id}})
        if(relatedProducts.length>0){
            await prisma.categoriesOnProducts.deleteMany({
                where:{categoryId:category.id}
            })
        }
        const relatedImages = await prisma.categoriesImages.findMany({where:{categoryId:category.id}})
        if(relatedImages.length>0){
            relatedImages.map((image)=>{
                const imageBaseName = path.basename(image.url)
                const imagePath = path.resolve(__dirname , ".." , 'server_images' , "categories_images" , imageBaseName)
                if(fs.existsSync(imagePath)){
                    fs.unlinkSync(imagePath)
                }
            })
            await prisma.categoriesImages.deleteMany({
                where:{
                    categoryId:category.id
                }
            })
        }
        return await prisma.category.delete({where:{id:category.id}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const deleteTag= async(name:string)=>{
    try{
        const tag = await findTag(name)
        if(!tag){
            throw new Error("cannot find this Tag")
        }
        const relatedProducts = await prisma.tagsOnProducts.findMany({where:{TagId:tag.id}})
        if(relatedProducts.length>0){
            await prisma.categoriesOnProducts.deleteMany({
                where:{categoryId:tag.id}
            })
        }
        
        return await prisma.tag.delete({where:{id:tag.id}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export async function searchProducts(inp: string , page:number) {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: inp,
                            mode: 'insensitive',
                        },
                    },
                    {
                        preview: {
                            content: {
                                contains: inp,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        categories: {
                            some: {
                                category: {
                                    name: {
                                        contains: inp,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            include:{
                colors:true , 
                categories:{
                    include:{
                        category:true
                    }
                } ,
                preview:true , 
                images:true ,
                details:true
            } , 
            take:30 , 
            skip : page*30
        });
        
        return products;
    } catch (err:any) {
        console.error(err.message);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
}
export const findProductById = async(productId : string)=>{
    try{
        return await prisma.product.findFirst({where:{id:productId} , include:{colors:{
            include:{
                image:true 
            }
        } , categories:{
            include:{
                category:true
            }
        } 
        ,details:true , description:true ,images:true, reviews:true , preview:true  , tags:{
            include:{
                tag:true
            }
        }}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const  getAllReview = async(page:number , productId :string)=>{
    try{
        return await prisma.review.findMany({where:{productId} , orderBy:{
            createdAt:"desc"
        } ,skip:page*4 , take:4  , include:{
            user:{
                include:{
                    images:true
                }
            }
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const reviewsLength = async(productId:string)=>{
    try{
        const reveiws = await prisma.review.count({where:{productId}})
        return reveiws
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const AllReviews = async(productId:string)=>{
    try{
        return await prisma.review.findMany({where:{
            productId
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const updateRating = async(productId : string , rating:number)=>{
    try{
        return await prisma.product.update({where:{id:productId} , data:{rating}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const addColor = async(color:string , productId:string)=>{
    try{
        const Color = await prisma.color.create({data:{id:generateUniqueId(color) , name:color , productId}})
        if(!Color){
            throw new Error("Color not created!")
        }
        
        return Color
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const createColorImage = async(url:string , colorId:string)=>{
    try{
        const image = await prisma.colorImage.create({data:{id:generateUniqueId(url) , colorId , url}})
        if(!image){
            throw new Error("image not uploaded")
        }
        return image
    }catch(err:any){
        console.log(err.message)
    }finally{

    }
}
export const findCart = async(userId:string)=>{
    try{
        return await prisma.cart.findFirst({where:{userId}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const findCartItem = async(productId:string , cartId:string)=>{
    try{
        return await prisma.cartItem.findFirst({where:{productId , cartId}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }

}
export const updateQuntity = async(cartItemId:string , quantity:number , price:number)=>{
    try{
        return await prisma.cartItem.update({where:{id:cartItemId} , data:{quantity , price}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const deleteItem = async(productId:string , cartId:string)=>{
    try{
        const cartItem = await findCartItem(productId ,cartId )
        if(!cartItem){
            throw new Error("cannot find this item")
        }
        return await prisma.cartItem.delete({where:{id:cartItem.id}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const addProductToCart = async(productId:string, userId:string ,quantity:number , price:number)=>{
    try{
        const cart = await findCart(userId)
        if(cart){
            return await prisma.cartItem.create({data:{cartId:cart.id , id:generateUniqueId(userId) , productId , quantity , price}})
        }else{
            new Promise(async()=>{
                await prisma.cart.create({data:{userId , id:generateUniqueId(crypto.randomUUID().toString())}})
            }).then(async(createdCart:any)=>{
                return await prisma.cartItem.create({data:{cartId:createdCart.id , id:generateUniqueId(userId) , productId , quantity , price}})
            })  
        }
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const cartItemsLength = async(cartId:string)=>{
    try{
        const cartItems = await prisma.cartItem.count({where:{cartId}})
        return cartItems
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const cartItems = async(cartId:string)=>{
    try{
        return await prisma.cartItem.findMany({where:{cartId} ,orderBy:{
            product:{
                name:"asc"
            }
        }, include:{
            product:{
                include:{
                    images:true
                }
            }
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const filter_search = async (q: string, categories: string[], minPrice: number, maxPrice: number, page: number) => {
    let categoryCondition: any[] = [];
if (categories.length > 0) {
    categoryCondition = [{
        categories: {
            some: {
                category: {
                    name: {
                        in: categories,
                    },
                },
            },
        },
    }];
}

    try {
        return await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: 'insensitive',
                        },
                    },
                    {
                        preview: {
                            content: {
                                contains: q,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
                AND: [
                    {
                        price: {
                            gte: minPrice,
                        },
                    },
                    {
                        price: {
                            lte: maxPrice,
                        },
                    },
                    ...categoryCondition,
                ],
            },
            include: {
                colors: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                preview: true,
                images: true,
                details: true
            },
            take: 30,
            skip: page * 30,
        });
    } catch (err: any) {
        console.log(err.message);
    } finally {
        await prisma.$disconnect();
    }
};

export const EditProduct = async(productId:string , updatingInfo:any)=>{
    try{
        const mainInfo =await prisma.product.update({where:{id:productId} , data:{name:updatingInfo.name  , price:updatingInfo.price ,discount:updatingInfo.discount , countInStock:updatingInfo.countInStock}}) ; 
        const description  =await prisma.productDescription.findFirst({where:{productId}})
        if(description){
            const updateDescription = await prisma.productDescription.update({where:{id:description.id} , data:{content :updatingInfo.description}})
        }else{
            const newDescription = await prisma.productDescription.create({data:{id:generateUniqueId(productId) , productId:productId ,content:updatingInfo.description }})
        }
        const preview = await prisma.productPreview.findFirst({where:{productId}})
        if(preview){
            const updatePreview = await prisma.productPreview.update({where:{id:preview.id} , data:{content:updatingInfo.preview}})
        }else{
            const newPreview = await prisma.productPreview.create({data:{id:generateUniqueId(productId) ,productId , content:updatingInfo.preveiw}})
        }
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }   
}
export const FindProductImage = async(imageId:string)=>{
    try{
        return await prisma.productImage.findFirst({where:{id:imageId}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}
export const deleteProductImage = async(imageId:string)=>{
    try{
        return await prisma.productImage.delete({where:{id:imageId}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const Set_Favourite  = async(userId:string , productId:string)=>{
    try{
        return await prisma.favourites.create({data:{userId , productId}})
    }catch(err:any){
        console.log(err.message)
    }
    finally{
        await prisma.$disconnect()
    }
}

export const Remove_Favourite = async(userId:string , productId:string)=>{
    try{
        const favouriteItem =  await prisma.favourites.findFirst({where:{userId , productId}}) ; 
        if(!favouriteItem){
            throw new Error("cannot find this item in favourites")
        }
        return await prisma.favourites.delete({where:{productId_userId:{productId , userId}}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const DeleteProduct = async(productId:string)=>{
    try{
        return await prisma.product.delete({where:{id:productId}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const productCustoms = async(productId:string)=>{
    try{
        return await prisma.productDetail.findMany({where:{productId}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const editCustoms = async (productId: string, newDetails: any[]) => {
    try {
    const customs = await prisma.productDetail.findMany({ where: { productId } });
    if (customs.length > 0) {
        await prisma.productDetail.deleteMany({ where: { productId } });
        for (let custom_string of newDetails) {
            const custom = JSON.parse(custom_string)
            const id = generateUniqueId(custom.name);
            const existingCustom = await prisma.productDetail.findFirst({
                where: { id },
            });
        if (existingCustom) {
            throw new Error(`Custom detail with ID ${id} already exists`);
        }
        await prisma.productDetail.create({
            data: { id, name: custom.name, value: custom.value, productId },
        });
        }
    } else {
        for (let custom_string of newDetails) {
            const custom = JSON.parse(custom_string)
            const id = generateUniqueId(custom.name);
            const existingCustom = await prisma.productDetail.findFirst({
                where: { id },
            });
        if (existingCustom) {
            throw new Error(`Custom detail with ID ${id} already exists`);
        }
        await prisma.productDetail.create({
            data: { id, name: custom.name, value: custom.value, productId },
        });
        }
    }
    } catch (err: any) {
    console.log(err.message);
    } finally {
    await prisma.$disconnect();
    }
};

export const category_suggested = async (categoryId: string) => {
        try {
        const category = await prisma.category.findFirst({
            where: {
            id: categoryId
            }
        });
    
        if (!category) {
        throw new Error("Cannot find category");
        }
    
        // Check if a record with the same categoryId already exists in the SuggestedCategories table
        const existingSuggestion = await prisma.suggestedCategories.findFirst({
            where: {
            categoryId: category.id
            }
        });
    
        if (existingSuggestion) {
            throw new Error("Suggestion already exists for this category");
        }
    
        return await prisma.suggestedCategories.create({
            data: {
            categoryId: category.id
            }
        });
        } catch (err: any) {
        console.log(err.message);
        } finally {
        await prisma.$disconnect();
        }
    };

export const remove_suggested = async(categoryId:string)=>{
    try{
        return await prisma.suggestedCategories.delete({where:{
            categoryId
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const createCarousel = async(products:[] , title:string)=>{
    try{
        const swiper = await prisma.productsSwiper.create({
            data:{
                title , 
                id:generateUniqueId("carousel")
            }
            
        })
        if(!swiper){
            throw new Error("an error occured while creating carousel")
        }
        for(let id of products){
            await prisma.productOnSwiper.create({data:{
                productSwiperId:swiper.id , 
                productId:id
            }})
        }
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const Carousels = async()=>{
    try{
        return await prisma.productsSwiper.findMany({
            include:{
                products:{
                    include:{
                        products:{
                            include:{
                                images:true
                            }
                        }
                    }
                }
            }
        })
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}


export const findSuggested = async()=>{
    try{
        return await prisma.suggestedCategories.findMany({
            include:{
                category:{
                    include:{
                        image:true
                    }
                }
            }
        })
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const allproducts = async()=>{
    try{
        return await prisma.product.findMany({
            include:{
                images:true
            }
        })
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const findNewProducts =async()=>{
    try{
        return await prisma.tag.findMany({where:{
            OR:[
                {
                    name:{
                        contains:'new' , 
                        mode:'insensitive'
                    }
                    
                } , 
                
            ]
        } , include:{
            product:{
                include:{
                    product:{
                        include:{
                            images:true ,
                            preview:true,
                        }
                    }
                }
            }
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}