/**
 * @abstract
 */

export class AbstractDomMountComponent{

    /**
     * @param {HTMLElement} rootNode
     * @param {Object} props
     * @param {*} eventEmitter
     */
    constructor(rootNode, props, eventEmitter) {
        this._rootNode = rootNode;
        this._props = props;
        this._eventEmitter = eventEmitter;
        this.findElements();
        this.bindModel(this._props);
        this.bindEvents(this._eventEmitter);
    }

    /**
     * @abstract
     */
    bindModel(props){}

    /**
     * @protected
     */
    findElements() {}

    /**
     * @param {*} eventEmitter
     * @protected
     */
    bindEvents(eventEmitter) {}
}
