
let maxId = 1;
let customers = [
    {
        "id": maxId++,
        "fullName": "Nhung",
        "email": "nhung@gmail.com",
        "phone": "123456",
        "address": "Huế",
        "balance": 0,
        "deleted": 0
    },
    {
        "id": maxId++,
        "fullName": "Nhân",
        "email": "nhan@gmail.com",
        "phone": "456789",
        "address": "Huế",
        "balance": 35000,
        "deleted": 0
    }
]


function findMaxId(customers) {
    let maxId = 0;
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id > maxId) {
            maxId = customers[i].id;
        }
    }
    return ++maxId;
}

function renderCustomer(obj) {
    return `<tr>
        <td>${obj.id} </td>
        <td>${obj.fullName} </td>
        <td>${obj.email} </td>
        <td>${obj.phone} </td>
        <td>${obj.address} </td>
        <td>${obj.balance}</td>
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

function getAllCustomers() {
    // if (localStorage.getItem("usersData") != null){
    //     customers = JSON.parse(localStorage.getItem("usersData"));
    // }
    
    const tbCustomerBody = document.querySelector("#tbCustomer tbody");
    tbCustomerBody.innerHTML = "";
    customers.forEach(item => {
        const str = renderCustomer(item);
        tbCustomerBody.innerHTML += str;
    });
}

getAllCustomers();


// /******************** Create *************************/
function handleCreate() {
    const btnCreate = document.getElementById("btnCreate");
    btnCreate.addEventListener("click", function () {

        let id = findMaxId(customers);
        const fullName = document.getElementById("fullNameCreate").value;
        const email = document.getElementById("emailCreate").value;
        const phone = document.getElementById("phoneCreate").value;
        const address = document.getElementById("addressCreate").value;

        const c = new Customer(id, fullName, email, phone, address, 0, 0);

        customers.push(c);
        //localStorage.setItem("usersData", JSON.stringify(customers));

        getAllCustomers();
        addEventDeleteCustomer();
        addEventShowModalUpdate();
        addEventShowModalDeposit();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Thêm thành công',
            showConfirmButton: false,
            timer: 1500
        })
       
        let formValue = document.getElementsByClassName("form-control");
        for (var i = 0; i < formValue.length; i++) {
            formValue[i].value = "";
        }
    });
}
handleCreate()

/******************** Find *************************/
function getCustomerById(id) {
    // return customers.find(item => item.id == id);
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id == id) {
            return customers[i];
        }
    }
    return null;
}

function findCustomerIndexById(id) {
    let index = -1;

    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
            index = i;
        }
    }

    return index;
}
/******************** Show Update *************************/

function addEventShowModalUpdate() {
    const btnUpdate = document.querySelectorAll(".edit");
    btnUpdate.forEach((item) => {
        item.addEventListener("click", function () {
            customerId = +item.getAttribute("data-id");
            const customer = getCustomerById(customerId);

            document.getElementById("fullNameUpdate").value = customer.fullName;
            document.getElementById("emailUpdate").value = customer.email;
            document.getElementById("phoneUpdate").value = customer.phone;
            document.getElementById("addressUpdate").value = customer.address;

            const modalUpdate = new bootstrap.Modal(document.getElementById('modalUpdate'), {
                keyboard: false
            })
            modalUpdate.show();
        
        })
    })
}

addEventShowModalUpdate()

/******************** Update *************************/

function handleUpdateCustomer() {
    const btnUpdate = document.getElementById('btnUpdate');
    btnUpdate.addEventListener('click', function () {

        const fullName = document.getElementById('fullNameUpdate').value;
        const email = document.getElementById('emailUpdate').value;
        const phone = document.getElementById('phoneUpdate').value;
        const address = document.getElementById('addressUpdate').value;
        const c = getCustomerById(customerId);
        const balance = c.balance;
        const customer = {
            id: customerId,
            fullName,
            email,
            phone,
            address,
            balance,
            deleted: 0
        }

        const index = findCustomerIndexById(customerId);

        customers[index] = customer;
        getAllCustomers();
        addEventShowModalUpdate();
        addEventDeleteCustomer();
        addEventShowModalDeposit();


        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cập nhật thành công',
            showConfirmButton: false,
            timer: 1500
        })


    })
}

handleUpdateCustomer()



/******************** Delete *************************/

function addEventDeleteCustomer() {
    const btnDelete = document.querySelectorAll(".delete");

    btnDelete.forEach((item) => {
        item.addEventListener("click", function () {
            customerId = +item.getAttribute("data-id");
            let cf = confirm("Bạn chắc chắn muốn xoá?");
            if (cf) {
                for (var i = 0; i < customers.length; i++) {
                    if (customers[i].id === customerId) {
                        customers.splice(i, 1);
                    }
                }
            }
            getAllCustomers();
            addEventShowModalUpdate();
            addEventDeleteCustomer();
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Xóa thành công',
            showConfirmButton: false,
            timer: 1500
        })

        });
    });
}

addEventDeleteCustomer();        
/******************** Show Modal Deposit *************************/

function addEventShowModalDeposit() {
const btnDeposit = document.querySelectorAll(".deposit");

btnDeposit.forEach((item) => {
item.addEventListener("click", function () {
    customerId = +item.getAttribute("data-id");
    var customer = getCustomerById(customerId);
    document.getElementById("fullNameDeposit").value = customer.fullName;
    document.getElementById("emailDeposit").value = customer.email;
    document.getElementById("balanceDeposit").value = customer.balance;
    // document.getElementById("transactionDeposit").value = 0;

    const modalDeposit = new bootstrap.Modal(document.getElementById('modalDeposit'), {
        keyboard: false
    })
    modalDeposit.show()
})
})

}
addEventShowModalDeposit();