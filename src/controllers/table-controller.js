import companies from '../../data/companies.json';
import orders from '../../data/orders.json';
import users from '../../data/users.json';

import {TableDataModel} from "../data-model/table-data-model.js";
import {Table} from "../view-components/table.js";

export class TableController{

    constructor() {
        this._tableDataModel = new TableDataModel(orders, users, companies)
        this._tableComponent = new Table(
            document.querySelector('tbody'),
            this._tableDataModel.table
        )
    }
}
