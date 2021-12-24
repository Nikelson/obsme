import MainButton from '../shared/components/MainButton';

const Step1 = ({ onChange }) => {
    return (
        <section className="card">
            <div className="card-header text-center">
                <h2 className="title">
                    <span className="text-wrapper">კლიენტად რეგისტრაცია და პირველადი ანგარიშის გახსნა შეგიძლია თუ</span>
                </h2>
            </div>

            <div className="card-content text-center">
                <ul className="bullet-list">
                    <li>წარმოადგენ საქართველოს კანონმდებლობის შესაბამისად რეგისტრირებულ ინდ.მეწარმეს ან შპს-ს</li>
                    <li>ხარ საქართველოს მოქალაქე</li>
                    <li>საქმიანობის სფერო არ არის დაკავშირებული კრიპტო აქტივებთან, ფორექსთან, აზარტულ თამაშობებთან, თავისუფალ ინდუსტრიულ ზონებთან, სადაზღვევო და საინვესტიციო საქმიანობასთან</li>
                </ul>

                <div className="note-bold">
                    <div style={{ marginBottom: "5px" }}>
                        დაინტერესების შემთხვევაში დეტალურად გაეცანი ანგარიშით მომსახურების პირობებს
                    </div>
                    <a href="https://vtb.ge/ge/business/remote-banking/7/biznesis-onlain-registratsia/24/biznesis-onlain-registratsia" target="_blank">
                        www.vtb.ge
                    </a>
                </div>
            </div>

            <div className="buttons text-center">
                <MainButton onClick={onChange}>დაწყება</MainButton>
            </div>
        </section>
    )
}

export default Step1;