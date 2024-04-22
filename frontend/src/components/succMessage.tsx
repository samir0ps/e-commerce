import { FC  , useEffect , useState} from "react";

type messageProps = {
    succMessage : string | null ;
    setSuccMessage : (value:string | null) =>void
}
const SuccMessage : FC<messageProps> = ({succMessage , setSuccMessage})=>{
    const [isSticky, setIsSticky] = useState(false);

    useEffect(()=>{
        if(succMessage){
            setTimeout(()=>{
                setSuccMessage(null)
            } , 10000)
        }
    } , [succMessage])
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
        <div className={`${succMessage ? "err-message-appear" : "err-message-disappear"} ${isSticky && "sticky"} succ-message-container message-container`}>
            
            {succMessage}
            <span className={succMessage?"time-indicator-succ" : ""}></span>
        </div>
    )
}
export default SuccMessage