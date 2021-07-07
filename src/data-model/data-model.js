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
         * @type {tableRow[]}
         */
        this.table = []
        this.makeTable()
        this.tableFull = this.table.slice()
        this._eventEmitter = eventEmitter
        this._bindEvents(this._eventEmitter)

        this.sortState = {}
        this.stat = {}
        this._updateStat()
    }


    makeTable(){
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
        eventEmitter.subscribe('MAIN_TABLE_CHANGED', () => {
            if (this.table.length) {
                this._updateStat()
            }
        })
        eventEmitter.subscribe("SORT_TABLE", key => {
            const currentSortingKey = Object.keys(this.sortState)[0]
            const currentSortingMethod = this.sortState[currentSortingKey]

            if (currentSortingKey && currentSortingKey === key){
                let newSortState = {}
                newSortState[key] = currentSortingMethod === "DESC" ? "ASC" : "DESC"
                this._sortTable(newSortState)
                this.sortState = newSortState
            }
            else {
                let newSortState = {}
                newSortState[key] = "DESC"
                this._sortTable(newSortState)
                this.sortState = newSortState
            }
            this._eventEmitter.emit("MAIN_TABLE_CHANGED")
        })
        eventEmitter.subscribe("SEARCH", value => this._search(value))
    }


    /**
     * принимает параметры сортировки и сортирует this.table
     * @param {Object<string, string>} newSortState
     * @private
     */
    _sortTable(newSortState){

        const key = Object.keys(newSortState)[0]
        const order = newSortState[key]

        let fields = {
            TRANSACTION_ID: "transactionID",
            ORDER_DATE: "orderDate",
            ORDER_AMOUNT: "orderAmount",
            CARD_TYPE: "cardType",
            LOCATION: "location"
        }
        switch (key) {
            case "USER_INFO":
                if (order === "DESC"){
                    this.table.sort((a, b) => {
                            if(a.userInfo.first_name  === b.userInfo.first_name ){
                                return a.userInfo.last_name < b.userInfo.last_name  ? 1 : -1
                            }
                            return a.userInfo.first_name < b.userInfo.first_name  ? 1 : -1
                    })
                }
                else {
                    this.table.sort((a, b) => {
                        if(a.userInfo.first_name  === b.userInfo.first_name ){
                            return a.userInfo.last_name  > b.userInfo.last_name  ? 1 : -1
                        }
                        return a.userInfo.first_name  > b.userInfo.first_name  ? 1 : -1
                    })
                }
                return

            case "CARD_NUMBER": return
        }

        if (order === "DESC"){
            this.table.sort((a, b) => {
                return a[fields[key]] < b[fields[key]] ? 1 : -1
            })
        }
        else {
            this.table.sort((a, b) => {
                return a[fields[key]] > b[fields[key]] ? 1 : -1
            })
        }
    }


    /**
     * обновляет this.stat
     * @private
     */
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
        )[Math.floor(this.table.length / 2)].orderAmount

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


    /**
     * @param {string} value
     * @private
     */
    _search(value){
        this.table = this.tableFull.filter(row => {
            return  row.userInfo.first_name.includes(value)
                ||  row.userInfo.last_name.includes(value)
                ||  row.transactionID.includes(value)
                ||  row.orderAmount.toString().includes(value)
                ||  row.cardType.includes(value)
                ||  row.location.includes(value)
        })
        this._sortTable(this.sortState)
        this._eventEmitter.emit('MAIN_TABLE_CHANGED')
    }
}
