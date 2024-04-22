import HomeCategories from "../components/HomeCategories"
import NewArrival from "../components/NewArrival"
import CreateCarousel from "../components/adminCarousel"
import MainBackground from "../components/homeMainBack"
import ProductCarousel from "../components/productCarousel"
import SecondaryBackground from "../components/secondaryBackground"
import "./styles/Home.css"
const Home = ()=>{
    return(
        <div className="home-container">
            <MainBackground/>
            <HomeCategories/>
            <NewArrival></NewArrival>
            <SecondaryBackground/>
            <CreateCarousel/>
            <ProductCarousel></ProductCarousel>
        </div>
    )
}

export default Home