import { LightningElement,api } from 'lwc';

export default class AccountChild1 extends LightningElement {

    @api accountNameEntered;
    handleChange(event)
    {

        this.accountNameEntered=event.target.value;
    }

    handleClick(event)
    {
        const clickEvent= new CustomEvent('getaccountdetails',{detail: this. accountNameEntered});
        this.dispatchEvent(clickEvent);
    }
}