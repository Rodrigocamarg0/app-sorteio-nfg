//const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const painelConteudo = document.getElementById("painelConteudo");

const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

const notaId = document.getElementById("nota-id");

const alertDiv = document.getElementById("alert-warning");
const alertMsg = document.getElementById("alert-message");

alertDiv.hidden = true;

let scanning = false;

qrcode.callback = res => {
  if (res) {
    //outputData.innerText = res;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    alertDiv.hidden = true;

    console.log(res);
    let linkArray = res.split(".aspx?p=");
    let sefazID = linkArray[linkArray.length - 1];
    //let sefazAPI = `${window.location.host}/api/sefaz/${sefazID}`
    let sefazAPI = `/api/sefaz/${sefazID}`

    console.log(sefazAPI);

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        //Use parse() method to convert JSON string to JSON object
        var responseJsonObj = JSON.parse(this.responseText);

        console.log(responseJsonObj.valor_total);

        valor_total = responseJsonObj.valor_total
        outputData.innerText = `\n${responseJsonObj.loja}\n${responseJsonObj.data}\n${responseJsonObj.nome}\n${responseJsonObj.cpf}`;
        notaId.innerText = responseJsonObj.codigo.split("|")[0];
        qrResult.hidden = false;
        canvasElement.hidden = true;
        btnScanQR.hidden = false;

      }
      else {
        var responseJsonObj = JSON.parse(this.responseText);
        canvasElement.hidden = true;
        btnScanQR.hidden = false;
        alertDiv.hidden = false;
        alertMsg.innerHTML = responseJsonObj.message;
      }
    };


    xmlhttp.open("GET", `/api/sefaz/cadastrar/${sefazID}`, true);
    xmlhttp.send();


  }
  return res;
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
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
