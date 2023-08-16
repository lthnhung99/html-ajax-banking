class App {

  static DOMAIN_SERVER = 'http://localhost:3300';
  static API_SERVER = 'http://localhost:3300';

  static API_CUSTOMER = this.API_SERVER + '/customers';
  static API_DEPOSIT = this.API_SERVER + '/deposits';
  static API_WITHDRAW = this.API_SERVER + '/withdraws';
  static API_TRANSFER = this.API_SERVER + '/transfers';
  static API_LOCATION_REGION = 'https://vapi.vnappmob.com/api/province'
  
}
class LocationRegion {
  constructor(
    id,
    provinceId,
    provinceName,
    districtId,
    districtName,
    wardId,
    wardName,
    address
  ) {
    this.id = id;
    this.provinceId = provinceId;
    this.provinceName = provinceName;
    this.districtId = districtId;
    this.districtName = districtName;
    this.wardId = wardId;
    this.wardName = wardName;
    this.address = address;
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
