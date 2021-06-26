import orders from '../data/orders.json';

function app(){
    document.addEventListener('DOMContentLoaded', evt => {
        const TABLE = document.querySelector("table")
        const TBODY = TABLE.querySelector("tbody")

        orders.forEach(order => TBODY.appendChild(renderRow(order)))
    })
}

/**
 *
 * @param {number} order.id порядковый номер записи
 * @param {string} order.transaction_id уникальный номер заказа
 * @param {string} order.created_at временная метка создания заказа в формате unix (timestamp)
 * @param {string} order.user_id идентификатор пользователя
 * @param {string} order.total общая сумма заказа в базовой валюте (USD)
 * @param {string} order.card_type тип карты оплаты
 * @param {string} order.card_number номер карты оплаты
 * @param {string} order.order_country страна, из которой сделан заказ
 * @param {string} order.order_ip IP-адрес пользователя, с которого сделан заказ
 * @return {HTMLTableRowElement} row
 */
function renderRow(order){
    const xss = require("xss")

    let row = document.createElement("tr")
    row.id = `order_${order.id}`
    row.className = "text-muted"

    row.innerHTML = xss(`
        <tr id="order_${order.id}">
            <td>${order.transaction_id}</td>
            <td class="user_data">${order.user_id}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>$${order.total}</td>
            <td>${maskCardNumber(order.card_number)}</td>
            <td>${order.card_type}</td>
            <td>${order.order_country} (${order.order_ip})</td>
        </tr>
    `)
    return row
}

/**
 *
 * @param {string} timestamp
 * @return {string} formattedDate
 */
function formatDate(timestamp){
    let date = new Date(1000 * timestamp)
    return date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}


/**
 *
 * @param {string} cardNumber
 * @return {string} cardNumberMask
 */
function maskCardNumber(cardNumber){
    return cardNumber.split('').map((el, i)=>{
        if (i>=2 && i <= cardNumber.length-5) {
            el = '*'
        }
        return el
    }).join('')
}

export default (app());
