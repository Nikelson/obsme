import * as images from '../assets/images';


const Maintenance = () => {

    const getDates = () => {
        const globalConfig = window.globalConfig;
        const fromDate = globalConfig.maintenance?.fromDate;
        const toDate = globalConfig.maintenance?.toDate;

        if (!fromDate && !toDate) {
            return null;
        }

        let dateText = <>
            ონლაინ რეგისტრაციით სარგებლობა შეზღუდული იქნება:
            <br />
            <br />
            {fromDate && <>
                {fromDate} - დან
            </>}

            {toDate && <>
                {toDate} - მდე
            </>}
        </>;

        return dateText;
    }

    return (
        <main>
            <header className="header row align-middle">
                <div className="col">
                    <img className="logo" src={images.VtbLogo} />
                </div>
            </header>
            <section className="card">
                <div className="card-header text-center">
                    <h2 className="title">მიმდინარეობს ტექნიკური სამუშაოები</h2>
                </div>

                <div className="card-content text-center">
                    <div className="thumb-holder">
                        <img src={images.Maintenance} />
                    </div>


                    <div className="upper-title">
                        ბოდიშს გიხდით შეფერხებისთვის!
                        <br />
                        <br />
                        {getDates()}
                    </div>
                </div>


            </section>
        </main>
    )
}

export default Maintenance;