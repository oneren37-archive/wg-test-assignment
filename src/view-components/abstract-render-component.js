/**
 * @abstract
 */
export class AbstractRenderComponent{

    /**
     * @param {Object} props
     */
    constructor(props) {
        this._props = props
        this.root = this.render(this._props)
        this.findElements()
        this.bindEvents()
    }

    /**
     * @abstract
     * @protected
     */
    render(props) {}

    /**
     * @protected
     */
    findElements(){}

    /**
     * @protected
     */
    bindEvents(){}
}
