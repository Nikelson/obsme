import React, { useEffect, useRef, useState } from 'react';
import MainButton from '../shared/components/MainButton';

import * as images from '../assets/images';
import FormClientLegalInfo from '../forms/FormClientLegalInfo';

const Step7Legal = ({ onChange, setCachedData, cachedData, goToPrevStep, }) => {
    const [isLoading, setIsLoading] = useState(false);

    const nodes = {
        clientForm: useRef(null)
    }

    useEffect(() => {
        const form = nodes.clientForm.current;
        if (cachedData.clientInfo) {
            form.fillForm(cachedData.clientInfo)
        }
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        const form = nodes.clientForm.current;

        if (!form.isValid()) {
            return;
        }
        setIsLoading(true);

        setCachedData(state => {
            return {
                ...state,
                clientInfo: form.getData(),
            }
        }, newState => {
            onChange();
        })
    }

    const handleBack = () => {
        const form = nodes.clientForm.current;

        setCachedData(state => {
            return {
                ...state,
                clientInfo: form.getData(),
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
                <h2 className="title text-left">
                    <img src={images.IconBankColored} className="icon-left" />
                    დამატებითი ინფორმაცია
                </h2>
            </div>

            <div className="card-content text-center">
                <FormClientLegalInfo
                    ref={nodes.clientForm}
                    id="client-form"
                    collections={cachedData.collections}
                    onSubmit={handleSubmit}
                />
                <div className="buttons text-center">
                    <MainButton
                        isLoading={isLoading}
                        form="client-form"
                        type="submit">
                        შემდეგი
                    </MainButton>
                </div>
            </div>
        </section>
    )
}

export default Step7Legal;