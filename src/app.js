import orders from '../data/orders.json';
import users from '../data/users.json';

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

    row.innerHTML = `
        <tr id="order_${order.id}">
            <td>${order.transaction_id}</td>
            <td class="user_data"></td>
            <td>${formatDate(order.created_at)}</td>
            <td>$${order.total}</td>
            <td>${maskCardNumber(order.card_number)}</td>
            <td>${order.card_type}</td>
            <td>${order.order_country} (${order.order_ip})</td>
        </tr>
    `

    row.querySelector(".user_data").appendChild(renderUserInfoLink(
        users.find(e => e.id === order.id)
    ))

    return row
}


/**
 *
 * @param {number} user.id идентификатор пользователя
 * @param {string} user.gender пол, может быть один из "Male", "Female"
 * @param {string} user.first_name пол, имя пользователя
 * @param {string} user.last_name фамилия пользователя
 * @return {HTMLElement} userInfoLink
 */
function renderUserInfoLink(user){
    console.log(user.gender)
    let userInfoLink = document.createElement('a')
    userInfoLink.setAttribute('href', '#')
    userInfoLink.textContent = `${(user.gender === "Male") ? "Mr." : "Ms."} ${user.first_name} ${user.last_name}`
    return userInfoLink
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
