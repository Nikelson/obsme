import React from 'react';
import MainButton from '../shared/components/MainButton';

import * as images from '../assets/images';

const StepLast = ({ onChange, goToPrevStep }) => {
    return (
        <section className="card">
            <div className="card-header text-center">
                <div className="upper-title green">
                    მადლობა განაცხადი მიღებულია
                </div>
            </div>

            <div className="card-content text-center">
                <div className="thumb-holder">
                    <img src={images.IconSmsSent} />
                </div>

                <div className="upper-title">
                    <span className="text-wrapper">
                        ინფორმაციას რეგისტრაციის შესახებ
                        და საბანკო რეკვიზიტებს SMS შეტყობინებით მიიღებთ
                    </span>
                </div>

                <div className="buttons text-center">
                    <MainButton
                        onClick={() => {
                            window.location.reload()
                        }}
                        form="client-form"
                        type="submit">
                        დასრულება
                    </MainButton>
                </div>
            </div>
        </section>
    )
}

export default StepLast;