import { FC, useEffect ,useState } from "react"
import "../App.css"
type ErrorProps = {
    error : string | null ;
    setError : (value:string | null) =>void
}
const ErrorMessage : FC<ErrorProps> = ({error , setError})=>{
    useEffect(()=>{
        if(error){
            setTimeout(()=>{
                setError(null)
            } , 10000)
        }
    } , [error])
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) { 
            setIsSticky(true);
            } else {
            setIsSticky(false);
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        // Clean up the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className={`${error ? "err-message-appear" : "err-message-disappear"} ${isSticky && "sticky"} error-message-container message-container`}>
            
            {error}
            <span className={error?"time-indicator" : ""}></span>
        </div>
    )
}

export default ErrorMessage