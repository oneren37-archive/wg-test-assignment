import {AbstractDomMountComponent} from "../abstract-components/abstract-mount-component.js";

export class Search extends AbstractDomMountComponent{
    findElements() {
        this._input = this._rootNode.querySelector('input')
    }

    bindEvents(eventEmitter) {
        this._rootNode.addEventListener('submit', (e) => {
            e.preventDefault()
            eventEmitter.emit('SEARCH', this._input.value)
        })
    }
}

