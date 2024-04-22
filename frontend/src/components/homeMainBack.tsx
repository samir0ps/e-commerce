import { Suspense } from 'react';
import './styles/homeMain.css';
import bg_image from '../components/images/MainBackground.png';
import LoadingComponent from './Loading';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MainBackground = () => {
    

    return (
        <Suspense fallback={<div className='loading-suspense-container'><LoadingComponent/></div>}>
            <div className={`main-bg `}>
                <LazyLoadImage
                    effect='blur'
                    src={bg_image}
                    alt="main-image"
                />
                <h1 className={`welcoming-header`}>
                    Your Ultimate Destination for All Things Awesome
                </h1>
                <div className={`explore-btn-container `}>
                    <button className="explore-btn">
                        <span className="explore-btn-text">Start Shopping</span>
                    </button>
                </div>
            </div>
        </Suspense>
    );
};

export default MainBackground;
