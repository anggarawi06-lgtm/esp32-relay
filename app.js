showPage("dashboard")

function showPage(p){

document.querySelectorAll(".page").forEach(e=>e.style.display="none")

document.getElementById(p).style.display="block"

}

const client=mqtt.connect(
"wss://69d8e81e8ba74d11b1bfa060701cf556.s1.eu.hivemq.cloud:8884/mqtt",
{
username:"hivemq.webclient.1772948203432",
password:"?d6OcSIy38T@0;ojDV,u"
}
)

let tempData=[]
let soilData=[]
let labels=[]

const tempChart=new Chart(document.getElementById("tempChart"),{
type:"line",
data:{labels:labels,datasets:[{label:"Suhu",data:tempData}]}
})

const soilChart=new Chart(document.getElementById("soilChart"),{
type:"line",
data:{labels:labels,datasets:[{label:"Soil",data:soilData}]}
})

client.on("connect",function(){

client.subscribe("rumah/suhu")
client.subscribe("rumah/kelembapan")
client.subscribe("rumah/tanah")
client.subscribe("rumah/rfid")

})

client.on("message",function(topic,message){

let data=message.toString()

if(topic=="rumah/suhu"){

document.getElementById("temp").innerHTML=data

labels.push("")
tempData.push(data)

if(labels.length>20){
labels.shift()
tempData.shift()
}

tempChart.update()

}

if(topic=="rumah/kelembapan"){

document.getElementById("hum").innerHTML=data

}

if(topic=="rumah/tanah"){

document.getElementById("soil").innerHTML=data

soilData.push(data)

if(soilData.length>20){
soilData.shift()
}

soilChart.update()

}

if(topic=="rumah/rfid"){

document.getElementById("rfidStatus").innerHTML=data

let row=document.createElement("tr")

row.innerHTML="<td>"+data+"</td><td>Scan</td><td>"+new Date().toLocaleTimeString()+"</td>"

document.getElementById("history").prepend(row)

}

})

function openDoor(){

client.publish("doorlock/open","1")

}

let cards=[]

function addCard(){

let uid=document.getElementById("uidInput").value

cards.push(uid)

updateCards()

client.publish("doorlock/add",uid)

}

function removeCard(i){

client.publish("doorlock/delete",cards[i])

cards.splice(i,1)

updateCards()

}

function updateCards(){

let table=document.getElementById("cardList")

table.innerHTML=""

cards.forEach((c,i)=>{

table.innerHTML+=`

<tr>
<td>${c}</td>
<td><button onclick="removeCard(${i})">Hapus</button></td>
</tr>
`

})

}

function changeLogin(){

let u=document.getElementById("newUser").value
let p=document.getElementById("newPass").value

localStorage.setItem("user",u)
localStorage.setItem("pass",p)

alert("Login changed")

}
