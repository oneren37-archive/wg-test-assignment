import {StatTable} from "../view-components/sidebar/stat-table.js";

export class SidebarController {
    constructor(dataModel, eventEmitter) {
        this._dataModel = dataModel
        this._eventEmitter = eventEmitter
        this.statTableComponent = new StatTable(
            document.querySelector('.stat-table>tbody'),
            {
                stat: this._dataModel.stat
            },
            this._eventEmitter
        )
        this.bindEvents()
    }

    bindEvents(){
        this._eventEmitter.subscribe("STAT_CHANGED", () => {
            this.statTableComponent.bindModel({
                stat: this._dataModel.stat
            })
        })
    }
}
