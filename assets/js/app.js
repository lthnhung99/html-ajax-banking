class App {

  static DOMAIN_SERVER = 'http://localhost:3000';
  static API_SERVER = 'http://localhost:3000';

  static API_CUSTOMER = this.API_SERVER + '/customers';
  static API_DEPOSIT = this.API_SERVER + '/deposits';
  static API_WITHDRAW = this.API_SERVER + '/withdraws';

  static showDeleteConfirmDialog() {
    return Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to delete the selected data ?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it !',
      cancelButtonText: 'Cancel',
    });
  }

  static showSuccessAlert(t) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: t,
      showConfirmButton: true,
      // timer: 1500
    })
    // Swal.fire(
    //   'Good job!',
    //   'You clicked the button!',
    //   'success'
    // )
  }

  static showErrorAlert(t) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Warning',
      text: t,
      showConfirmButton: true,
    });
  }
  
}

class Customer {
	constructor(id, fullName, email, phone, address, balance, deleted) {
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.balance = balance;
    this.deleted = deleted;
	}

}
class Deposit {
    constructor(id, customerId, transactionAmount) {
      this.id = id;
      this.customerId = customerId;
      this.transactionAmount = transactionAmount;
    }
}
class Withdraw {
    constructor(id, customerId, transactionAmount) {
      this.id = id;
      this.customerId = customerId;
      this.transactionAmount = transactionAmount;
    }
}
class Transfer {
    constructor(id, senderId, recipientId, fees, transferAmount, feesAmount, transactionAmount) {
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.fees = fees;
        this.transferAmount = transferAmount;
        this.feesAmount = feesAmount;
        this.transactionAmount = transactionAmount;
    }
}

$(function() {
    $(".num-space").number(true, 0, ',', ' ');
    $(".num-point").number(true, 0, ',', '.');
    $(".num-comma").number(true, 0, ',', ',');

    $('[data-toggle="tooltip"]').tooltip();
});
