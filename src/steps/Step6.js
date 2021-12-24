import React, { useEffect, useRef, useState } from 'react';
import MainButton from './../shared/components/MainButton';

import * as images from './../assets/images';
import FormFatca from './../forms/FormFatca';

const Step6 = ({ onChange, goToPrevStep, setCachedData, cachedData, }) => {
    const [isLoading, setIsLoading] = useState(false);

    const nodes = {
        fatcaForm: useRef(null)
    }

    useEffect(() => {
        const form = nodes.fatcaForm.current;
        if (cachedData.fatca) {
            form.fillForm(cachedData.fatca)
        }
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        const form = nodes.fatcaForm.current;

        if (!form.isValid()) {
            return;
        }
        setIsLoading(true);

        setCachedData(state => {
            return {
                ...state,
                fatca: form.getData(),
            }
        }, newState => {
            onChange();
        })
    }

    return (
        <section className="card">
            <div className="card-header text-center">
                <h2 className="title text-left">
                    <img src={images.IconBankColored} className="icon-left" />
                    დამატებითი ინფორმაცია
                </h2>
            </div>

            <div className="card-content text-center">
                <FormFatca
                    ref={nodes.fatcaForm}
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

export default Step6;