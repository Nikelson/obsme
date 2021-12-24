import MainButton from '../shared/components/MainButton';
import * as images from '../assets/images';

const Step = ({ onChange, goToPrevStep, }) => {

    return (
        <section className="card">

            <div className="card-top-nav row">
                <div className="col back text-center">
                    <span onClick={goToPrevStep} className="back-btn">უკან</span>
                </div>
            </div>

            <div className="card-header text-center">
                <h2 className="title">
                    <span className="text-wrapper">
                        რეგისტრაციისთვის დაგჭირდება 4 მარტივი ეტაპის გავლა
                    </span>
                </h2>
            </div>

            <div className="card-content text-center">

                <div className="steps-info row">
                    <div className="col">
                        <span className="bullet"></span>
                        <span className="thumb">
                            <img src={images.IconChecklist} />
                        </span>
                        <span className="label">
                            აირჩიე სამართლებრივი ფორმა
                        </span>
                    </div>
                    <div className="col">
                        <span className="bullet"></span>
                        <span className="thumb">
                            <img src={images.IconFaceId} />
                        </span>
                        <span className="label">
                            გაიარე ვერიფიკაცია
                        </span>
                    </div>
                    <div className="col">
                        <span className="bullet"></span>
                        <span className="thumb">
                            <img src={images.IconList} />
                        </span>
                        <span className="label">
                            შეავსე განაცხადი
                        </span>
                    </div>
                    <div className="col">
                        <span className="bullet"></span>
                        <span className="thumb">
                            <img src={images.IconBank} />
                        </span>
                        <span className="label">
                            შეარჩიე პროდუქტი
                        </span>
                    </div>
                </div>

            </div>

            <div className="buttons text-center">
                <MainButton onClick={onChange}>შემდეგი</MainButton>
            </div>
        </section>
    )
}

export default Step;