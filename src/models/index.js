export default class ModelFiller {
    constructor() {
    }
}

ModelFiller.prototype._fill = function (props) {
    for (let prop in props) {
        if (this.hasOwnProperty(prop)) {
            this[prop] = props[prop];
        }
    }
}
