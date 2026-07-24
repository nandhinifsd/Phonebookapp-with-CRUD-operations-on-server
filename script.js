const secdisplay=document.querySelectorAll(".section");
const operationbutton=document.querySelectorAll(".operation-btn");
const keypadbtn=document.querySelectorAll(".keypad-btn");
const display=document.querySelector("#Display");
const keypadsec=document.querySelector("#keypad-section");
const contactsec=document.querySelector("#contact-section");
const displaycontacts=document.getElementById("displaycontacts");
const list=document.querySelector(".contactslist");
const fav_list=document.querySelector(".fav-contactslist")
let card=document.querySelector(".contact-card");
let call_window=document.querySelector(".calling-card");
let form=document.querySelector(".addcontact-form");
//let phonebook_window=document.querySelector(".phonebook");
let current_source;
let contacts=[];
let newcontact=[];
//let img="";
let image_flag=false;
const url=`https://phonebookapp-api.onrender.com/contacts`;
 initialiseEvents();

async function initialiseEvents()
{
  let phoneno=document.querySelector("#phoneno");
  const backspace=document.querySelector("#backspace-btn");
  const closebtn=document.querySelector(".close-btn"); 
const endcall=document.querySelector(".end-btn");
//initial display
secdisplay[0].style.display="flex";
secdisplay[1].style.display="none";
secdisplay[2].style.display="none";
displaykeypad();
//keeping contacts in db nas cache in contacts variable 
 try {
        await refreshContacts();
    } catch (err) {
        console.error(err);
    }
    newcontact=[];
    current_source="";
//kepad,phonebook and favourites switching
  for(let i=0;i<operationbutton.length;i++)
    {
  operationbutton[i].addEventListener("click",function(){
    switch(operationbutton[i].value){
      case "Keypad":showsection("keypad")
                    break;
      case "Phonebook":showsection("phonebook")
                    break;
      case "Favourites":showsection("favourites")
                    break;
        default:showsection("keypad")
                    break;
                    
    }
  });
  
}
//event listener for kepad buttons
for(let i=0;i<keypadbtn.length;i++)
 {
    keypadbtn[i].addEventListener("click",function(){
        phoneno.value += keypadbtn[i].value;
        keypadsuggestion(contacts);

    });
    
 }
//event listener for backspace button in keypad
 backspace.addEventListener("click",function(){
   phoneno.value=phoneno.value.slice(0,-1);
 });
 //eventlistener for search in phonebook tab
 let search=document.getElementById("search");
 search.addEventListener("keypress",function(){
   console.log(contacts);
  suggestions(search.value,contacts,"phonebook");
 });
 // //eventlistener for search in favourites tab
  let fav_search=document.getElementById("fav-search");
  fav_contacts=contacts.filter(data=>data.favourite=="true");
 
 fav_search.addEventListener("keypress",function(){
   console.log(fav_contacts);
    suggestions(fav_search.value,fav_contacts,"favourites");
 });
 //event listener for close btn in the card
  closebtn.addEventListener("click",function(){
          closecard();
  });
  //event listener for end call btn in calling card
  endcall.addEventListener("click",function()
{
if (current_source=="card")
    {
        console.log("entered endcall")
        call_window.style.display="none";
           card.style.display="flex";
           secdisplay[0].style.display="none";
     
    }
    else if(current_source=="keypad")
    {
      console.log("entered endcall")
      call_window.style.display="none";
        secdisplay[0].style.display="flex";
        card.style.display="none";
       
    }
});

//

//event listener for uploading img into webpage and display it in preview

imageinput=document.getElementById("contactImage");
photo=document.getElementById("profile-img")
imageinput.addEventListener("change",function()
{ 
        const file = this.files[0];
        if (!file) 
        {
          image_flag=false;
          return;
          }
        const reader = new FileReader();
    reader.onload = function () {
      let img = reader.result;
      photo.src=img;
      image_flag=true;
    };

    reader.readAsDataURL(file);
    img="";
  
});
//event listener for close button in contact form
 let close=document.getElementById("closeform");
  close.addEventListener("click",function(){
    closeform();
  });
  //event listener for save button in contact form
  let submit=document.getElementById("updateDB");
  submit.addEventListener("click",updateData);
  //event listener for edit button on the card
  let editbtn=document.querySelector(".edit-btn");
  editbtn.addEventListener("click",function(){
     let initial=document.querySelector(".initial");
    let contactname=document.querySelector(".contactcardname");
      let phoneno=document.querySelector(".phonenum");
        let emailid=document.querySelector(".emailid");
        let idlabel=document.querySelector(".hidden");
        let propic="";
        if(image_flag==true)
        {
          let cardimg=document.querySelector(".profile-image");
          console.log(document.querySelector(".profile-image"));
          console.log(propic);
           propic=cardimg.src;
        }
               
        console.log(initial.innerText,contactname.innerText,phoneno.innerText,emailid.innerText,idlabel.innerText,propic);
        editData(initial.innerText,contactname.innerText,phoneno.innerText,emailid.innerText,idlabel.innerText,propic);
  });
  //eventlistener for delete button on the card
  let delbtn=document.querySelector(".delete-btn");
   delbtn.addEventListener("click",function(){
    console.log("delete action recieved");
    let idlabel=document.querySelector(".hidden");
    delData(idlabel.innerText);
  });
  

}

/*function fetchdata()
{
 var db_contacts;
 await fetch(url)
  .then(response=>response.json())
  .then(data=>db_contacts=data)
  return db_contacts;
}*/
async function fetchData() {
    const response = await fetch(url);
    const db_contacts = await response.json();
    return db_contacts;
}
async function refreshContacts() {
    contacts = await fetchData();
}
async function updateData()
{
 console.log("updated");
 let favourite="";
 let id=document.getElementById("contact-id").value;
 let firstname=document.getElementById("Firstname").value;
 let lastname=document.getElementById("Lastname").value;
 let phone=document.getElementById("Phonenumber").value;
 let email=document.getElementById("Emailid").value;
 let fav=document.getElementById("favourite-contact").checked;
 
 if (fav==true)
  favourite="true";
 
 else
  favourite="false";
img="";
if(image_flag==true)
{
  let img=document.getElementById("profile-img").src;
}

 
 console.log(favourite);
console.log(img);
 newcontact={firstname,lastname,phone,email,img,favourite};
 if(id=="")
   {
   const response= await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(newcontact)
    });
    console.log(response.status);

    const text = await response.text();
    console.log(text);
    //const result = await response.json();
    
   // console.log(result);
}
else
  {
        const response= await fetch(url+"/"+id, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(newcontact),
       });
       console.log(response.status);
      const text = await response.text();
        console.log(text);
      //  const result = await response.json();
       //   console.log(result);
      }
      
      await refreshContacts();
      closeform();
  
      
}

async function editData(initial,firstname,phone,email,id,img)
{
  console.log(img);
  card.style.display="none";
  form.style.display="flex";
  document.getElementById("Firstname").value=firstname;
  document.getElementById("Phonenumber").value=phone;
  document.getElementById("Emailid").value=email;
  document.getElementById("contact-id").value=id;
  if(img)
  document.getElementById("profile-img").src=img;


   checkbox=document.getElementById("favourite-contact");
  await refreshContacts();
 let edit_contact=contacts.filter(data=>data.id==id);
 console.log(edit_contact)
 if(edit_contact[0].favourite=="true")
checkbox.checked=true;
else
checkbox.checked=false;
}

async function delData(id)
{
 const response=await fetch(url + "/" + id, {
    method: "DELETE"
  
  });
   const result = await response.json();
    console.log(result);
    await refreshContacts();
    closecard();

}





//display keypad,phonebook,favourites,card,callingcard
function displaykeypad()
{
var list=document.querySelector(".keypad-suggestions")
 list.innerHTML="";
phoneno.value="";
}

function displayphonebook()
{
   console.log(displaycontacts);
  list.innerHTML="";
  contacts.forEach(item=>{
    let contact=document.createElement("li")
  contact.innerHTML= `<h1 class="contactname">${item.firstname}</h1><hr>`;
  contact.addEventListener("click",function(){
    secdisplay[1].style.display="none";
    //phonebook_window.style.display="none";
    displaycontactcard(item.firstname,item.phone,item.email,item.img,item.id,"phonebook");
  });
  list.appendChild(contact);
  })
  
  }

  function displayfavourites()
{
  fav_list.innerHTML="";
   let fav_data=contacts.filter(obj=>obj.favourite==="true")
  fav_data.forEach(item=>{
    let contact=document.createElement("li")
  contact.innerHTML= `<h1 class="contactname">${item.firstname}</h1><hr>`;
  contact.addEventListener("click",function(){
    secdisplay[2].style.display="none";
  // phonebook_window.style.display="none";
    displaycontactcard(item.firstname,item.phone,item.email,item.img,item.id,"favourites");
  });
  fav_list.appendChild(contact);
  })
  

}
 
function displaycontactcard(name,phone,email,contactimg,id,source)
{
  
  let initial=document.querySelector(".initial");
    let contactname=document.querySelector(".contactcardname");
      let phoneno=document.querySelector(".phonenum");
        let emailid=document.querySelector(".emailid");
        let idlabel=document.querySelector(".hidden");
        
        current_source=source;
        card.style.display="flex";
            initial.innerHTML="";
        if(contactimg)
        {
          let image=document.createElement("img");
          image.classList.add("profile-image");
          image.src=contactimg;
          image_flag=true;
          initial.appendChild(image);
        }
        else
        {
           initial.innerHTML=name[0];
           image_flag=false;
        }
       
        contactname.innerHTML=name;
        phoneno.innerHTML=phone;
        emailid.innerHTML=email;
        idlabel.innerHTML=id;
        idlabel.style.display="none";
        
}

function closecard(){
   card.style.display="none";
  
  showsection(current_source);
}
function closeform()
{
  document.getElementById("Firstname").value="";
  document.getElementById("Lastname").value="";
  document.getElementById("Phonenumber").value="";
  document.getElementById("Emailid").value="";
  document.getElementById("contact-id").value="";
  document.getElementById("favourite-contact").checked=false;
  let photo=document.getElementById("profile-img");
  photo.src="";
  form.style.display="none";
  
  showsection(current_source);
}
function showsection(source)
{
  switch(source)
  {
    case "keypad":secdisplay[0].style.display="flex";
                    secdisplay[1].style.display="none";
                    secdisplay[2].style.display="none";
                    displaykeypad();
                    break;
    case "phonebook":secdisplay[1].style.display="flex";
                    secdisplay[0].style.display="none";
                    secdisplay[2].style.display="none";
                    displayphonebook();
                    break;
    case "favourites":secdisplay[2].style.display="flex";
                    secdisplay[0].style.display="none";
                    secdisplay[1].style.display="none";
                    displayfavourites();
                    break;
     default:secdisplay[0].style.display="flex";
                    secdisplay[1].style.display="none";
                    secdisplay[2].style.display="none";
                    displaykeypad();
                    break;
                    


  }
}


function calling(source)
{   
  let call_name=document.querySelector(".callingcardname");
  
  call_window.style.display="flex";
 
  if(source=="card")
  {
     card.style.display="none";
     console.log(card.style.display);
    let name=document.querySelector(".contactcardname").textContent;
      call_name.innerText=name;
      
  }
  else if(source=="keypad")
  {
    secdisplay[0].style.display="none";
    let phone=document.querySelector("#phoneno");
    call_name.innerText=phone.value; 
    
  }
current_source=source;

}

 function keypadsuggestion(data)
{
  let phone=document.querySelector("#phoneno");
  var list=document.querySelector(".keypad-suggestions")
 list.innerHTML="";
 list.style.display = "none";
 let ph_count=phone.value.length;
    for(let i=0;i<data.length;i++)
    {
      console.log(data[i].phone.slice(0,ph_count));
     if(phone.value===data[i].phone.slice(0,ph_count))
      {
        list.style.display="flex";
        let item=document.createElement("li");
        item.innerHTML=`<h6>${data[i].firstname}</h6><p>${data[i].phone}<p>`;
        item.addEventListener("click",function(){
          secdisplay[0].style.display="none";
          displaycontactcard(data[i].firstname,data[i].phone,data[i].email,data[i].img,data[i].id,"keypad");
        });
        list.append(item);
      }
    }
  }
  function suggestions(value,data,tab)
  {
    let suggest_list;
    if(tab=="phonebook")
    {
       suggest_list=document.querySelector(".suggestions");
     
    }
    else
    {
       suggest_list=document.querySelector(".fav-suggestions");
     
    }
     suggest_list.innerHTML="";
      suggest_list.style.display="none";
      let char_count=value.length;
      for(let i=0;i<data.length;i++)
      {
        console.log(data[i].firstname.slice(0,char_count));
        if(value.toLowerCase()==data[i].firstname.slice(0,char_count).toLowerCase())
      {
        suggest_list.style.display="flex";
        let item=document.createElement("li");
        item.innerHTML=`<h6>${data[i].firstname}</h6>`;
        item.addEventListener("click",function(){
           suggest_list.style.display = "none";
          suggest_list.innerHTML = "";
          if(tab=="phonebook")
          {
              secdisplay[1].style.display="none";
              document.getElementById("search").value="";
              displaycontactcard(data[i].firstname,data[i].phone,data[i].email,data[i].img,data[i].id,"phonebook");
          }
          else
          {
            secdisplay[2].style.display="none";
             document.getElementById("fav-search").value="";
            displaycontactcard(data[i].firstname,data[i].phone,data[i].email,data[i].img,data[i].id,"favourites");
          }
          
          
        });
        suggest_list.appendChild(item);

      }

    }
  }
function addcontact(source)
{
  current_source=source;
    console.log("inside addcontact function",source)
  if(current_source=="keypad")
  {
    let phone=document.querySelector("#phoneno");
    secdisplay[0].style.display="none";
    form.style.display="flex";
    document.getElementById("Phonenumber").value=phone.value;
  }
  else if(current_source=="phonebook")
  {
    secdisplay[1].style.display="none";
    form.style.display="flex";

  }
  else if(current_source=="favourites")
  {
    secdisplay[2].style.display="none";
    form.style.display="flex";
    document.getElementById("favourite-contact").checked=true;
  }
  
 photo=document.getElementById("profile-img")
 photo.src="";
}