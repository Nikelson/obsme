import React, { useEffect, useRef, useState } from 'react';
import * as images from './../../assets/images';
import util from './../../utils';

const Landscape = props => {
    // const [isLandscape, setIsLandscape] = useState(util.isLandscape);

    // const handleLandscapeState = e => setIsLandscape(util.isLandscape);

    // useEffect(() => {
    //     window.addEventListener("resize", handleLandscapeState);

    //     // window.screen?.orientation?.addEventListener('change', handleLandscapeState);

    //     return () => {
    //         window.removeEventListener("resize", handleLandscapeState);
    //         // window.screen?.or1ientation?.removeEventListener('change', handleLandscapeState);
    //     }
    // }, []);

    if (util.isMobile || util.isTablet)
        return <div className="screen-rotate">
            <img src={images.ScreenRotate} />
            <div>
                გთხოვთ ამოატრიალოთ ეკრანი. {util.isLandscape2}
            </div>
        </div>
    return null;
}

export default Landscape;