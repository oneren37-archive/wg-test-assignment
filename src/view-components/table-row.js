import {AbstractRenderComponent} from "./abstract-render-component.js";

export class TableRow extends AbstractRenderComponent{


    /**
     * @param {tableRow} props
     */
    render(props) {
        let tableRow = document.createElement("tr")
        tableRow.id = `order_${props.orderID}`
        tableRow.className = "text-muted"

        tableRow.innerHTML = `
                <td>${props.transactionID}</td>
                <td class="user-data">
                    <a href="#">${props.userInfo.gender === "Male" ? "Mr." : "Ms."} ${props.userInfo.first_name} ${props.userInfo.last_name}</a>
                    <div class="user-details d-none">
                        ${
                            props.userInfo.birthday ? 
                                `<p>Birthday: ${this._formatDate(props.userInfo.birthday, "DD/MM/YYYY")}</p>` 
                                : ""
                        }
                        ${
                            props.userInfo.avatar ?
                                `<p><img src="${props.userInfo.avatar}" width="100px" alt=""></p>`
                                :""
                        }
                        ${
                            props.userCompanyInfo ?
                            `<p>Company: ${
                                    props.userCompanyInfo.url ? 
                                        `<a target="blank" href="${props.userCompanyInfo.url}">${props.userCompanyInfo.title}</a>` 
                                        : props.userCompanyInfo.title
                            }</p>
                            <p>Industry: ${props.userCompanyInfo.industry} / ${props.userCompanyInfo.sector}</p>` 
                            : ""
                        }
                    </div>
                </td>
                <td>${this._formatDate(props.orderDate, "DD/MM/YYYY hh:mm:ss")}</td>
                <td>$${props.orderAmount}</td>
                <td>${this._maskCardNumber(props.cardNumber)}</td>
                <td>${props.cardType}</td>
                <td>${props.location}</td>
            `
        return tableRow
    }

    findElements() {
        this._toggleUserDetails = this.root.querySelector('.user-data>a')
        this._userDetails = this.root.querySelector('.user-details')
    }

    bindEvents() {
        this._toggleUserDetails.addEventListener('click', (e) => {
            e.preventDefault()
            this._userDetails.classList.toggle('d-none')
        })
    }

    /**
     *
     * @param {string|number} timestamp
     * @param {string} [template = "DD/MM/YYYY"]
     * @return {string} formattedDate
     */
    _formatDate(timestamp, template = "DD/MM/YYYY"){
        let date = new Date(1000 * timestamp)
        let result = ""

        switch (template){
            case "DD/MM/YYYY hh:mm:ss":
                result = date.getDay() +
                    '.' + date.getMonth() +
                    '.' + date.getFullYear() +
                    ' ' + date.getHours() +
                    ':' + date.getMinutes() +
                    ':' + date.getSeconds()
                break

            case "DD/MM/YYYY": result = date.getDay() +
                '.' + date.getMonth() +
                '.' + date.getFullYear()
                break
        }

        return result
    }


    /**
     *
     * @param {string} cardNumber
     * @return {string} cardNumberMask
     */
    _maskCardNumber(cardNumber) {
        return cardNumber.split('').map((el, i)=>{
            if (i>=2 && i <= cardNumber.length-5) {
                el = '*'
            }
            return el
        }).join('')
    }
}
