import { FC } from "react"
type DescriptionType = {
    description :{
        content : string
    }[]  | null; 
    tab:string
}
const Description:FC<DescriptionType> = ({description , tab})=>{
    return (
        <div className={`${tab === "Description"?"enabled" : "disabled"} description-container`}>
            {description ? <div className="description-body"  dangerouslySetInnerHTML={{__html:description[0].content}}>
            </div>: null}
        </div>
    )
}

export default Description