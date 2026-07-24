
const url = "http://localhost:3000/contacts";
 async function DisplayDetails()
 {
    
    

    var response = await fetch(url)

      const data =await response.json();
      var row = "";
     data.forEach((contact) => {
      row += `<tr><td>${contact.name}</td> <td> ${contact.phone}</td> <td>${contact.email}</td>
      <td> <button class="edit" onclick="EditData('${contact.id}','${contact.name}','${contact.phone}','${contact.email}')">Edit</button> <button class="delete" onclick="DeleteData('${contact.id}')">Delete</button></td></tr>`;
     });
    
    document.getElementById("result").innerHTML = row;

    console.log(data)
    
}
DisplayDetails();

 async function SaveData() {
    
    var id = document.getElementById("contactid").value;
    var name = document.getElementById("name").value;

    var phone = document.getElementById("phone").value;

    var email = document.getElementById("email").value;

    var contact = {
      name,
      phone,
      email,
    }
if(id==="")
        {
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(contact)
    });
}
    else{
         await fetch(url+"/"+id, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(contact),
       });
    }
    
console.log(id);
Clear();
DisplayDetails();
    
}

async function EditData(id,name, phone, email)

{
    document.getElementById("contactid").value=id;
    document.getElementById("name").value = name;
    document.getElementById("phone").value = phone;
    document.getElementById("email").value = email;
    
}
async function DeleteData(id) {
  await fetch(url + "/" + id, {
    method: "Delete"
  
  });
  DisplayDetails();
}
async function Clear() {
  
  document.getElementById("contactid").value = "";

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
}


    

 

 
 