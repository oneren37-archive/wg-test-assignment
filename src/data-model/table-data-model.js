export class TableDataModel{

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
     */
    constructor(orders, users, companies) {
        this._orders = orders
        this._companies = companies
        this._users = users

        /**
         *
         * @type {tableRow[]}
         */
        this.table = []
        this.makeTable()
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
                orderAmount: order.total,
                cardNumber: order.card_number,
                cardType: order.card_type,
                location: `${order.order_country} (${order.order_ip})`
            }

            this.table.push(row)

        })
    }
}
