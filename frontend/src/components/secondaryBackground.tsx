import "./styles/secondary.css"
const SecondaryBackground = ()=>{
    return (
        <div className="secondary-bg">
            <div className="know-container">
                <button className="know-btn">
                    <span>
                        Know More
                    </span>
                    <svg className="arrow-btn" viewBox="0 0 20 20">
                        <path fill="#000" d="M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0
                        l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109
                        c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483
                        c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788
                        S1.293,9.212,1.729,9.212z"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default SecondaryBackground