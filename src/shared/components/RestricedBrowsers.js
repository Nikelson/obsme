import { VtbLogo } from './../../assets/images';

const RestricedBrowsers = props => {
    return <div className="old-browser">
        <img src={VtbLogo} />
        <h2>ბრაუზერის მხარდაჭერა შეჩერებულია</h2>
        <div>
            გთხოვთ განაახლოთ ბრაუზერი ან მოგვმართოთ ფილიალში.
        </div>
    </div>
}

export default RestricedBrowsers;