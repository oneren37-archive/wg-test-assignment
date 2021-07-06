import {TableController} from "../controllers/table-controller.js";
import {EventEmitter} from "../event-emitter.js";
import {SidebarController} from "../controllers/sidebar-controller.js";
import {DataModel} from "../data-model/data-model";
import orders from "../../data/orders.json";
import users from "../../data/users.json";
import companies from "../../data/companies.json";

function app(){
    document.addEventListener('DOMContentLoaded', () => {
        const eventEmitter = new EventEmitter()
        const dataModel = new DataModel(orders, users, companies, eventEmitter)
        const tableController = new TableController(dataModel, eventEmitter)
        const sidebarController = new SidebarController(dataModel, eventEmitter)
    })
}

export default app();
