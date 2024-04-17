public with sharing class AccountRecords {

    @AuraEnabled(cacheable= true)
    public static List<Account> getAccounts(String searchTextClass){
        
            if(Schema.sObjectType.Account.isAccessible()) 
            
            {
                if(!String.isEmpty(searchTextClass))
                {
                    searchTextClass= '%'+ searchTextClass+'%';
            
                    return [SELECT Id, Name FROM Account WHERE Name LIKE :searchTextClass];
                }
            
                else
                {
                    
                    return [SELECT Id, Name FROM Account];
                   
                }
            }
            
            else{
                return null;
            }
}
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAccountContacts(String accountId){
    
            if(Schema.sObjectType.Contact.isAccessible()) 
        
        {
            return [SELECT Id, Name FROM Contact WHERE Account.Id= :accountId];
        
        }
        
        else{
            return null;
        }
    }
}
