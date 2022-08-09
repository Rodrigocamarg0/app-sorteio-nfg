//const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const painelConteudo = document.getElementById("painelConteudo");

const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

qrcode.callback = res => {
  if (res) {
    //outputData.innerText = res;
    
    console.log(res);
    let linkArray = res.split(".aspx?p=");
    let sefazID = linkArray[linkArray.length - 1];
    //let sefazAPI = `${window.location.host}/api/sefaz/${sefazID}`
    let sefazAPI = `http://127.0.0.1:3000/api/sefaz/${sefazID}`
    
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    console.log(sefazAPI)
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        //Use parse() method to convert JSON string to JSON object
        var responseJsonObj = JSON.parse(this.responseText);

        console.log( responseJsonObj.valor_total );
        
        valor_total = responseJsonObj.valor_total
        outputData.innerText = `\n${responseJsonObj.loja}\nR$ ${responseJsonObj.valor_total}\n${responseJsonObj.data}`;
      }
    };

    var getNotaxmlhttp = new XMLHttpRequest();
    
    getNotaxmlhttp.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        //Use parse() method to convert JSON string to JSON object
        var responseJsonObj = JSON.parse(this.responseText);

        painelConteudo.innerHTML = responseJsonObj.html;
      }
    };

    xmlhttp.open("GET", `/api/sefaz/${sefazID}`, true);
    xmlhttp.send();

    getNotaxmlhttp.open("GET", `/api/sefaz/getNota/${sefazID}`, true);
    getNotaxmlhttp.send();

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    painelConteudo.hidden = false;



  
    
    
    // fetch(sefazAPI, { method: 'GET', mode: 'no-cors'}).then(response => {
    //   console.log(response.valor_pago);
    //   return response.json();
    // }).then(data => {
    //   // Work with JSON data here
    //   console.log(data);
    // }).catch(err => {
    //   // Do something for an error here
    //   console.log("Error Reading data " + err);
    // });

    
  }
  return res;
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      painelConteudo.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    console.log(qrcode.decode())
  } catch (e) {
    setTimeout(scan, 300);
  }
}
