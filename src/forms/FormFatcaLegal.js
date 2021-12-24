import React, { useEffect } from 'react';
import VtbForm, { FormInput, FormSelect, FormValidationMessage, } from './../hoc/VtbForms';
import RadioButton from '../shared/components/RadioButton';
import CheckButton from '../shared/components/CheckButton';

const FormValues = {
    politicallyActive: null,
    usTaxPayer: null,
    dualCitizenship: null,
    dualCitizenshipCountry: null,
    email: null,
    isGambling: null,
}

const FormValidations = {
    politicallyActive: {
        required: true,
        notEqual: {
            option: 1,
            message: "მსგავსი მონაცემით რეგისტრაცია შეუძლებელია, მიმართეთ ბანკს",
        },
        type: "number",
    },
    usTaxPayer: {
        required: true,
        notEqual: {
            option: 1,
            message: "მსგავსი მონაცემით რეგისტრაცია შეუძლებელია, მიმართეთ ბანკს",
        },
        type: "number",
    },
    dualCitizenship: {
        required: true,
        type: "number",
    },
    dualCitizenshipCountry: {
        required: false,
    },
    email: {
        required: true,
        email: true,
    },
    isGambling: {
        required: true,
        notEqual: {
            option: 1,
            message: "მსგავსი მონაცემით რეგისტრაცია შეუძლებელია, მიმართეთ ბანკს",
        },
        type: "number",
    },
}

const FormFatca = ({ onSubmit, form, id, collections }) => {
    useEffect(() => {
        if (form.state.dualCitizenship.value == 1) {
            form.setValidation("dualCitizenshipCountry", { required: true, });
        } else {
            form.setValidation("dualCitizenshipCountry", { required: false, });
        }
    }, [form.state.dualCitizenship.value]);

    const isRadioChecked = (name, value) => {
        const formValue = form.state[name].value;
        if (formValue === "") {
            return false;
        } else {
            return formValue == value;
        }
    }

    return (
        <form id={id} className="form" onSubmit={onSubmit} style={{ maxWidth: "450px" }}>

            <div className="row radios-right">
                <div className="col checkbox-label">
                    <span className="label-outer">
                        1. გაქვს თუ არა ორმაგი მოქალაქეობა
                    </span>
                </div>
                <div className="col radio-cols">
                    <div className="row">
                        <div className="col">
                            <RadioButton checked={isRadioChecked("dualCitizenship", 1)} value="1" onChange={form.updateInput} name="dualCitizenship">კი</RadioButton>
                        </div>
                        <div className="col">
                            <RadioButton checked={isRadioChecked("dualCitizenship", 0)} value="0" onChange={form.updateInput} name="dualCitizenship">არა</RadioButton>
                        </div>
                    </div>
                </div>
                {!form.state.dualCitizenship.isValid &&
                    <div className="col validation">
                        <FormValidationMessage isValid={false} for={form.state.dualCitizenship} />
                    </div>
                }
            </div>
            {form.state.dualCitizenship.value == 1 &&
                <div className="row" style={{ marginBottom: "25px" }}>
                    <div className="col">
                        <FormSelect
                            name="dualCitizenshipCountry"
                            form={form}
                            label="აირჩიეთ ორმაგი მოქალაქეობის ქვეყანა"
                            options={collections?.countries ? collections.countries.map((item, index) => {
                                return {
                                    name: item.text,
                                    id: item.value,
                                }
                            }) : []}
                        />
                    </div>
                </div>
            }
            <div className="row radios-right">
                <div className="col checkbox-label">
                    <span className="label-outer">
                        2. არის თუ არა ბენეფიციარი მესაკუთრე
                        პარტნიორი (წილის მესაკუთრე
                        ან/და მმართველი) ან
                        წარმომადგენლობაზე უფლებამოსილი
                        პირი პოლიტიკურად აქტიური პირი,
                        ან პოლიტიკურად აქტიური პირის ოჯახის
                        წევრი (მეუღლე, და, ძმა, მშობელი,
                        შვილი/გერი და მისი მეუღლე) ან
                        ფიზიკური პირი, რომელსაც
                        პოლიტიკურად აქტიურ პირთან აქვს
                        მჭიდრო საქმიანი ურთიერთობა?
                    </span>
                </div>
                <div className="col radio-cols">
                    <div className="row">
                        <div className="col">
                            <RadioButton checked={isRadioChecked("politicallyActive", 1)} value="1" onChange={form.updateInput} name="politicallyActive">კი</RadioButton>
                        </div>
                        <div className="col">
                            <RadioButton checked={isRadioChecked("politicallyActive", 0)} value="0" onChange={form.updateInput} name="politicallyActive">არა</RadioButton>
                        </div>
                    </div>
                </div>
                {!form.state.politicallyActive.isValid &&
                    <div className="col validation">
                        <FormValidationMessage isValid={false} for={form.state.politicallyActive} />
                    </div>
                }
            </div>


            <div className="row radios-right">
                <div className="col checkbox-label">
                    <span className="label-outer">
                        3. წარმოადგენენ თუ არა ორგანიზაციის
                        მაკონტროლებელ პირებს აშშ-ს
                        საგადასახადო რეზიდენტი ფიზიკური
                        პირები, რომლებიც პირდაპირ ან ირიბად
                        ფლობენ წილს.
                    </span>
                </div>
                <div className="col radio-cols">
                    <div className="row">
                        <div className="col">
                            <RadioButton checked={isRadioChecked("usTaxPayer", 1)} value="1" onChange={form.updateInput} name="usTaxPayer">კი</RadioButton>
                        </div>
                        <div className="col">
                            <RadioButton checked={isRadioChecked("usTaxPayer", 0)} value="0" onChange={form.updateInput} name="usTaxPayer">არა</RadioButton>
                        </div>
                    </div>
                </div>
                {!form.state.usTaxPayer.isValid &&
                    <div className="col validation">
                        <FormValidationMessage isValid={false} for={form.state.usTaxPayer} />
                    </div>
                }
            </div>
            <div className="row radios-right">
                <div className="col checkbox-label">
                    <span className="label-outer">
                        4. არის თუ არა საქმიანობის სფერო დაკავშირებული კრიპტო აქტივებთან, ფორექსთან, აზარტულ თამაშობებთან, თავისუფალ ინდუსტრიულ ზონებთან, სადაზღვევო და საინვესტიციო საქმიანობასთან
                    </span>
                </div>
                <div className="col radio-cols">
                    <div className="row">
                        <div className="col">
                            <RadioButton checked={isRadioChecked("isGambling", 1)} value="1" onChange={form.updateInput} name="isGambling">კი</RadioButton>
                        </div>
                        <div className="col">
                            <RadioButton checked={isRadioChecked("isGambling", 0)} value="0" onChange={form.updateInput} name="isGambling">არა</RadioButton>
                        </div>
                    </div>
                </div>
                {!form.state.isGambling.isValid &&
                    <div className="col validation">
                        <FormValidationMessage isValid={false} for={form.state.isGambling} />
                    </div>
                }
            </div>
            <div className="row">
                <div className="col">
                    <FormInput
                        floatLabel={false}
                        name="email"
                        form={form}
                        label="5. მიუთითე ელ. ფოსტის მისამართი"
                    />
                </div>
            </div>
        </form>
    )
}

export default VtbForm(FormFatca, FormValues, FormValidations);