import {AbstractDomMountComponent} from "../abstract-components/abstract-mount-component.js";
import {MainTableRow} from "./main-table-row.js";

export class MainTable extends AbstractDomMountComponent{

    bindModel(props) {
        this._rootNode.innerHTML = ''
        props.table.forEach((row) => {
            let tableRow = new MainTableRow(row)
            this._rootNode.appendChild(tableRow.root)
        })
        this.findElements()
        const sortKey = Object.keys(this.th).find((key) => !!props.sortState[key])

        if (props.sortState[sortKey]){
            let th = this.th[sortKey]
            if (this.currentArrow) {this.currentArrow.remove()}
            th.innerHTML +=  props.sortState[sortKey] === "DESC"?"<span> ↓</span>":"<span> ↑</span>"
            this.currentArrow = th.querySelector('span')
        }
    }

    findElements() {
        this.th = {
            "TRANSACTION_ID": document.querySelector('#js-transaction-id'),
            "USER_INFO": document.querySelector('#js-user-info'),
            "ORDER_DATE": document.querySelector('#js-order-date'),
            "ORDER_AMOUNT": document.querySelector('#js-order-amount'),
            "CARD_NUMBER": document.querySelector('#js-card-num'),
            "CARD_TYPE": document.querySelector('#js-card-type'),
            "LOCATION": document.querySelector('#js-location'),
        }
    }

    bindEvents(eventEmitter) {
        Object.keys(this.th).forEach((key) => {
            this.th[key].addEventListener('click', () => {
                eventEmitter.emit("SORT_TABLE", key)
            })
        })
    }

}
