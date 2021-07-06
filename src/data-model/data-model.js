export class DataModel {

    /**
     * @typedef {Object} order
     * @property {number} id порядковый номер записи
     * @property {string} transaction_id уникальный номер заказа
     * @property {string} created_at временная метка создания заказа в формате unix (timestamp)
     * @property {number} user_id идентификатор пользователя
     * @property {number} total общая сумма заказа в базовой валюте (USD)
     * @property {string} card_type тип карты оплаты
     * @property {string} card_number номер карты оплаты
     * @property {string} order_country страна, из которой сделан заказ
     * @property {string} order_ip IP-адрес пользователя, с которого сделан заказ
     */

    /**
     * @typedef {Object} company
     * @property {user.company_id} id идентификатор компании
     * @property {string} title название компании
     * @property {string} industry отрасль деятельности
     * @property {string} market_cap рыночная капитализация
     * @property {string} sector специализация компании
     * @property {string|null} url ссылка на сайт компании
     */

    /**
     * @typedef {Object} user
     * @property {order.user_id} id идентификатор пользователя
     * @property {string} first_name имя пользователя
     * @property {string} last_name фамилия пользователя
     * @property {string} gender пол, может быть один из "Male", "Female"
     * @property {number|null} birthday день рождения пользователя в формате unix timestamp
     * @property {string|null} avatar ссылка на изображения с аватаром пользователя
     * @property {number|null} company_id идентификатор компании, которую представляет пользователь
     */

    /**
     * @typedef {Object} tableRow
     * @property {number} orderID
     * @property {string} transactionID
     * @property {user} userInfo
     * @property {company|null} userCompanyInfo
     * @property {string} orderDate
     * @property {number} orderAmount
     * @property {string} cardNumber
     * @property {string} cardType
     * @property {string} location
     */

    /**
     *
     * @param {order[]} orders
     * @param {user[]} users
     * @param {company[]} companies
     * @param eventEmitter
     */
    constructor(orders, users, companies, eventEmitter) {
        this._orders = orders
        this._companies = companies
        this._users = users

        /**
         *
         * @type {tableRow[]}
         */
        this.table = []
        this.makeTable()
        this._eventEmitter = eventEmitter
        this._bindEvents(this._eventEmitter)

        this.sortState = {}
        this.stat = {}
        this._updateStat()
        this._eventEmitter.subscribe('MAIN_TABLE_CHANGED', ()=>this._updateStat())
    }


    /**
     * @param {string[]|null} filters
     * @param {string|null} sort
     */
    makeTable(filters=null, sort=null){

        this._orders.forEach((order)=>{
            const user = this._users.find(user => user.id === order.user_id)
            const company = this._companies.find(c => c.id === user.company_id)

            /**
             * @type {tableRow}
             */
            let row = {
                orderID: order.id,
                transactionID: order.transaction_id,
                userInfo: user,
                userCompanyInfo: company?company:null,
                orderDate: order.created_at,
                orderAmount: parseFloat(order.total),
                cardNumber: order.card_number,
                cardType: order.card_type,
                location: `${order.order_country} (${order.order_ip})`
            }

            this.table.push(row)

        })
    }

    _bindEvents(eventEmitter){
        eventEmitter.subscribe("SORT_TABLE", key => this._sortTable(key))
    }

    _sortTable(key){
        let fields = {
            TRANSACTION_ID: "transactionID",
            ORDER_DATE: "orderDate",
            ORDER_AMOUNT: "orderAmount",
            CARD_TYPE: "cardType",
            LOCATION: "location"
        }
        switch (key) {

            case "USER_INFO":
                if (this.sortState["USER_INFO"] && this.sortState["USER_INFO"] === "DESC"){
                    this.table.sort((a, b) => {
                            if(a.userInfo.first_name  === b.userInfo.first_name ){
                                return a.userInfo.last_name < b.userInfo.last_name  ? -1 : 1
                            }
                            return a.userInfo.first_name < b.userInfo.first_name  ? -1 : 1
                    })
                    this.sortState = {"USER_INFO": "ASC"}
                }
                else {
                    this.table.sort((a, b) => {
                        if(a.userInfo.first_name  === b.userInfo.first_name ){
                            return a.userInfo.last_name  > b.userInfo.last_name  ? -1 : 1
                        }
                        return a.userInfo.first_name  > b.userInfo.first_name  ? -1 : 1
                    })
                    this.sortState = {"USER_INFO": "DESC"}
                }
                this._eventEmitter.emit("MAIN_TABLE_CHANGED")
                return

            case "CARD_NUMBER": return
        }

        if (this.sortState[key] && this.sortState[key] === "DESC"){
            this.table.sort((a, b) => a[fields[key]] < b[fields[key]] ? -1 : 1)
            this.sortState = {}
            this.sortState[key] = "ASC"
        }
        else {
            this.table.sort((a, b) => a[fields[key]] > b[fields[key]] ? -1 : 1)
            this.sortState = {}
            this.sortState[key] = "DESC"
        }
        this._eventEmitter.emit("MAIN_TABLE_CHANGED")
    }


    _updateStat(){
        let ordersCount = this.table.length
        let ordersTotal = Math.round(
            this.table.reduce(
                (accumulator, {orderAmount}, initialValue) => {
                    return accumulator + orderAmount
                }, 0
            )
        )


        let maleOrdersCount = 0
        let femaleOrdersCount = 0

        let maleOrdersTotal = this.table.reduce(
            (accumulator, {userInfo, orderAmount}, initialValue) => {
                if(userInfo.gender === "Male"){
                    maleOrdersCount++
                    return accumulator + orderAmount
                }
                else{
                    return accumulator
                }
            }, 0
        )
        let femaleOrdersTotal = this.table.reduce(
            (accumulator, {userInfo, orderAmount}, initialValue) => {
                if(userInfo.gender === "Female"){
                    femaleOrdersCount++
                    return accumulator + orderAmount
                }
                else{
                    return accumulator
                }
            }, 0
        )

        let medianValue = this.table.slice().sort((a, b) => {
                return a.orderAmount < b.orderAmount ? -1 : 1
            }
        )[this.table.length/2].orderAmount

        let averageCheck = Math.round(ordersTotal/ordersCount)
        let averageCheckFemale = Math.round(femaleOrdersTotal/femaleOrdersCount)
        let averageCheckMale = Math.round(maleOrdersTotal/maleOrdersCount)


        this.stat = {
            ordersCount: ordersCount,
            ordersTotal: ordersTotal,
            medianValue: medianValue,
            averageCheck: averageCheck,
            averageCheckFemale: averageCheckFemale,
            averageCheckMale: averageCheckMale,
        }
        this._eventEmitter.emit("STAT_CHANGED")
    }
}
