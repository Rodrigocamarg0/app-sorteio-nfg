//const qrcode = window.qrcode;

var currentCPF = ''
var currentNota = ''

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

const spinnerLoading = document.getElementById("loading-spinner");

const btnCadastrarUsuario = document.getElementById("btn-cadastrar-usuario");

const modalCadastro = new bootstrap.Modal(document.getElementById('modalNovoUsuario'), {
  keyboard: false
})

alertDiv.hidden = true;

let scanning = false;


btnCadastrarUsuario.addEventListener("click", async (e) => {
  e.preventDefault();

  var url = '/api/usuario/cadastrar'; // Substitua pelo seu URL de destino
  let nome = document.getElementById("usuario-name").value;
  let celular = document.getElementById("usuario-celular").value;
  spinnerLoading.hidden = false;
  if (nome && nome != '' && celular && celular != '') {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        cpf: currentCPF,
        celular: celular,
        created_at: getFormattedDateTime()
      })
    })
      .then(function (response) {
        if (response.ok) {
          console.log('Requisição POST bem-sucedida!');
          modalCadastro.hide();
          alertMsg.innerHTML = "CPF cadastrado com sucesso!";
          spinnerLoading.hidden = true;
          return response.text();
        }
        throw new Error('Erro na requisição POST.');
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        spinnerLoading.hidden = true;
        console.error(error);
      });
  }
  else {
    alert("Os campos Nome e Celular estão vazios. Por favor, preencha-os para que possamos contatá-lo caso você seja o ganhador.")
  }

})








qrcode.callback = res => {
  if (res) {
    //outputData.innerText = res;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    alertDiv.hidden = true;
    canvasElement.hidden = true;

    console.log(res);
    let linkArray = res.split(".aspx?p=");
    let sefazID = linkArray[linkArray.length - 1];
    //let sefazAPI = `${window.location.host}/api/sefaz/${sefazID}`
    let sefazAPI = `/api/sefaz/${sefazID}`

    console.log(sefazAPI);
    currentNota = sefazAPI

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
        btnScanQR.hidden = false;
        alertMsg.hidden = true;-
        spinnerLoading.hidden = true;

      }
      else {
        var responseJsonObj = JSON.parse(this.responseText);
        canvasElement.hidden = true;
        btnScanQR.hidden = false;
        alertDiv.hidden = false;
        spinnerLoading.hidden = true;
        alertMsg.innerHTML = responseJsonObj.message;
        if (responseJsonObj.message == "CPF não encontrado!") {
          modalCadastro.show();
          currentCPF = responseJsonObj.cpf;
        }
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
      spinnerLoading.hidden = false;
      // spinnerLoading.hidden = false;
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

function getFormattedDateTime() {
  var currentDate = new Date();

  var day = String(currentDate.getDate()).padStart(2, '0');
  var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  var year = currentDate.getFullYear();
  var hours = String(currentDate.getHours()).padStart(2, '0');
  var minutes = String(currentDate.getMinutes()).padStart(2, '0');

  var formattedDateTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
  return formattedDateTime;
}

