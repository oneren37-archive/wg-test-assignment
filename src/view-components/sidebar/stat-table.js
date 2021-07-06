import {AbstractDomMountComponent} from "../abstract-components/abstract-mount-component.js";

export class StatTable extends AbstractDomMountComponent{
    bindModel(props) {
        this._rootNode.innerHTML = `
            <tr>
                <td>Orders Count</td>
                <td>${props.stat.ordersCount}</td>
            </tr>
            <tr>
                <td>Orders Total</td>
                <td>$ ${props.stat.ordersTotal}</td>
            </tr>
            <tr>
                <td>Median Value</td>
                <td>$ ${props.stat.medianValue}</td>
            </tr>
            <tr>
                <td>Average Check</td>
                <td>$ ${props.stat.averageCheck}</td>
            </tr>
            <tr>
                <td>Average Check (Female)</td>
                <td>$ ${props.stat.averageCheckFemale}</td>
            </tr>
            <tr>
                <td>Average Check (Male)</td>
                <td>$ ${props.stat.averageCheckMale}</td>
            </tr>   
        `
    }
}
