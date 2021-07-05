/**
 * @abstract
 */
export class AbstractDomMountComponent {

    /**
     * @param {HTMLElement} rootNode
     * @param {Object} props
     */
    constructor(rootNode, props) {
        /**
         * @protected
         */
        this._rootNode = rootNode;
        this._props = props;
        this.findElements();
        this.bindModel(this._props);
        this.bindEvents();
    }

    /**
     * @abstract
     * @protected
     */
    bindModel(props){}

    /**
     * @protected
     */
    findElements() {}

    /**
     * @protected
     */
    bindEvents() {}
}
