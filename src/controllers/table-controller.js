import companies from '../../data/companies.json';
import orders from '../../data/orders.json';
import users from '../../data/users.json';

import {DataModel} from "../data-model/data-model.js";
import {MainTable} from "../view-components/main-table/main-table.js";

export class TableController{

    constructor(dataModel, eventEmitter) {
        this._eventEmitter = eventEmitter
        this._dataModel = dataModel
        this._tableComponent = new MainTable(
            document.querySelector('.main-table>tbody'),
            {
                table: this._dataModel.table,
                sortState: this._dataModel.sortState
            },
            this._eventEmitter
        )
        this.bindEvents()
    }

    bindEvents(){
        this._eventEmitter.subscribe("MAIN_TABLE_CHANGED", () => {
            this._tableComponent.bindModel({
                table: this._dataModel.table,
                sortState: this._dataModel.sortState
            })
        })
    }
}
