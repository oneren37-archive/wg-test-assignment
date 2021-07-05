import {AbstractDomMountComponent} from "./abstract-mount-component.js";
import {TableRow} from "./table-row.js";

export class Table extends AbstractDomMountComponent{

    /**
     * @param {tableRow[]} props
     */
    bindModel(props) {
        console.log(this._rootNode)
        props.forEach((row) => {
            let tableRow = new TableRow(row)
            this._rootNode.appendChild(tableRow.root)
        })
    }
}
