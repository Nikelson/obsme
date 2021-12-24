import React, { useEffect, useState } from 'react';

import * as images from './assets/images';
import server from './server';
import useStateCallback from './hooks/useStateCallback';

import ReactNotification from 'react-notifications-component';

import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import Step6Legal from './steps/Step6Legal';
import Step7 from './steps/Step7';
import Step7Legal from './steps/Step7Legal';
import Step8 from './steps/Step8';
import Step9 from './steps/Step9';
import StepLast from './steps/StepLast';
import StepError from './steps/StepError';

import { ClientTypeEnum } from './enums';
import config from './config';
import collections from './collections';

const App = () => {
  const [step, setStep] = useState(1);
  const [cachedData, setCachedData] = useStateCallback({
    requestId: null,
    client: null,
    currencyInfo: null,
    card: null,
    collections: {
      ...collections,
    }
  });

  useEffect(() => {

    getCollections()

    if (!window.imageCache) {
      window.imageCache = [];
      Object.keys(images).forEach(image => {
        const img = new Image().src = images[image];
        window.imageCache.push(img)
      })
    }

    console.log("Environment:", config.env)

  }, []);

  useEffect(() => {
    console.log("CTX:", cachedData)
  }, [cachedData]);

  const getCollections = () => {
    server.Cities_Get().then(response => {
      if (response.isSuccess) {
        setCachedData(state => ({
          ...state,
          collections: {
            ...state.collections,
            cities: response.data.cities.sort((a, b) => a.value == "თბილისი" ? -1 : b.value == "თბილისი" ? 1 : 0),
          }
        }))
      }
    })
    server.Countries_Get().then(response => {
      if (response.isSuccess) {
        setCachedData(state => ({
          ...state,
          collections: {
            ...state.collections,
            countries: response.data.countries,
          }
        }))
      }
    })
    server.DeliveryAddresses_Get().then(response => {
      if (response.isSuccess) {
        setCachedData(state => ({
          ...state,
          collections: {
            ...state.collections,
            addresses: response.data,
          }
        }))
      }
    })
  }

  const goToStep = step => {
    scrollToTop();
    setStep(state => step);
  }

  const goToNextStep = () => {
    scrollToTop();
    setStep(state => state + 1);
  }

  const goToPrevStep = () => {
    scrollToTop();
    setStep(state => state - 1);
  }

  const goToError = () => {
    scrollToTop();
    setStep(state => -1);
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      {/* <Landscape /> */}
      <ReactNotification isMobile />
      <main>
        <header className="header row align-middle">
          <div className="col">
            <img className="logo" src={images.VtbLogo} />
          </div>
        </header>

        {step == 1 && <Step1 goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />}
        {step == 2 && <Step2 goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />}
        {step == 3 && <Step3 goToPrevStep={goToPrevStep} goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} onChange={() => goToNextStep()} />}
        {step == 4 && <Step4 goToPrevStep={goToPrevStep} goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} onChange={() => goToNextStep()} goToError={goToError} />}
        {step == 5 && <Step5 goToPrevStep={goToPrevStep} goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} onChange={() => goToNextStep()} />}
        {step == 6 && (cachedData?.client?.organizationType == ClientTypeEnum.SOLE_PROPRIETOR ?
          <Step6 goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />
          :
          <Step6Legal goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />
        )}
        {step == 7 && (cachedData?.client?.organizationType == ClientTypeEnum.SOLE_PROPRIETOR ?
          <Step7 goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />
          :
          <Step7Legal goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />
        )}
        {step == 8 && <Step8 goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />}
        {step == 9 && <Step9 goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} goToPrevStep={goToPrevStep} onChange={() => goToNextStep()} />}
        {step == 10 && <StepLast />}
        {step == -1 && <StepError goToStep={goToStep} cachedData={cachedData} setCachedData={setCachedData} />}
      </main>
    </>
  );
}

export default App;
