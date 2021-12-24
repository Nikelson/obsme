import React, { useEffect, useRef, useState } from 'react';
import MainButton from '../shared/components/MainButton';

import * as images from '../assets/images';
import FormCard from '../forms/FormCard';
import server from '../server';
import { FormValidationMessage } from '../hoc/VtbForms';
import notify from '../notifications';
import { ExpectedOperationTypeEnum, ForeignCurrencyEnum, OtherBankEnum, PurposeTypeEnum } from '../enums';

const Step9 = ({ onChange, goToPrevStep, setCachedData, cachedData, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [genericError, setGenericError] = useState("");

    const nodes = {
        cardForm: useRef(null)
    }

    useEffect(() => {
        const form = nodes.cardForm.current;
        if (cachedData.clientInfo && cachedData.clientInfo.city == "თბილისი" && !cachedData?.card?.city) {
            !cachedData.card && (cachedData.card = {});
            cachedData.card.city = 1;
            cachedData.card.branchId = -1;
            cachedData.card.address = cachedData.clientInfo.factualAddress;
        }
        cachedData.card && form.fillForm(cachedData.card)
    }, []);

    const mapPayload = (newState) => {
        const mappedData = {
            requestId: newState.requestId,

            clientSubTypeId: newState.clientInfo?.fieldOfActivity,
            organizationType: newState.client.organizationType,
            factCity: newState.clientInfo?.city,
            factAddress: newState.clientInfo?.factualAddress,
            classificator: newState.clientInfo?.anualTurnover,
            revenue: newState.clientInfo?.income,
            work_Sphere: newState.clientInfo?.organisationActivity,
            employee_Count: newState.clientInfo?.numberOfEmployees,
            accounts_In_Other_Banks: newState.clientInfo?.accountInAnotherBankText,
            
            // რომელი ველი უნდა დავაერთოთ?
            hasGreenCard: newState.fatca?.usGreenCard,
            doubleCitizenship: newState.fatca?.dualCitizenship,
            doubleCitizenshipCountryCode: newState.fatca?.dualCitizenshipCountry,
            email: newState.fatca?.email,
            isFatca: newState.fatca?.usTaxPayer,
            isPoliticalActive: newState.fatca?.politicallyActive,

            deliveryAddressId: newState.card?.branchId != -1 ? newState.card?.branchId : "",
            deliveryAddress: newState.card?.address,
            allowHrmAccess: newState.card?.gambling,
            accountType: newState.card?.accountType,

            //ფაქტიური და იურიდიული მისამართი რომ ერთია, სად უნდა იყოს ეგ
        };

        //set currencies as booleans
        Object.values(ForeignCurrencyEnum).forEach(key => {
            const selectedCur = newState.currencyInfo?.selectedCurrencies || "";
            mappedData[key] = selectedCur.split(",").some(c => c.toLowerCase() === key);
        });

        //set accountPurposes as bools
        Object.keys(PurposeTypeEnum).forEach(key => {
            mappedData[key] = key == newState.clientInfo?.accountPurpose;
        });

        //set expectedOperations as bools
        Object.keys(ExpectedOperationTypeEnum).forEach(key => {
            mappedData[key] = key == newState.clientInfo?.expectedOperations;
        });

        //set accountInAnotherBank as bools
        Object.keys(OtherBankEnum).forEach(key => {
            mappedData[key] = key == newState.clientInfo?.accountInAnotherBank;
        });

        return mappedData;
    }

    const handleSubmit = e => {
        e.preventDefault();
        const form = nodes.cardForm.current;
        if (!form.isValid()) {
            return;
        }

        setIsLoading(true);
        setCachedData(state => {
            return {
                ...state,
                card: form.getData(),
            }
        }, newState => {

            const payload = mapPayload(newState);

            server.RegisterClient_Post({
                payload,
            }).then(response => {
                setIsLoading(false);
                if (response.isSuccess) {
                    if (response.data.messageCode == 28) {
                        onChange();
                    } else {
                        setGenericError(response.data.text);
                        notify.error({
                            title: `Error: ${response.data.messageCode}`,
                            message: response.data.text
                        });
                    }
                } else if (response.status == 401) {
                    setGenericError("რეგისტრაციის დასასრულებლად საჭიროა იდენტიფიკაციის პროცესის გავლა.")
                } else {
                    setGenericError(response.errors.message || response.errors.ExceptionMessage || response.errors.text)
                }
            })
        })
    }

    const handleBack = () => {
        const form = nodes.cardForm.current;

        setCachedData(state => {
            return {
                ...state,
                card: form.getData(),
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
                <div className="upper-title">გსურს ისარგებლო ბიზნეს ბარათით</div>
                <div className="upper-title small">
                    პირობების სანახავად ეწვიე ბმულს<br />
                    <a href="https://vtb.ge/ge/business/remote-banking/7/biznesis-onlain-registratsia/24/biznesis-onlain-registratsia" target="_blank">ბიზნესი - ვითიბი ბანკი</a>
                </div>

            </div>

            <div className="card-content text-center">
                <FormCard
                    ref={nodes.cardForm}
                    id="client-form"
                    onSubmit={handleSubmit}
                    collections={cachedData.collections}
                />
                <FormValidationMessage isValid={!genericError} message={genericError} />

                <div className="buttons text-center">
                    <MainButton
                        isLoading={isLoading}
                        form="client-form"
                        type="submit">
                        დასრულება
                    </MainButton>
                </div>
            </div>
        </section>
    )
}

export default Step9;