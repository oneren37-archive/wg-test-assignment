import companies from '../../data/companies.json';
import orders from '../../data/orders.json';
import users from '../../data/users.json';

import {TableDataModel} from "../data-model/table-data-model.js";
import {Table} from "../view-components/table.js";
import {EventEmitter} from "../event-emitter.js";

export class TableController{

    constructor() {
        this._eventEmitter = new EventEmitter()
        this._tableDataModel = new TableDataModel(orders, users, companies, this._eventEmitter)
        this._tableComponent = new Table(
            document.querySelector('tbody'),
            {
                table: this._tableDataModel.table,
                sortState: this._tableDataModel.sortState
            },
            this._eventEmitter
        )
        this.bindEvents()
    }

    bindEvents(){
        this._eventEmitter.subscribe("TABLE_CHANGED", () => {
            this._tableComponent.bindModel({
                table: this._tableDataModel.table,
                sortState: this._tableDataModel.sortState
            })
        })
    }
}
