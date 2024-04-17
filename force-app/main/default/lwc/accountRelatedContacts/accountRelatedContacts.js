import { MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import { LightningElement, wire,api } from 'lwc';
import Myproject from '@salesforce/messageChannel/Myproject__c';
import getAccountContacts from '@salesforce/apex/AccountRecords.getAccountContacts';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
export default class AccountRelatedContacts extends LightningElement {
    subscription=null;
    @api accountId1;
    title='Contacts';
    @api contacts;
    hascontacts;
    @api accountName1;
    @wire(MessageContext) messagecontext;
    isAccountSelected=false;
    isAddContactClicked=false;
    isEditClicked;
    @api recordId;
    editableContactId;
    deleteResult;
    connectedCallback()
    {
        this.handleSubscribe();
    }
    disconnectedCallback()
    {
        this.handleUnsubscribe();
    }
    handleSubscribe()
    {
        if(!this.subscription)
        {
            this.subscription= subscribe(this.messagecontext,Myproject,
                (parameter)=>
                {
                    this.accountId1= parameter.accountId;
                    this.accountName1= parameter.accountName;
                  
                    this.title= this.accountName1+"'s Contacts";
                    this.getContacts();
                 
                }
            );
           
        }
    }

    // async getContacts(){
      
    //    this.contacts=await getAccountContacts({accountId: this.accountId1});
    //    this.hascontacts= this.contacts.length > 0 ?true :false;
    //   this.isAccountSelected=true;
        
    // }
   
    @wire(getAccountContacts, { accountId: '$accountId1' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.hascontacts = this.contacts.length > 0;
            this.isAccountSelected=true;

        } else if (error) {
            // Handle error
            console.error('Error retrieving contacts:', error);
        }
    }


    handleUnsubscribe()
    {
        unsubscribe(this.subscription);
        this.subscription=null;

    }


    handleAddContact(event)
    {
        this.isAddContactClicked=true;
    }
    handleAddContactCancel(event)
    {
        this.isAddContactClicked=false;
    }

    handleEdit(event)
    {
        this.isEditClicked=true;
        this.editableContactId=event.target.dataset.contactId;
    }
    handleEditCancel(event)
    {
        this.isEditClicked=false;
    }

    handleSuccess(event)
    {
        this.isAddContactClicked=false;
        this.isEditClicked=false;
        //this.getContacts();
        refreshApex(this.wiredContacts);

    }

    async handleDelete(event)
    {
            this.editableContactId=event.target.dataset.contactId;
            const result = await LightningConfirm.open({
                message: 'Are you sure you want to delete the contact?',
                variant: 'headerless',
                label: 'this is the aria-label value',
            });

            if(result)
            {
                let deleteResult=await deleteRecord(this.editableContactId);
                //this.getContacts();
                refreshApex(this.wiredContacts);
                this.showToast();
            }
    }
            showToast(){
                const event = new ShowToastEvent({
                    title: 'Contact Deleted',
                    message:
                        'Contact Deleted Successfully.',
                });
                this.dispatchEvent(event);
            }
        
}