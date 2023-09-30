console.log("hello world");
function changeImage(newSource){document.getElementById("myImage").src = newSource;}
var array = [1,2,3,4,5,6,7,8,9];


function removeCat(headerType, input){
    document.getElementById(headerType + "Cat").style = "display: none";
    document.getElementById(headerType).innerHTML = ( headerType=="PN"?"Part Name: ":headerType=="PL"?"Part Location: ": headerType=="PC"?"Part Category: " : headerType=="DES"?"Description : " : "Part Tags: ") + input;
    document.getElementById(headerType).style = "font-size: 15px";
}

function addCat(headerType){
    document.getElementById(headerType).style = "";
    document.getElementById(headerType + "Cat").style = "display: inline-block";
    document.getElementById(headerType).innerHTML = ( headerType=="PN"?"Part Name: ":headerType=="PL"?"Part Location: ": headerType=="PC"?"Part Category: " : headerType=="DES"?"Description : " : "Part Tags: ");
}

function callBackEnd(){
    fetch("/getX").then((res)=>(res.json())).then((data)=>{console.log("Fetch Complete!: " + data.value)});
}

function fetchStuff(input){
    if(input == "PL"){
        removeCat("PL", activeBin[0]);
    }else{
        fetch("/get" + input).then((res)=>(res.json())).then((data)=>{
            removeCat(input, data.value);
            if(input == "PC"){
                document.getElementById("PartAdded").style = "display: inline-block";
            }
        });
    }
    
}

function addAllCats(){
    addCat("PN");
    addCat("PL");
    addCat("PC");
    addCat("DES");
    addCat("PT");
}

/*setTimeout(()=>{
    //Part Name is returned!
    fetchStuff("PN");
},1000);
setTimeout(()=>{
    //Part Tags is returned!
    fetchStuff("PT");
},2000);
setTimeout(()=>{
    //Part Catagory is returned!
    fetchStuff("PC");
},3000);
setTimeout(()=>{
    //Part Details is returned!
    fetchStuff("DES");
},4000);
setTimeout(()=>{
    //Part Location is returned!
    fetchStuff("PL");
},5000);
setTimeout(()=>{
    //Add all CATS
    addAllCats();
},6000);*/