import VtbForm, { FormInput, FormSelect } from '../hoc/VtbForms';
import CheckButton from '../shared/components/CheckButton';
import { ExpectedOperationTypeEnum, OtherBankEnum, PurposeTypeEnum } from '../enums';

const FormValues = {
    city: null,
    factualAddress: null,
    isAddressesSame: false,
    anualTurnover: null,
    accountPurpose: null,
    expectedOperations: null,
    fieldOfActivity: null,
    organisationActivity: null,
    numberOfEmployees: null,
    accountInAnotherBank: null,
    accountInAnotherBankText: null,
}

const FormValidations = {
    city: { required: true, },
    factualAddress: { required: true, },
    anualTurnover: { required: true, },
    accountPurpose: { required: true, },
    expectedOperations: { required: true, },
    fieldOfActivity: { required: true, },
    organisationActivity: { required: true, },
    numberOfEmployees: { required: true, number: true, type: "number", },
    accountInAnotherBank: { required: true, },
    accountInAnotherBankText: { required: false, },
}

const FormClientLegalInfo = ({ onSubmit, form, id, collections }) => {

    const getCollection = (obj) => {
        const pairs = { ...obj };
        if (obj === OtherBankEnum) {
            pairs.other = "სხვა (მიუთითეთ ბანკი)";
        }
        const asArray = Object.keys(pairs).map((k) => ({
            id: k,
            name: pairs[k],
        }));
        return asArray;
    }

    return (
        <form id={id} className="form" onSubmit={onSubmit}>

            <div className="label-outer label-above">
                6. მიუთითე კომპანიის ფაქტიური მისამართი
            </div>
            <div className="row split">
                <div className="col">
                    <FormSelect
                        name="city"
                        form={form}
                        label="ქალაქი"
                        disabled={!collections?.cities}
                        options={collections?.cities ? collections.cities.map(item => {
                            return {
                                name: item.text,
                                id: item.value,
                            }
                        }) : []}
                    />
                </div>
                <div className="col">
                    <FormInput
                        name="factualAddress"
                        form={form}
                        label="ფაქტიური მისამართი"
                    />
                </div>
            </div>
            <div className="row split">
                <div className="col">
                    <CheckButton
                        onChange={form.updateInput}
                        name="isAddressesSame"
                        checked={form.state.isAddressesSame.value}
                    >
                        ფაქტიური მისამართი იდენტურია იურიდიული მისამართის
                    </CheckButton>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormSelect
                        name="anualTurnover"
                        form={form}
                        floatLabel={false}
                        label="7. მოსალოდნელი წლიური ბრუნვა"
                        disabled={!collections?.classificators}
                        options={collections?.classificators ? collections.classificators : []}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormSelect
                        name="accountPurpose"
                        form={form}
                        floatLabel={false}
                        label="8. ანგარიშის გახსნის მიზნობრიობა"
                        options={getCollection(PurposeTypeEnum)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormSelect
                        name="expectedOperations"
                        form={form}
                        floatLabel={false}
                        label="9. მოსალოდნელი ოპერაციები"
                        options={getCollection(ExpectedOperationTypeEnum)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormSelect
                        name="fieldOfActivity"
                        form={form}
                        floatLabel={false}
                        label="10. საქმიანობის სფერო"
                        disabled={!collections?.clientSubTypes}
                        options={collections?.clientSubTypes ? collections.clientSubTypes : []}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormInput
                        floatLabel={false}
                        name="organisationActivity"
                        form={form}
                        label="11. ორგანიზაციის ზუსტი საქმიანობა"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FormInput
                        floatLabel={false}
                        name="numberOfEmployees"
                        form={form}
                        type="number"
                        pattern="[0-9]*"
                        label="12. თანამშრომლების ზუსტი რაოდენობა"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col" style={{ position: "relative" }}>
                    <FormSelect
                        name="accountInAnotherBank"
                        form={form}
                        floatLabel={false}
                        label="13. ანგარიში სხვა ბანკში"
                        options={getCollection(OtherBankEnum)}
                        onChange={e => {
                            form.updateInput(e, (newObj) => {
                                form.setValue("accountInAnotherBankText", "");
                                if (newObj.value == "other") {
                                    form.setValidation("accountInAnotherBankText", { required: true, });
                                } else {
                                    form.setValidation("accountInAnotherBankText", { required: false, });
                                }

                            })
                        }}
                    />
                    {form.state.accountInAnotherBank.value == "other" &&
                        <FormInput
                            autoFocus
                            floatLabel={false}
                            label="13. ანგარიში სხვა ბანკში"
                            placeholder="მიუთითეთ სხვა ბანკი"
                            containerStyle={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: '25px',
                                background: 'white'
                            }}
                            name="accountInAnotherBankText"
                            form={form}
                        />
                    }
                </div>
            </div>
        </form>
    )
}

export default VtbForm(FormClientLegalInfo, FormValues, FormValidations);