import React, { useEffect, useRef, useState, } from 'react';
import VtbForm, { FormInput, FormSelect, FormValidationMessage } from './../hoc/VtbForms';
import RadioButton from '../shared/components/RadioButton';
import * as images from './../assets/images';
import CheckButton from '../shared/components/CheckButton';
import util from '../utils';
import { AccountTypeEnum } from '../enums';

const FormValues = {
    city: null,
    branchId: null,
    address: null,
    gambling: 0,
    termsAndConditions: 0,
    accountType: AccountTypeEnum.STANDARD,
}

const FormValidations = {
    city: { required: false, },
    branchId: { required: false, type: "number", },
    gambling: { type: "number", },
    termsAndConditions: { type: "number", required: false, },
    accountType: { type: "number", required: true, },
}

const FormCard = ({ onSubmit, form, id, collections }) => {

    const [branches, setBranches] = useState([]);

    const nodes = {
        formWrapper: useRef(null),
    }

    useEffect(() => {
        let branchesByCity = [];
        let filteredBranch;

        if (collections && collections.addresses && form.state.city.value) {
            filteredBranch = collections.addresses.find(item => {
                return item.cityId == form.state.city.value;
            });

            if (filteredBranch.cityId == 1 && !filteredBranch.branches.some(item => item.branchId == -1)) {
                filteredBranch.branches = [
                    {
                        name: "მისამართის მითითება",
                        branchId: -1,
                    },
                    ...filteredBranch.branches,
                ]
            }

            branchesByCity = filteredBranch.branches.map(item => {
                return {
                    name: item.name,
                    id: item.branchId,
                }
            });

            if (branchesByCity.length == 1) {
                form.setValue("address", branchesByCity[0].name);
                form.setValue("branchId", branchesByCity[0].id);
            }
        }

        setBranches(branchesByCity);

    }, [form.state.city.value]);

    const isRadioChecked = (name, value) => {
        const formValue = form.state[name].value;
        if (formValue === "") {
            return false;
        } else {
            return formValue == value;
        }
    }

    const handleAccountTypeSelection = e => {
        form.updateInput(e, inputObj => {
            if (inputObj.value == AccountTypeEnum.CARD) {
                form.setValidation("city", { required: true, });
                form.setValidation("branchId", { required: true, type: "number", });
                // form.setValidation("gambling", {
                //     type: "number", required: true,
                //     notEqual: {
                //         option: 0,
                //         message: "გთხოვთ დაეთანხმოთ",
                //     },
                // });
                form.setValidation("termsAndConditions", {
                    type: "number", required: true,
                    notEqual: {
                        option: 0,
                        message: "გთხოვთ დაეთანხმოთ",
                    },
                });
            } else {
                form.setValidation("city", { required: false, });
                form.setValidation("branchId", { required: false, type: "number", });
                // form.setValidation("gambling", { type: "number", required: false, });
                form.setValidation("termsAndConditions", { type: "number", required: false, });
                // form.isValid();
            }
            console.log(inputObj)
        })
    }

    return (
        <form id={id} className="form" onSubmit={onSubmit} style={{ maxWidth: "470px" }}>

            <div className="card-holder text-center">
                <img src={images.DebitCard} />
                <div className="row">
                    <div className="col radio-cols center">
                        <div className="row">
                            <div className="col">
                                <RadioButton checked={isRadioChecked("accountType", AccountTypeEnum.CARD)} value={AccountTypeEnum.CARD} onChange={handleAccountTypeSelection} name="accountType">კი</RadioButton>
                            </div>
                            <div className="col">
                                <RadioButton checked={isRadioChecked("accountType", AccountTypeEnum.STANDARD)} value={AccountTypeEnum.STANDARD} onChange={handleAccountTypeSelection} name="accountType">არა</RadioButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div ref={nodes.formWrapper}
                onTransitionEnd={e => {
                    if (form.state.accountType.value == AccountTypeEnum.CARD) {
                        nodes.formWrapper.current.style.height = "auto";
                    } else {
                        form.isValid();
                    }
                }}
                className={`reveal${form.state.accountType.value == AccountTypeEnum.CARD ? " visible" : ""}`}
            // style={{ height: getHeight() }}
            >
                <div className="row">
                    <div className="col text-center upper-title">
                        მიუთითე მისამართი ბარათის მისაღებად
                    </div>
                </div>

                <div className="row split">
                    <div className="col">
                        <FormSelect
                            name="city"
                            form={form}
                            label="ქალაქი"
                            onChange={e => {
                                form.updateInput(e, () => {
                                    form.setValue("branchId", null)
                                })
                            }}
                            options={collections?.addresses ? collections.addresses.map(item => {
                                return {
                                    name: item.city,
                                    id: item.cityId,
                                }
                            }) : []}
                        />
                    </div>
                    <div className="col" style={{ position: "relative" }}>
                        <FormSelect
                            disabled={!form.state.city.value}
                            name="branchId"
                            form={form}
                            label={!form.state.city.value ? "აირჩიეთ ქალაქი" : "მისამართი"}
                            options={branches}
                            onChange={e => {
                                form.updateInput(e, (newObj) => {
                                    if (newObj.value == -1) {
                                        form.setValue("address", "");
                                        form.setValidation("address", { required: true, });
                                    } else {
                                        if (newObj.value) {
                                            const { target } = e;
                                            const selectedText = target[target.selectedIndex].innerText;
                                            form.setValue("address", selectedText);
                                        } else {
                                            form.setValue("address", "");
                                        }
                                        form.setValidation("address", { required: false, });
                                    }

                                })
                            }}
                        />
                        {form.state.branchId.value == -1 &&
                            <FormInput
                                autoFocus
                                containerStyle={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: '25px',
                                    background: 'white'
                                }}
                                name="address"
                                form={form}
                            />
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col text-left">
                        <CheckButton
                            onChange={form.updateInput}
                            name="gambling"
                            checked={form.state.gambling.value}
                        >
                            გსურს ახალი ბარათით გქონდეთ მაღალი რისკის მქონე სავაჭრო მომსახურების ობიექტებში (აზარტული თამაშები) გადახდის შესაძლებლობა?
                        </CheckButton>
                        <FormValidationMessage for={form.state.gambling} />
                    </div>
                </div>
                <div className="row">
                    <div className="col text-left">
                        <CheckButton
                            onChange={form.updateInput}
                            name="termsAndConditions"
                            checked={form.state.termsAndConditions.value}
                        >
                            გავეცანი და ვეთანხმები კომერციული (ბიზნეს) საგადახდო ბარათით{" "}
                            <a href="https://vtb.ge/file/get/8655/vPqEl_OjuUqp6EFBKqrZWQ?f=%e1%83%99%e1%83%9d%e1%83%9b%e1%83%94%e1%83%a0%e1%83%aa%e1%83%98%e1%83%a3%e1%83%9a%e1%83%98+(%e1%83%91%e1%83%98%e1%83%96%e1%83%9c%e1%83%94%e1%83%a1)+%e1%83%a1%e1%83%90%e1%83%92%e1%83%90%e1%83%93%e1%83%90%e1%83%ae%e1%83%93%e1%83%9d+%e1%83%91%e1%83%90%e1%83%a0%e1%83%90%e1%83%97%e1%83%98%e1%83%97+%e1%83%9b%e1%83%9d%e1%83%9b%e1%83%a1%e1%83%90%e1%83%ae%e1%83%a3%e1%83%a0%e1%83%94%e1%83%91%e1%83%98%e1%83%a1+%e1%83%9e%e1%83%98%e1%83%a0%e1%83%9d%e1%83%91%e1%83%94%e1%83%91%e1%83%98+_09.11.2021_%e1%83%93%e1%83%90%e1%83%9c.pdf" target="_blank">
                                მომსახურების პირობებს და ტარიფებს
                            </a>
                        </CheckButton>
                        <FormValidationMessage for={form.state.termsAndConditions} />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default VtbForm(FormCard, FormValues, FormValidations);