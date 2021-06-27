import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

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
            <td>${formatDate(order.created_at, "DD/MM/YYYY hh:mm:ss")}</td>
            <td>$${order.total}</td>
            <td>${maskCardNumber(order.card_number)}</td>
            <td>${order.card_type}</td>
            <td>${order.order_country} (${order.order_ip})</td>
        </tr>
    `

    renderUserData(
        row.querySelector(".user_data"),
        users.find(user => user.id === order.user_id),
        companies
    )

    return row
}


/**
 *
 * @param {HTMLElement} rootNode корневой элемент
 * @param {Object} user
 * @param {number} user.id идентификатор пользователя
 * @param {string} user.gender пол, может быть один из "Male", "Female"
 * @param {string} user.first_name пол, имя пользователя
 * @param {string} user.last_name фамилия пользователя
 * @param {string|null} user.birthday день рождения пользователя в формате unix timestamp
 * @param {string|null} user.avatar ссылка на изображения с аватаром пользователя
 * @param {number|null} user.company_id идентификатор компании, которую представляет пользователь
 * @param {Object} companies
 *
 */
function renderUserData(rootNode, user, companies){

    const company = companies.find(company => company.id === user.company_id)

    let userCompanyInfoHTML = company ? `
        <p>Company: ${company.url ? "<a href=" + company.url + " target=\"_blank\">" + company.title + "</a>": company.title}</p>
        <p>Industry: ${company.industry} / ${company.sector}</p>`:""

    rootNode.innerHTML = `
        <a href="#">${(user.gender === "Male") ? "Mr." : "Ms."} ${user.first_name} ${user.last_name}</a>
        <div class="user-details d-none">
            ${user.birthday ? "<p>Birthday: " + formatDate(user.birthday, "DD/MM/YYYY") + "</p":''}
            ${user.avatar ? '<p><img src="' +user.avatar + '" width="100px"></p>':''}
            ${userCompanyInfoHTML}
        </div>
    `

    rootNode.querySelector("a").addEventListener('click', (e) => {
        e.preventDefault()
        rootNode.querySelector(".user-details").classList.toggle("d-none")
    })
}

/**
 *
 * @param {string} timestamp
 * @param {string} [template = "DD/MM/YYYY"]
 * @return {string} formattedDate
 */
function formatDate(timestamp, template = "DD/MM/YYYY"){
    let date = new Date(1000 * timestamp)
    let result = ""

    switch (template){
        case "DD/MM/YYYY hh:mm:ss":
            result = date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            break

        case "DD/MM/YYYY": result = date.getDay() + '.' + date.getMonth() + '.' + date.getFullYear()
            break
    }

    return result
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
