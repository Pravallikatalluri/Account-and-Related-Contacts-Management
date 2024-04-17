import { LightningElement ,api,wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountRecords.getAccounts';
import { MessageContext, publish } from 'lightning/messageService';
import Myproject from '@salesforce/messageChannel/Myproject__c';
export default class AccountChild2 extends LightningElement {
    @api searchTextChild2;
    @wire(MessageContext) messagecontext;
    columns=[

        {
            label: 'Id', fieldName:'Id'
        },
        {
            label:'Name', fieldName:'Name'
        },
        {
            label:'Actions', fieldName:'Actions',type:'button', typeAttributes:
            {
                label: 'ViewContacts',
                value: 'view_contacts'

            }
        }
        
    ]
    // rows=[
    //     {
    //         Id: '439829', Name:'fhefe'
    //     },
    //     {
    //         Id: '439827', Name:'fhefeg'
    //     },
    //     {
    //         Id: '439828', Name:'fhefet'
    //     }
    // ]
    currentId;
    currentName;
    handleRow(event)
    {  
        if(event.detail.action.value='view_contacts')
        {
        this.currentId= event.detail.row.Id;
        this.currentName=event.detail.row.Name;
        }
        const payload=
        {
            accountId: event.detail.row.Id,
            accountName: event.detail.row.Name
        };
        publish(this.messagecontext,Myproject,payload);
    }

    @wire(getAccounts,{searchTextClass:'$searchTextChild2'}) accountRecords;
}