import ModelFiller from './index';

export class ResponseModel extends ModelFiller {
    constructor(props) {
        super();

        this.isSuccess = true;
        this.status = null;
        this.appStatus = null;
        this.errors = null;
        this.errorMessage = null;
        this.data = null;

        this._fill(props);
    }
}