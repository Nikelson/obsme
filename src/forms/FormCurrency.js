import { ForeignCurrencyEnum } from '../enums';
import VtbForm, { FormValidationMessage } from '../hoc/VtbForms';
import CheckButton from '../shared/components/CheckButton';

const FormValues = {
    selectedCurrencies: "",
    termsAndConditions: false,
}

const FormValidations = {
    termsAndConditions: { required: true, },
}

const FormCurrency = ({ onSubmit, form, id, collections }) => {

    const handleCurrencySelection = e => {
        const isChecked = e.target.checked;
        const value = e.target.value;
        const name = e.target.name;
        const selection = form.state.selectedCurrencies.value;

        let selectionAsArray = selection.length ? selection.split(",") : [];

        if (isChecked) {
            selectionAsArray.push(value)
        } else {
            selectionAsArray = selectionAsArray.filter(x => x != value);
        }

        form.setValue(name, selectionAsArray.join(","));
    }

    const isCurrencyChecked = value => {
        const selection = form.state.selectedCurrencies.value;
        if (!selection.length) {
            return false;
        }
        return selection.indexOf(value) != -1;
    }

    return (
        <>
            <form
                id={id}
                className="form"
                onSubmit={onSubmit}
                style={{ maxWidth: "510px", margin: "auto", }}
            >
                <div className="row">
                    <div className="col text-center">
                        დამატებით ისარგებლე მიმდინარე ანგარიშით უცხოურ ვალუტაში
                    </div>
                </div>
                
                <div className="row currencies-grid">
                    {Object.keys(ForeignCurrencyEnum).map(currency => {
                        return <div key={currency} className="col">
                            <CheckButton
                                value={currency}
                                name="selectedCurrencies"
                                checked={isCurrencyChecked(currency)}
                                onChange={handleCurrencySelection}>
                                {currency}
                            </CheckButton>
                        </div>
                    })}
                </div>

                <div className="row">
                    <div className="col text-center paragraph">
                        <div style={{ marginBottom: "5px" }}>
                            გაცნობებ, რომ სავალუტო ანგარიშზე არ იქნება დაშვებული
                            გადარიცხვა მაღალი რისკის იურისდიქციაში/ოფშორულ ზონაში
                            და ანგარიშზე ჩარიცხვა მაღალი რისკის
                            იურისდიქციიდან/ოფშორული ზონიდან; აღნიშნული შეზღუდვის
                            მოსახსნელად გთხოვ მიბრძანდე ნებისმიერ გაყიდვის წერტილში;
                            მაღალი რისკის იურისდიქციის/ოფშორული ზონების ჩამონათვალის
                            სანახავად გადადი ბმულზე
                        </div>
                        <a href="https://vtb.ge/ge/business/remote-banking/7/biznesis-onlain-registratsia/24/biznesis-onlain-registratsia" target="_blank">
                            www.vtb.ge
                        </a>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-left">
                        <CheckButton
                            id="terms-checkbox"
                            onChange={form.updateInput}
                            name="termsAndConditions"
                            checked={form.state.termsAndConditions.value}
                        >
                            გავეცანი და ვეთანხმები{" "}
                            <a href="https://vtb.ge/file/get/8641/uGcab-yrW0eUSk-QACLwRg?f=%e1%83%9b%e1%83%98%e1%83%9b%e1%83%93%e1%83%98%e1%83%9c%e1%83%90%e1%83%a0%e1%83%94+%e1%83%90%e1%83%9c%e1%83%92%e1%83%90%e1%83%a0%e1%83%98%e1%83%a8%e1%83%98%e1%83%97+%e1%83%9b%e1%83%9d%e1%83%9b%e1%83%a1%e1%83%90%e1%83%ae%e1%83%a3%e1%83%a0%e1%83%94%e1%83%91%e1%83%98%e1%83%a1+%e1%83%9e%e1%83%98%e1%83%a0%e1%83%9d%e1%83%91%e1%83%94%e1%83%91%e1%83%98.pdf" target="_blank">
                                საბანკო ანგარიშით მომსახურებისა და დისტანციურად რეგისტრაციის პირობებს
                            </a>
                        </CheckButton>

                        <FormValidationMessage for={form.state.termsAndConditions} />
                    </div>
                </div>
            </form>
        </>
    )
}

export default VtbForm(FormCurrency, FormValues, FormValidations);