import { SVGProps } from "react"
import "./cart.css"
const CartComponent = (props: SVGProps<SVGSVGElement>) => (
<svg
    className="cart-svg"
    xmlns="http://www.w3.org/2000/svg"
    width={"auto"}
    height={"auto"}
    viewBox="0 0 375 375"
    {...props}
>
    <defs>
    <clipPath id="a">
        <path d="M202.219 225.871h20.129V246h-20.13Zm0 0" />
    </clipPath>
    <clipPath id="b">
        <path d="M212.285 225.871c-5.558 0-10.066 4.504-10.066 10.063 0 5.558 4.508 10.066 10.066 10.066 5.559 0 10.063-4.508 10.063-10.066a10.06 10.06 0 0 0-10.063-10.063Zm0 0" />
    </clipPath>
    <clipPath id="c">
        <path d="M113.012 226.621h20.133v20.129h-20.133Zm0 0" />
    </clipPath>
    <clipPath id="d">
        <path d="M123.078 226.621c-5.558 0-10.066 4.504-10.066 10.063 0 5.558 4.508 10.066 10.066 10.066 5.559 0 10.067-4.508 10.067-10.066 0-5.559-4.508-10.063-10.067-10.063Zm0 0" />
    </clipPath>
    </defs>
    <path
    fill="none"
    stroke="#000"
    strokeWidth={5}
    d="m64.078 176.043 47.524 49.828"
    />
    
    <path
    fill="none"
    stroke="#000"
    strokeWidth={5}
    d="m111.68 225.125 117.988.746M64.082 176.04h120M229.668 225.867l49.875-74.488"
    />
    <path
    fill="none"
    stroke="#000"
    strokeWidth={10}
    d="M279.543 151.379h31.918"
    />
    
</svg>
)
export default CartComponent
