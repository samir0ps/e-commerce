import { useState, useRef } from "react";
import "../App.css";
import { BsChevronDown } from "react-icons/bs";

const Menu = ({ quantity, setQuantity, fn }: { quantity: number; setQuantity: (value: number) => void; fn: () => void }) => {
const [dropOpen, setDropOpen] = useState<boolean>(false);
const dropdownRef = useRef<HTMLDivElement>(null);

const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    setDropOpen(false);
    }
};

const handleClick = () => {
    setDropOpen(!dropOpen);
};

document.addEventListener("click", handleOutsideClick);

return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
    <div className="select-quant" onClick={handleClick}>
        <p className="quantity">{quantity}</p>
        <div className={`${dropOpen && "chevron-up"} chevron-down`}>
            <BsChevronDown></BsChevronDown>
        </div>
        <div>
        <div className={`${dropOpen && "options-open"} options-quant`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
            <div className="option-quant" key={index} onClick={() => { setQuantity(index + 1); fn(); }}>
                {index + 1}
            </div>
            ))}
        </div>
        </div>
    </div>
    </div>
);
};

export default Menu;