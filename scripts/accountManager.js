/*
* This file manages accounts in our email system. This account method is better
* than storing individual hardcoded arrays since this system would be able to
* handle many accounts without much modification. Room for expansion is
* important.
*
* @author Jay Patel
* @author Justin Gray
* @author Vitor Jeronimo
*/

// ==========================================================================
// Email Account Methods
// ==========================================================================

/*
* Creates a new account object (for either admin or student or other?)
*
* USAGE:
* var testAcc = new Account("Tester", [], []);
* console.log(testAcc.name);
* PRINTS: Tester
*
* @param name       the owner of the account (string)
* @param inboxMail  an array of Email objects (sent to this Account)
* @param sentMail   an array of Email objects (sent from this Account)
* @returns          a new account object
*/
function Account(name, inboxMail, sentMail) {
  this.name = name;
  this.inboxMail = inboxMail;
  this.sentMail = sentMail;
}

// ==========================================================================
// I/O Methods to Persistent Storage
// ==========================================================================

var SERVER_URL = "http://140.184.230.209:3355";

/*
* Reads data from local storage by a key.
* @param key  where the the item is in local storage
* @returns    the item at key in local storage
*/
function read(key) {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    return "undefined";
  } else {
    // return null or the found value
    return localStorage.getItem(key);
  }
}

/*
* Writes data into storage using a key value pair. Value is written at location
* key. Just like a map.
* @param key    where to store the value
* @param value  the value to store
*/
function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error.name + ": " + error.message);
  }
}

/*
* Get a server account by name, and perform a function on the returned account
* @param accountName  the name of the account to retrieve from server storage
* @param next         the function to perform next (with the account object)
* @returns            NA
*/
function getServerAccount(accountName, next) {
  $.post(SERVER_URL + '/getAccount', {name: accountName}, function(result) {
    // using the account result object, perform 'next' function
    next(result);
  }).fail(function(err) {
    // if we have an error, print an error message
    console.error(err);
  });
}

/*
* Save an account to server storage and optionally perform the next operation
* @param account  the account to save to server storage
* @param next     the function to perform once the account has been saved. null
*                 if there is no function to perform, otherwise passes account
* @returns        NA
*/
function saveServerAccount(account, next) {
  $.post(SERVER_URL + '/writeAccount', account, function() {
    if (next != null) {
      // perform the 'next' function and pass the account object
      next(account);
    }
  }).fail(function(err) {
    // if we have an error, print a message and tell the user of the website
    console.error(err);
  });
}

/*
* Ensure that both the sender and recipient have room for the email before
* starting to compose it! If no room, alert and redirect back.
* @param sender     the sender account's name
* @param recipient  the recipient account's name
* @returns          NA
*/
function checkHasRoom(sender, recipient) {
  // check if sender has room
  getServerAccount(sender, function(senderAcc) {

    if (senderAcc.sentMail.length >= 10) {
      alert("Your sent items is full.");
      goBack();
    } else {
      // check if recipient has room

      getServerAccount(recipient, function(recipientAcc) {
        if (recipientAcc.inboxMail.length >= 10) {
          alert("Recipient's inbox is full.");
          goBack();
        }
      });

    }

  });
}
