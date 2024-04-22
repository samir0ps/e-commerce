import { FC } from "react"
import { MdClose } from "react-icons/md";
type confirmationsTypes = {
    message : string ; 
    openConfirmation: boolean ; 
    setOpenConfirmation: (value:boolean)=>void  ;
    handleFn:()=>void ; 
}

import "../App.css"
const Confirmation : FC<confirmationsTypes>=({message , openConfirmation , setOpenConfirmation , handleFn})=>{
    const handleClosing=()=>{
        setOpenConfirmation(false)
    }
    const handleConfirmClicking =()=>{
        handleFn()
        handleClosing()
    }
    const handleCanceling =()=>{
        handleClosing()
    }
    return(
        <div className={`${openConfirmation ? "open-confirmation" : 'close-confirmation'} confirmation-container`}>
            <div className={`${openConfirmation ? "open-conf-mssg" : "close-conf-mssg"} confirmation-message`}>
                <MdClose className="close-icon" onClick={handleClosing}/>
                <p>{message}</p>
                <div className="btns-container-confirmation">
                    <button className="confirm-btn" onClick={handleConfirmClicking}>Confirm</button>
                    <button className="cancel-btn" onClick={handleCanceling}>Cancel</button>
                </div>
            </div>
            <div className="confirmation-bg" onClick={handleClosing}></div>
        </div>
    )
}

export default Confirmation