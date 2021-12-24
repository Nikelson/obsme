import React, { useEffect, useRef, useState } from 'react';
import MainButton from '../shared/components/MainButton';

import * as images from '../assets/images';
import FormCurrency from '../forms/FormCurrency';

const Step7 = ({ onChange, setCachedData, cachedData, goToPrevStep, }) => {
    const [isLoading, setIsLoading] = useState(false);

    const nodes = {
        currencyForm: useRef(null)
    }

    useEffect(() => {
        const form = nodes.currencyForm.current;
        if (cachedData.currencyInfo) {
            form.fillForm(cachedData.currencyInfo)
        }
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        const form = nodes.currencyForm.current;

        if (!form.isValid()) {
            return;
        }
        setIsLoading(true);

        setCachedData(state => {
            return {
                ...state,
                currencyInfo: form.getData(),
            }
        }, newState => {
            onChange();
        })
    }

    const handleBack = () => {
        const form = nodes.currencyForm.current;

        setCachedData(state => {
            return {
                ...state,
                currencyInfo: form.getData(),
            }
        }, newState => goToPrevStep())
    }

    return (
        <section className="card">

            <div className="card-top-nav row">
                <div className="col back text-center">
                    <span onClick={handleBack} className="back-btn">უკან</span>
                </div>
            </div>

            <div className="card-header text-center">
                <h2 className="title">
                    <span className="text-wrapper" style={{ maxWidth: "500px" }}>
                        რეგისტრაციის დასრულებისთანავე
                        გაიხსნება მიმდინარე ანგარიში
                        ლარში და გააქტიურდება SMS სერვისი
                    </span>
                </h2>
            </div>

            <div className="text-center">
                <div className="icon-item">
                    <img src={images.Wallet} />
                </div>
            </div>


            <div className="card-content text-center" style={{ paddingBottom: "10px" }}>
                <FormCurrency
                    ref={nodes.currencyForm}
                    id="currency-form"
                    collections={cachedData.collections}
                    onSubmit={handleSubmit}
                />
            </div>

            <div className="buttons text-center">
                <MainButton
                    isLoading={isLoading}
                    form="currency-form"
                    type="submit">
                    შემდეგი
                </MainButton>
            </div>
        </section>
    )
}

export default Step7;