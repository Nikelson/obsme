import { useEffect } from 'react';
import MainButton from '../shared/components/MainButton';
import * as images from './../assets/images';

const StepError = ({ goToStep, setCachedData, cachedData }) => {
    return <section className="card">
        <div className="card-header text-center">
            <h2 className="title">სახის იდენტიფიკაცია</h2>
        </div>
        <div className="card-content text-center">
            <img className="icon" src={images.IconError} />
            <br />
            <br />
            <br />
            <br />
            {
                cachedData?.stepError?.genericError ?
                    <div className="upper-title error">
                        {cachedData.stepError.genericError}
                    </div>
                    :
                    <>
                        <div className="upper-title error">
                            თქვენი მცდელობა წარუმატებელია.
                        </div>
                        <div className="upper-title error">
                            სცადეთ ხელახლა
                        </div>
                    </>
            }

            <div className="buttons text-center">
                <MainButton
                    onClick={() => {
                        goToStep(3);
                    }}
                    form="client-form"
                    type="submit">
                    თავიდან
                </MainButton>
            </div>
        </div>
    </section>
}

export default StepError;