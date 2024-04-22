import { FC } from "react";
import "../App.css"
type SeeProps ={
    seeContent:boolean ; 
    setSeeContent : (value:boolean)=>void  ; 
    content : string |null;
}
const SeeInComplete : FC<SeeProps> = ({seeContent , setSeeContent , content})=>{
    return(
        <div className={`${seeContent ? "see-incomplete-container" : "dont-see-container"} complete-container`}>
            <div className={`${seeContent ? "see-incomplete" : "dont-see"} context-container`} >
                <div className="cross-icon-container" onClick={()=>{setSeeContent(false)}}><svg className="cross-icon" viewBox="0 0 20 20">
                                <path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                            </svg></div>
                <h1>Preview Content</h1>
                <p className="content-text">
                    {content}
                </p>
            </div>
            <div className="see-content-background" onClick={()=>{setSeeContent(false)}}></div>
        </div>
    )
}
export default SeeInComplete