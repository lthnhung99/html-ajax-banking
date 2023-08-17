const page = {
    url: {
        getAllCustomers: App.API_CUSTOMER + '?deleted=0',
        createCustomer: App.API_CUSTOMER,
        getCustomerById: App.API_CUSTOMER,
        updateCustomer: App.API_CUSTOMER,
        updateBalance: App.API_CUSTOMER,
        deposit: App.API_DEPOSIT,
        withdraw: App.API_WITHDRAW,
        transfer: App.API_TRANSFER,
        getRecipients: App.API_CUSTOMER + '?deleted=0' + '&id_ne=',
        deleteCustomer: App.API_CUSTOMER,
        locationRegion: App.API_LOCATION_REGION,
        getALlDistricts: App.API_LOCATION_REGION + '/district',
        getAllWards: App.API_LOCATION_REGION + '/ward'
    },
    elements: {},
    loadData: {},
    commands: {},
    dialogs: {
        elements: {},
        commands: {}
    },
    initializeControlEvent: {}
}
/*
url: quản lý api
elements: quản lý các phần tử
loadData: load dữ liệu
commands: quản lý các lệnh
dialogs: quản lý các modal
initializeControlEvent: quản lý các sự kiện
*/
let customerId = 0;
let locationRegion = new LocationRegion();
let customer = new Customer();
let deposit = new Deposit();
let withdraw = new Withdraw();
let transfer = new Transfer();
/** Khai báo biến chứa dữ liệu table */
page.elements.btnShowModalCreate = $('#btnShowModalCreate');
page.elements.tbCustomerBody = $("#tbCustomer tbody");
/** Khai báo biến chứa dữ liệu modal Create */
page.dialogs.elements.modalCreate = $('#modalCreate');
page.dialogs.elements.formCreate = $('#formCreate');
page.dialogs.elements.fullNameCreate = $('#fullNameCreate');
page.dialogs.elements.emailCreate = $('#emailCreate');
page.dialogs.elements.phoneCreate = $('#phoneCreate');
page.dialogs.elements.provinceCreate = $('#provinceCreate');
page.dialogs.elements.districtCreate = $('#districtCreate');
page.dialogs.elements.wardCreate = $('#wardCreate');
page.dialogs.elements.addressCreate = $('#addressCreate');
page.dialogs.elements.btnCreate = $('#btnCreate');
/** Khai báo biến chứa dữ liệu modal Update */
page.dialogs.elements.modalUpdate = $('#modalUpdate');
page.dialogs.elements.formUpdate = $('#formUpdate');
page.dialogs.elements.fullNameUpdate = $('#fullNameUpdate');
page.dialogs.elements.emailUpdate = $('#emailUpdate');
page.dialogs.elements.phoneUpdate = $('#phoneUpdate');
page.dialogs.elements.provinceUpdate = $('#provinceUpdate');
page.dialogs.elements.districtUpdate = $('#districtUpdate');
page.dialogs.elements.wardUpdate = $('#wardUpdate');
page.dialogs.elements.addressUpdate = $('#addressUpdate');
page.dialogs.elements.btnUpdate = $('#btnUpdate');
/** Khai báo biến chứa dữ liệu modal Deposit */
page.dialogs.elements.modalDeposit = $('#modalDeposit');
page.dialogs.elements.fullNameDeposit = $('#fullNameDeposit');
page.dialogs.elements.emailDeposit = $('#emailDeposit');
page.dialogs.elements.balanceDeposit = $('#balanceDeposit');
page.dialogs.elements.transactionDeposit = $('#transactionDeposit');
page.dialogs.elements.btnDeposit = $('#btnDeposit');
/** Khai báo biến chứa dữ liệu modal Withdraw */
page.dialogs.elements.modalWithdraw = $('#modalWithdraw');
page.dialogs.elements.fullNameWithdraw = $('#fullNameWithdraw');
page.dialogs.elements.emailWithdraw = $('#emailWithdraw');
page.dialogs.elements.balanceWithdraw = $('#balanceWithdraw');
page.dialogs.elements.transactionWithdraw = $('#transactionWithdraw');
page.dialogs.elements.btnWithdraw = $('#btnWithdraw');
/** Khai báo biến chứa dữ liệu modal Transfer */
page.dialogs.elements.modalTransfer = $('#modalTransfer');
page.dialogs.elements.senderId = $('#senderId');
page.dialogs.elements.senderFullName = $('#senderFullName');
page.dialogs.elements.senderEmail = $('#senderEmail');
page.dialogs.elements.senderBalance = $('#senderBalance');
page.dialogs.elements.transferAmount = $('#transferAmount');
page.dialogs.elements.fees = $('#fees');
page.dialogs.elements.btnTransfer = $('#btnTransfer');

page.commands.renderOptionProvince = (obj) => {
    return `<option value="${obj.province_id}">${obj.province_name}</option>`;
}

page.commands.renderOptionDistrict = (obj) => {
    return `<option value = "${obj.district_id}">${obj.district_name}</option>`
}
page.commands.renderOptionWard = (obj) => {
    return `<option value = "${obj.ward_id}">${obj.ward_name}</option>`
}

page.commands.getAllProvinces = () => {
    return $.ajax({
        url: page.url.locationRegion
    })
        .done((data) => {
            const provinces = data.results;
            $.each(provinces, (index, item) => {
                const str = page.commands.renderOptionProvince(item);
                page.dialogs.elements.provinceCreate.append(str);
                page.dialogs.elements.provinceUpdate.append(str);
            })


        })
        .fail((error) => {
            console.log(error);
        })
}
page.commands.getAllDistrictsByProvinceId = (provinceId, elem) => {
    return $.ajax({
        url: page.url.getALlDistricts + '/' + provinceId
    })
        .done((data) => {
            const districts = data.results;
            elem.empty();
            $.each(districts, (index, item) => {
                const str = page.commands.renderOptionDistrict(item);
                elem.append(str);
            })


        })
        .fail((error) => {
            console.log(error);
        })
}

page.commands.getAllWardsByDistrictId = (districtId, elem) => {
    return $.ajax({
        url: page.url.getAllWards + '/' + districtId
    })
        .done((data) => {
            const wards = data.results;
            elem.empty();
            $.each(wards, (index, item) => {
                const str = page.commands.renderOptionWard(item);
                elem.append(str);
            })
        })
        .fail((error) => {
            console.log(error);
        })
}

page.commands.onchangeProvince = (provinceId, districtElement, wardElement) => {
    page.commands.getAllDistrictsByProvinceId(provinceId, districtElement).then(() => {
        const districtId = districtElement.val();
        page.commands.getAllWardsByDistrictId(districtId, wardElement);
    })
}

page.commands.renderCustomer = (obj) => {
    return `
            <tr id="tr_${obj.id}">
                <td>${obj.id} </td>
                <td>${obj.fullName} </td>
                <td>${obj.email} </td>
                <td>${obj.phone} </td>
                <td>${obj.balance}</td>
                <td>${obj.locationRegion.provinceName} </td>
                <td>${obj.locationRegion.districtName} </td>
                <td>${obj.locationRegion.wardName} </td>
                <td>${obj.locationRegion.address} </td>
               
                <td>
                    <button  class="btn btn-outline-secondary edit" data-id="${obj.id}" >
                            <i class="far fa-edit"></i>
                    </button>
                    <button  class="btn btn-outline-success deposit" data-id="${obj.id}">
                                <i class="fas fa-plus"></i>
                    </button>
                    <button  class="btn btn-outline-warning withdraw" data-id="${obj.id}">
                            <i class="fa fa-minus"></i>
                    </button>
                    <button  class="btn btn-outline-primary transfer" data-id="${obj.id}">
                            <i class="fas fa-exchange-alt" ></i>
                    </button>
                    <button  class="btn btn-outline-danger delete" data-id="${obj.id}">
                            <i class="fas fa-ban" ></i>
                    </button>
                </td>
            </tr>`;
}
page.commands.getAllCustomers = () => {

    page.elements.tbCustomerBody.empty();

    $.ajax({
        type: 'GET',
        url: page.url.getAllCustomers
    })
        .done((data) => {
            data.forEach(item => {
                const str = page.commands.renderCustomer(item);
                page.elements.tbCustomerBody.prepend(str);
            });
        })
        .fail((error) => {
            console.log(error);
        })
}

/******************** Find *************************/

page.commands.getCustomerById = (id) => {
    return $.ajax({
        type: 'GET',
        url: page.url.getCustomerById + '/' + id,
    });
}

/******************** Show Modal *************************/

page.commands.handleAddEventShowModalUpdate = (customerId) => {

    page.commands.getCustomerById(customerId).then((data) => {
        customer = data;
        locationRegion = customer.locationRegion;

        page.dialogs.elements.fullNameUpdate.val(customer.fullName);
        page.dialogs.elements.emailUpdate.val(customer.email);
        page.dialogs.elements.phoneUpdate.val(customer.phone);
        page.dialogs.elements.addressUpdate.val(locationRegion.address);

        page.dialogs.elements.provinceUpdate.val(locationRegion.provinceId);

        page.commands.getAllDistrictsByProvinceId(locationRegion.provinceId, page.dialogs.elements.districtUpdate).then(() => {
            page.dialogs.elements.districtUpdate.val(locationRegion.districtId);

            page.commands.getAllWardsByDistrictId(locationRegion.districtId, page.dialogs.elements.wardUpdate).then(() => {
                page.dialogs.elements.wardUpdate.val(locationRegion.wardId);
            })
        })

        page.dialogs.elements.modalUpdate.modal('show');
    })
        .catch((error) => {
            console.log(error);
        });

}

page.commands.handleAddEventShowModalDeposit = (customerId) => {

    page.commands.getCustomerById(customerId).then((data) => {
        customer = data;
        page.dialogs.elements.fullNameDeposit.val(customer.fullName);
        page.dialogs.elements.emailDeposit.val(customer.email);
        page.dialogs.elements.balanceDeposit.val(customer.balance);
        page.dialogs.elements.transactionDeposit.val(0);

        page.dialogs.elements.modalDeposit.modal('show');
    })
        .catch((error) => {
            console.log(error);
        });
}

page.commands.handleAddEventShowModalWithdraw = (customerId) => {

    page.commands.getCustomerById(customerId).then((data) => {
        customer = data;
        page.dialogs.elements.fullNameWithdraw.val(customer.fullName);
        page.dialogs.elements.emailWithdraw.val(customer.email);
        page.dialogs.elements.balanceWithdraw.val(customer.balance);
        page.dialogs.elements.transactionWithdraw.val(0);

        page.dialogs.elements.modalWithdraw.modal('show');
    })
        .catch((error) => {
            console.log(error);
        });
}

page.commands.getRecipients = (customerId) => {
    $.ajax({
        type: 'GET',
        url: page.url.getRecipients + customerId,

    })
        .done((data) => {
            const select = $("#recipientId");
            select.empty();
            $("<option>").val("-1").text('--- Chọn người nhận ---').appendTo("#recipientId");
            data.forEach((item) => {
                $("<option>").val(item.id).text('(' + item.id + ') ' + item.fullName).appendTo("#recipientId");
            });
        })
        .fail((error) => {
            console.log(error);
        })

}

page.commands.handleAddEventShowModalTransfer = (customerId) => {

    page.commands.getCustomerById(customerId).then((data) => {
        if (data != null) {
            page.dialogs.elements.senderId.val(data.id);
            page.dialogs.elements.senderFullName.val(data.fullName);
            page.dialogs.elements.senderEmail.val(data.email);
            page.dialogs.elements.senderBalance.val(data.balance);
            page.commands.getRecipients(customerId);

            page.dialogs.elements.transferAmount.val(0);
            page.dialogs.elements.fees.val(10);


            page.dialogs.elements.modalTransfer.modal('show');

        } else {
            App.showErrorAlert('Không tìm thấy khách hàng');
        }
    })
        .catch((error) => {
            console.log(error);
        });
}

/******************** Handle *************************/
page.dialogs.commands.create = () => {
    locationRegion.id = null;
    locationRegion.provinceId = page.dialogs.elements.provinceCreate.val();
    locationRegion.provinceName = page.dialogs.elements.provinceCreate.find('option:selected').text();
    locationRegion.districtId = page.dialogs.elements.districtCreate.val();
    locationRegion.districtName = page.dialogs.elements.districtCreate.find('option:selected').text();
    locationRegion.wardId = page.dialogs.elements.wardCreate.val();
    locationRegion.wardName = page.dialogs.elements.wardCreate.find('option:selected').text();
    locationRegion.address = page.dialogs.elements.addressCreate.val();

    customer.id = null;
    customer.fullName = page.dialogs.elements.fullNameCreate.val();
    customer.email = page.dialogs.elements.emailCreate.val();
    customer.phone = page.dialogs.elements.phoneCreate.val();
    customer.locationRegion = locationRegion;
    customer.balance = 0;
    customer.deleted = 0;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: "POST",
        url: page.url.createCustomer,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = page.commands.renderCustomer(data);
            page.elements.tbCustomerBody.prepend(str);

            $('#modalCreate').modal('hide');


            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Thêm khách hàng thành công',
                showConfirmButton: false,
                timer: 1500
            })

         

        })
        .fail((error) => {
            console.log(error);
        });
}


page.dialogs.commands.update = () => {
    const provinceId = page.dialogs.elements.provinceUpdate.val();
    const provinceName = page.dialogs.elements.provinceUpdate.find('option:selected').text();
    const districtId = page.dialogs.elements.districtUpdate.val();
    const districtName = page.dialogs.elements.districtUpdate.find('option:selected').text();
    const wardId = page.dialogs.elements.wardUpdate.val();
    const wardName = page.dialogs.elements.wardUpdate.find('option:selected').text();
    const address = page.dialogs.elements.addressUpdate.val();

    locationRegion.provinceId = provinceId;
    locationRegion.provinceName = provinceName;
    locationRegion.districtId = districtId;
    locationRegion.districtName = districtName;
    locationRegion.wardId = wardId;
    locationRegion.wardName = wardName;
    locationRegion.address = address;

    const fullName = page.dialogs.elements.fullNameUpdate.val();
    const email = page.dialogs.elements.emailUpdate.val();
    const phone = page.dialogs.elements.phoneUpdate.val();

    customer.fullName = fullName;
    customer.email = email;
    customer.phone = phone;
    customer.locationRegion = locationRegion;


    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.url.updateCustomer + '/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = page.commands.renderCustomer(data);

            const currentRow = $('#tr_' + customerId);
            currentRow.replaceWith(str);

            page.dialogs.elements.modalUpdate.modal('hide');

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Đã cập nhật thông tin',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((error) => {
            console.log(error);
        })
}


page.dialogs.commands.deposit = (customer, deposit) => {

    if (!isNaN(deposit.transactionAmount)) {
        if (deposit.transactionAmount <= 0) {
            $("#deposit-error").text("Số tiền phải > 0");
        } else {
            if (deposit.transactionAmount > 500000000) {
                $("#deposit-error").text("Số tiền nộp vào mỗi lần không quá 500.000.000");
            } else {

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'PATCH',
                    url: page.url.updateBalance + '/' + customerId,
                    data: JSON.stringify(customer)
                })
                    .done((data) => {

                        const str = page.commands.renderCustomer(data);
                        const currentRow = $('#tr_' + customerId);
                        currentRow.replaceWith(str);

                        $("#balanceDeposit").val(customer.balance);
                        $("#deposit-error").text("");

                        page.dialogs.elements.modalDeposit.modal('hide');

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Nạp tiền thành công',
                            showConfirmButton: false,
                            timer: 1500
                        })

                    })
                    .fail((error) => {
                        console.log(error);
                    })

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'POST',
                    url: page.url.deposit,
                    data: JSON.stringify(deposit)
                })
                    .done((data) => {

                    })
                    .fail((error) => {
                        console.log(error);
                    })
            }
        }
    } else {
        $("#deposit-error").text("Sai định dạng");
    }


}

page.dialogs.commands.withdraw = (customer, withdraw) => {
console.log(deposit.balanceWithdraw,"balance");
console.log(withdraw.transactionAmount,"transaction");
    if (!isNaN(withdraw.transactionAmount)) {
        if (withdraw.transactionAmount <= 0) {
            $("#withdraw-error").text("Số tiền phải > 0");
        } else {
            if (withdraw.transactionAmount > 500000000) {
                $("#withdraw-error").text("Số tiền rút mỗi lần không quá 500.000.000");
            } else {

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'PATCH',
                    url: page.url.updateBalance + '/' + customerId,
                    data: JSON.stringify(customer)
                })
                    .done((data) => {

                        const str = page.commands.renderCustomer(data);
                        const currentRow = $('#tr_' + customerId);
                        currentRow.replaceWith(str);

                        $("#balanceWithdraw").val(customer.balance);
                        $("#withdraw-error").text("");

                        page.dialogs.elements.modalWithdraw.modal('hide');

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Rút tiền thành công',
                            showConfirmButton: false,
                            timer: 1500
                        })

                    })
                    .fail((error) => {
                        console.log(error);
                    })

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'POST',
                    url: page.url.withdraw,
                    data: JSON.stringify(withdraw)
                })
                    .done((data) => {

                    })
                    .fail((error) => {
                        console.log(error);
                    })
            }
        }
    } else {
        $("#withdraw-error").text("Sai định dạng");
    }


}


page.dialogs.commands.transfer = () => {
    page.commands.getCustomerById(customerId).then((data) => {
        let sender = data;
        let senderBalance = sender.balance;
        const transferAmount = +$('#transferAmount').val();
        const fees = 10;
        const feesAmount = transferAmount * fees / 100;
        const transactionAmount = transferAmount + feesAmount;
        const senderNewBalance = senderBalance - transactionAmount;


        const recipientId = +$("#recipientId").val();
        console.log(recipientId);
        page.commands.getCustomerById(recipientId).then((data) => {
            let recipient = data;
            const recipientBalance = recipient.balance;
            const recipientNewBalance = recipientBalance + transferAmount;

            if (sender.id === recipient.id) {
                $("#transfer-name-error").text("Người nhận không hợp lệ");
            } else {

                if (!isNaN(transferAmount)) {
                    if (transferAmount <= 0) {
                        $("#transfer-error").text("Số tiền phải > 0");
                    } else {

                        if (transactionAmount > 500000000) {
                            $("#transfer-error").text("Số tiền giao dịch tối đa 500.000.000");
                        } else {
                            if (transactionAmount > sender.balance) {
                                $("#transfer-error").text("Số dư không đủ để thực hiện giao dịch");
                            } else {

                                sender.balance = senderNewBalance;
                                recipient.balance = recipientNewBalance;

                                transfer = {
                                    senderId: sender.id,
                                    recipientId: recipient.id,
                                    fees,
                                    transferAmount,
                                    feesAmount,
                                    transactionAmount
                                }

                                $.ajax({
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/json'
                                    },
                                    type: 'PATCH',
                                    url: page.url.updateBalance + '/' + recipient.id,
                                    data: JSON.stringify(recipient)
                                })
                                    .done((data) => {
                                        const str = page.commands.renderCustomer(data);
                                        const currentRow = $('#tr_' + recipient.id);
                                        currentRow.replaceWith(str);
                                    })
                                    .fail((error) => {
                                        console.log(error);
                                    })

                                $.ajax({
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/json'
                                    },
                                    type: 'PATCH',
                                    url: page.url.updateBalance + '/' + sender.id,
                                    data: JSON.stringify(sender)
                                })
                                    .done((data) => {
                                        const str = page.commands.renderCustomer(data);
                                        const currentRow = $('#tr_' + sender.id);
                                        currentRow.replaceWith(str);

                                        $("#senderBalance").val(senderNewBalance);
                                        $("#transfer-error").text("");
                                        $("#transfer-name-error").text("");


                                        page.dialogs.elements.modalTransfer.modal('hide');

                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: 'Chuyển tiền thành công',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    })
                                    .fail((error) => {
                                        console.log(error);
                                    })

                                $.ajax({
                                    type: 'POST',
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/json'
                                    },
                                    url: page.url.transfer,
                                    data: JSON.stringify(transfer)
                                })
                            }

                        }
                    }

                } else {
                    $("#transfer-error").text("Sai định dạng");
                }
            }
        });
    })


}

/******************** Delete *************************/

page.commands.handleDeleteCustomer = (customerId) => {

    let cf = confirm('Bạn chắc chắn muốn xoá?');
    if (cf) {

        $.ajax({
            type: 'PATCH',
            url: page.url.deleteCustomer + '/' + customerId,
            data: {
                deleted: 1
            }
        })
            .done(() => {
                $('#tr_' + customerId).remove();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Xóa thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
    }
}
// Validate
page.dialogs.elements.formCreate.validate({
    rules: {
        fullNameCreate: {
            required: true,
            minlength: 5,
            maxlength: 25
        },
        emailCreate: {
            required: true,
            isEmail: true
        },
        phoneCreate: {
            required: true,
            isNumberWithSpace: true
        }
    },
    messages: {
        fullNameCreate: {
            required: 'Vui lòng nhập họ tên đầy đủ',
            minlength: 'Họ tên tối thiểu là 5 ký tự',
            maxlength: 'Họ tên tối đa là 25 ký tự'
        },
        emailCreate: {
            required: 'Vui lòng nhập email đầy đủ',
        },
        phoneCreate: {
            required: 'Vui lòng nhập phone đầy đủ',
        }
    },
    submitHandler: function () {
        page.dialogs.commands.create();
    }
})

$.validator.addMethod("isEmail", function (value, element) {
    return this.optional(element) || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
}, "Vui lòng nhập đúng định dạng email");

$.validator.addMethod("isNumberWithSpace", function (value, element) {
    return this.optional(element) || /^\s*[0-9,\s]+\s*$/i.test(value);
}, "Vui lòng nhập giá trị số");
page.dialogs.elements.formUpdate.validate({
    rules: {
        fullNameUpdate: {
            required: true,
            minlength: 5,
            maxlength: 25
        },
        emailUpdate: {
            required: true,
            isEmail: true
        },
        phoneUpdate: {
            required: true,
            isNumberWithSpace: true
        }
    },
    messages: {
        fullNameUpdate: {
            required: 'Vui lòng nhập họ tên đầy đủ',
            minlength: 'Họ tên tối thiểu là 5 ký tự',
            maxlength: 'Họ tên tối đa là 25 ký tự'
        },
        emailUpdate: {
            required: 'Vui lòng nhập email đầy đủ',
        },
        phoneUpdate: {
            required: 'Vui lòng nhập phone đầy đủ',
        }
    },
    
    submitHandler: function () {
        page.dialogs.commands.update();
    }
})
/** Quản lý các sự kiện */

page.initializeControlEvent = () => {
    page.dialogs.elements.provinceCreate.on('change', function () {
        const provinceId = $(this).val();
        page.commands.onchangeProvince(provinceId, page.dialogs.elements.districtCreate, page.dialogs.elements.wardCreate);
    })
    page.dialogs.elements.districtCreate.on('change', function () {
        const districtId = $(this).val();
        page.commands.getAllWardsByDistrictId(districtId, page.dialogs.elements.wardCreate);
    })

    page.dialogs.elements.provinceUpdate.on('change', function () {
        const provinceId = $(this).val();
        page.commands.onchangeProvince(provinceId, page.dialogs.elements.districtUpdate, page.dialogs.elements.wardUpdate);
    })
    page.dialogs.elements.districtUpdate.on('change', function () {
        const districtId = $(this).val();
        page.commands.getAllWardsByDistrictId(districtId, page.dialogs.elements.wardUpdate);
    })

    page.elements.btnShowModalCreate.on('click', () => {
        page.dialogs.elements.modalCreate.modal('show');
    })

    page.dialogs.elements.btnCreate.on('click', () => {
        page.dialogs.elements.formCreate.trigger('submit');
    })
    page.dialogs.commands.closeModalCreate = () => {
        page.dialogs.elements.formCreate[0].reset();
        page.dialogs.elements.formCreate.validate().resetForm();
    }
    page.dialogs.commands.closeModalUpdate = () => {
        page.dialogs.elements.formUpdate[0].reset();
        page.dialogs.elements.formUpdate.validate().resetForm();
        page.dialogs.elements.formUpdate.find("input.error").removeClass("error");
    }
    page.dialogs.commands.closeModalDeposit = () => {
        page.dialogs.elements.formDeposit[0].reset();
        
    }
    page.dialogs.commands.closeModalWithdraw = () => {
        page.dialogs.elements.formWithdraw[0].reset();
    }
    page.dialogs.commands.closeModalTransfer = () => {
        page.dialogs.elements.formTransfer[0].reset();
    }

    page.elements.tbCustomerBody.on('click', '.edit', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalUpdate(customerId);
    })

    page.elements.tbCustomerBody.on('click', '.deposit', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalDeposit(customerId);
    })
    page.elements.tbCustomerBody.on('click', '.withdraw', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalWithdraw(customerId);
    })
    page.elements.tbCustomerBody.on('click', '.transfer', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalTransfer(customerId);
    })
    page.elements.tbCustomerBody.on('click', '.delete', function () {
        customerId = $(this).data('id');
        page.commands.handleDeleteCustomer(customerId);
    })


    /** Update */

    page.dialogs.elements.btnUpdate.on('click', () => {
        page.dialogs.elements.formUpdate.trigger("submit");
    })
    /** Deposit */

    page.dialogs.elements.btnDeposit.on('click', () => {
        const currentBalance = customer.balance;
        const transactionAmount = +$("#transactionDeposit").val();
        const newBalance = currentBalance + transactionAmount;
        customer.balance = newBalance;

        deposit.id = null;
        deposit.customerId = customerId;
        deposit.transactionAmount = transactionAmount;

        page.dialogs.commands.deposit(customer, deposit);
    })

    /** Withdraw */

    page.dialogs.elements.btnWithdraw.on('click', () => {
        const currentBalance = customer.balance;
        const transactionAmount = +$("#transactionWithdraw").val();
        const newBalance = currentBalance - transactionAmount;
        customer.balance = newBalance;

        withdraw.id = null;
        withdraw.customerId = customerId;
        withdraw.transactionAmount = transactionAmount;

        page.dialogs.commands.withdraw(customer, withdraw);
    })
    /** Transfer */

    page.dialogs.elements.btnTransfer.on('click', () => {

        page.dialogs.commands.transfer();
    })


    /** Đóng modal: reset form */
    page.dialogs.elements.modalCreate.on("hidden.bs.modal", function () {
        page.dialogs.commands.closeModalCreate();
    })

    page.dialogs.elements.modalUpdate.on("hidden.bs.modal", function () {
        page.dialogs.commands.closeModalUpdate();
       
    })

    page.dialogs.elements.modalDeposit.on("hidden.bs.modal", function () {
        page.dialogs.commands.closeModalDeposit();
        
    })
}

page.loadData = () => {
    page.commands.getAllCustomers();

    page.commands.getAllProvinces().then(() => {
        const provinceId = page.dialogs.elements.provinceCreate.val();

        page.commands.getAllDistrictsByProvinceId(provinceId, page.dialogs.elements.districtCreate).then(() => {
            const districtId = page.dialogs.elements.districtCreate.val();

            page.commands.getAllWardsByDistrictId(districtId, page.dialogs.elements.wardCreate);
        });
    });
}

/**  Window onload **/

$(() => {
    page.loadData();

    page.initializeControlEvent();
    

})
