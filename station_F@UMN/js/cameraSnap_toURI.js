////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*------------------------OLD-------------------------*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*-------------------------CAMERA STUFF-------------------------*/
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

window.onload=()=>{
    activateCamera();
    jQuery($("#webcam")[0]).on("click", ()=>{cam_caputeImg()});
};

var cameraActive = false;

function activateCamera(){
    cameraActive = true;
    webcam.start().then(result =>{
        console.log("webcam started");
    }).catch(err => {
        console.log(err);
    });
}
function deactivateCamera(){
    cameraActive = false;
    webcam.stop();
    document.getElementById("cameraStatus_meta").setAttribute("content","unactive");
}
var timestamp_picName = "";
function cam_caputeImg(){
    var photo = webcam.snap();
    $("#webcam")[0].style.display = "none";
    $("#imagePlaceholder")[0].style.display = "block";
    $("#imagePlaceholder")[0].src = photo;
    $("#headerImage")[0].src = photo;
    $("#uri_hiddenInput")[0].value = "'"+   photo+"'";
    createTimestamp();
    deactivateCamera();
    submitImgWrapper(photo);
}

function createTimestamp(){
    var clock = new Date();
    timestamp_picName = clock.getFullYear()+"-"+(clock.getMonth()+1)+"-"+clock.getDate()+"_"+clock.getHours()+"_"+clock.getMinutes()+"_"+clock.getSeconds()+"_"+clock.getMilliseconds()+".png";
    jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value",timestamp_picName);
    return timestamp_picName;
}




/*-------------------------IMG RESIZING STUFF-------------------------*/
$(document).ready(function() {
    $('#imageFile').change(function(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

//For QR codes: min px size 100X100 for the actual code

var MAX_WIDTH = null;
var MAX_HEIGHT = null;

var iphoneDelay = 300;
var globalURI = null;
function ResizeImage(uri, callback) {

    //------------Convert the URI back to a file Object------------//
    var fileType = uri.substring(uri.indexOf(":")+1, uri.indexOf(";"))

    var myBlob = dataURItoBlob(uri);

    var file = new File([myBlob], fileType.replaceAll("/",".") /*'image.jpeg'*/, {
        type: myBlob.type,
    });


    //------------------------------------------------------------//


    if (window.File && window.FileReader && window.FileList && window.Blob) {
        /*var filesToUploads = document.getElementById('imageFile').files;
        var file = filesToUploads[0];*/
        if (file) {
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e) {
                setTimeout(()=>{
                    var img = document.createElement("img");
                    img.src = e.target.result;
                    console.log("width : "+ img.width +"px, height: " + img.height +"px");
                    var canvas = document.createElement("canvas");
                    //document.body.appendChild(canvas);
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    var width = img.width;
                    var height = img.height;
                    if(device == "webpage"){
                        MAX_WIDTH = 2500;
                        MAX_HEIGHT = 2500;
                    }else{
                        MAX_WIDTH = 400;
                        MAX_HEIGHT = 400;
                    }
                    var resizeNeeded = false;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                            resizeNeeded = true;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                            resizeNeeded = true;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    setTimeout(()=>{
                        if(resizeNeeded){
                            console.log("Image found to be too big! Scaling down and resaving URI...");
                            //canvas.style = "background-color:blue";
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, width, height);
                            var smallerURI = canvas.toDataURL(file.type);
                            //document.getElementById('output').src = dataurl;
                            var newImg = document.createElement("img");
                            setTimeout(()=>{
                                newImg.src = smallerURI;
                                console.log("new image width : "+ newImg.width +"px, height: " + newImg.height +"px");
                                jQuery($("#uri_hiddenInput")[0]).attr("value", "\'"+smallerURI+"\'");
                                console.log("~Re-sized URI storage successful~");

                                console.log(uri);
                                globalURI = uri;
                                callback();
                            },iphoneDelay);
                        }else{
                            console.log("Image found to be within acceptable size bounds");
                            //console.log(uri);
                            globalURI = uri;
                            callback();
                        }
                    },iphoneDelay);
                },iphoneDelay);
            }
            reader.readAsDataURL(file);
        }

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
function submitImgWrapper(uri){
    console.log("Determining if image is too large to be POST-ed...");
    ResizeImage(uri, ()=>{
        c("URI being posted from the frontend: "+ uri.substring(0,50)+"...");

        incrementObjNum(()=>{
            getObjNum(()=>{
                $.post("/donate", {command: "beginDontaion", objNum: objectNum, uri: globalURI, imgPath: "obj"+objectNum+".png", bin: activeBin[0]});        
                initializeCheck();
            });
        });
    });
}

















