import React, { useEffect, useRef, useState } from 'react';

import * as images from '../assets/images';
import StepBreads from '../shared/components/StepBreads';
import server from '../server';
import notify from '../notifications';

const KvalifikaStepsEnum = Object.freeze({
    LIVENESS: 2,
    DOCUMENT: 3,
})

const Step5 = ({ onChange, setCachedData, cachedData, goToError, goToStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [kvalifikaUrl, setKvalifikaUrl] = useState(null);
    const [showIframe, setShowIframe] = useState(false);
    const [kvalifikaStep, setKvalifikaStep] = useState(null);

    const nodes = {
        frame: useRef(null),
    }

    useEffect(() => {
        onChange();
        // generateKvalifikaUrl();
    }, []);

    useEffect(() => {
        window.addEventListener('message', messageEventHandler);
        setCachedData(state => ({
            ...state,
            stepError: {
                genericError: ""
            }
        }));

        return () => {
            window.removeEventListener('message', messageEventHandler);
        }
    }, []);

    const getClassname = () => {
        const classnames = ["card-content", "frame", "text-center"];

        if (kvalifikaStep == KvalifikaStepsEnum.LIVENESS) {
            classnames.push("liveness")
        }
        if (kvalifikaStep == KvalifikaStepsEnum.DOCUMENT) {
            classnames.push("document")
        }

        return classnames.join(" ");
    }

    const check = async () => {
        setIsLoading(true);
        setKvalifikaUrl("");
        setShowIframe(false);

        const session = await server.GetSessionData_Get({
            query: { sessionId: window.sessionId }
        });

        setIsLoading(false);

        if (session.isSuccess && session.data?.faceMatched) {
            onChange();
        } else {
            notify.error({
                title: 'error',
                message: session.data ? JSON.stringify(session.data) : '',
            });
            if (session.data?.messageCode == 22) {
                setCachedData(state => ({
                    ...state,
                    stepError: {
                        genericError: session.data.message
                    }
                }), newState => {
                    goToError();
                });
            } else {
                goToError();
            }
        }
    }

    const messageEventHandler = async event => {
        if (event.data.source?.indexOf("react") != -1) {
            return;
        }

        console.log("kvalifika log:")
        console.log(event.data);


        let d = event.data;

        try {
            d = JSON.stringify(d);
        } catch (error) {

        }
        debugger;
        notify.info({
            title: "kvalifika says",
            message: d || ""
        })

        // Checks if full process liveness and document scanning has been finished
        if (event.data.finished) {
            debugger;
            check();
            return;
        }

        // Checks if liveness step has been finished
        if (event.data.isLivenessFinished) {
            setKvalifikaStep(KvalifikaStepsEnum.DOCUMENT);
            debugger;
            // Do something if liveness step has been finished
        }

        // Checks is document scanning step has been finsihed
        if (event.data.isDocumentFinished && event.data.finished == false) {
            debugger;
            // event.data.documentType returns enum type 'ID' or 'PASSPORT'
            check();
            return;
        }

        // Checkes is session session has been closed
        if (event.data.isClosed || event.data.isClose) {
            debugger;
            // check();
            return;
        }

        // checks if retry step has been closed
        if (event.data.isRetryClosed) {
            debugger;
        }

        // checks if retry step has been closed
        if (event.data.linkExpired && event.data.finished == false) {
            debugger;
            check();
        }
    }

    const generateKvalifikaUrl = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true);
        setKvalifikaUrl("");
        window.sessionId = "";

        server.GenerateKvalifikaUrl_Post({
            payload: {
                requestId: cachedData.requestId
            }
        }).then(response => {
            setIsLoading(false);

            if (response.isSuccess) {
                window.sessionId = response.data.sessionId;
                setCachedData(state => ({
                    ...state,
                    sessionId: response.data.sessionId,
                }), newState => {
                    setKvalifikaUrl(response.data.generatedUrl);
                });
            } else if (response.errors && response.errors.messageCode == 41) {
                setCachedData(state => ({
                    ...state,
                    stepOne: {
                        genericError: response.errors.message
                    }
                }), newState => {
                    goToStep(1);
                });
            }
        })
    }

    return (
        <section className="card">
            {(isLoading || !showIframe) &&
                <>
                    <div className="card-header text-center">
                        <h2 className="title">სახის იდენტიფიკაცია</h2>
                    </div>
                    <div className="card-content text-center">
                        <img className="icon" src={images.IconFaceId} />
                        <br />
                        <br />
                        <br />
                        <img src={images.DotsLoader} />

                        <div style={{ marginTop: '40px' }}>
                            მონაცემები მუშავდება
                        </div>

                    </div>
                </>
            }

            {kvalifikaUrl &&
                <div className={getClassname()}>
                    <div>
                        <iframe
                            ref={nodes.frame}
                            style={{
                                visibility: showIframe ? "visible" : "hidden",
                                position: showIframe ? "static" : "absolute",
                            }}
                            onLoad={e => {
                                setShowIframe(true);
                                setKvalifikaStep(KvalifikaStepsEnum.LIVENESS);
                            }}
                            allowFullScreen={true}
                            allow="camera"
                            scrolling="auto"
                            src={`${kvalifikaUrl}&lang=ge`}
                        />
                    </div>
                </div>
            }

        </section>
    )
}

export default Step5;