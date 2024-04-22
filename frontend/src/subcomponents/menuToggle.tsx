import { FC } from "react";
import "../App.css"
interface menuToggleProps {
    toggleUserMenu : boolean ; 
    setToggleUserMenu : (value:boolean)=>void
}
const MenuToggle:FC<menuToggleProps> = ({toggleUserMenu , setToggleUserMenu})=>{
    const handleChange = ()=>{
        setToggleUserMenu(!toggleUserMenu)
    }
    return (
        <div id="menuToggle">
        <input id="checkbox" type="checkbox" onChange={handleChange} />
        <label className="toggle" htmlFor="checkbox">
            <div className="bar bar--top"></div>
            <div className="bar bar--middle"></div>
            <div className="bar bar--bottom"></div>
        </label>
        </div>
    )
}
export default MenuToggle