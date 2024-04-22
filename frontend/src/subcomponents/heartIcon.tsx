import { FormEvent, useState } from "react"
import "./heartIcon.css"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"

export default function HeartIcon (){
    
    const {id} = useParams()
    const addMutation = useMutation({
        mutationFn:async()=>{
            const response = await axios.post(`http://localhost:3000/api/product/add-favourite?productId=${id}`)
            return response.data
        },
        onSuccess:async()=>{
            queryClient.invalidateQueries({queryKey:["user"]})
        }
    })
    const removeMutation =useMutation({
        mutationFn:async()=>{
            const response = await axios.delete(`http://localhost:3000/api/product/remove-favourite?productId=${id}`)
            return response.data
        },
        onSuccess:async()=>{
            queryClient.invalidateQueries({queryKey:["user"]})
        }
    })
    const handleSettingFavourite = (e:FormEvent<HTMLInputElement>)=>{
        if(e.currentTarget.checked){
            setLabel("remove from favourites")
            addMutation.mutateAsync()
        }else{
            setLabel("add to favourites")
            removeMutation.mutateAsync()
        }
    }
    const queryClient = useQueryClient()
    const user :any = queryClient.getQueryData(["user"])
    const favourite_product = user && user?.user?.info ? user?.user.info.favourites.find((fav:any) => fav.productId === id) : false
    const [label ,setLabel] =useState(favourite_product ? "remove from favourites" :"add to favourites")
    return (
            <div >
                {user?.user?.info && <div  className="heart-container" >
                    <input onChange={handleSettingFavourite} checked={favourite_product?true : false} type="checkbox" className="checkbox" id="Give-It-An-Id"/>
                    <div className="svg-container">
                        <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                            </path>
                        </svg>
                        <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                            </path>
                        </svg>
                        <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="10,10 20,20"></polygon>
                            <polygon points="10,50 20,50"></polygon>
                            <polygon points="20,80 30,70"></polygon>
                            <polygon points="90,10 80,20"></polygon>
                            <polygon points="90,50 80,50"></polygon>
                            <polygon points="80,80 70,70"></polygon>
                        </svg>
                    </div>
                    <div className="like-tooltip">{label}</div>
                </div>}

            </div>
    )
}