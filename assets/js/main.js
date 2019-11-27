function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addBall(params) {
    var ball = document.createElement("div");
    ball.setAttribute('class', 'ball taken');
    ball.setAttribute('id', params.id);
    ball.setAttribute('data-micromodal-trigger', 'modal-read');
    ball.setAttribute('data-name', params.first_name);
    ball.setAttribute('data-l-name', params.last_name);
    ball.setAttribute('data-message', params.msg);
    ball.setAttribute('data-host', params.host);
    ball.style.left = params.x;
    ball.style.top = params.y;
    ball.style.backgroundColor = params.bgcolor;
    document.getElementById("tree").appendChild(ball);

    ball.addEventListener("mouseover", function () {
        ball.style.cursor = "pointer";
    });
    ball.addEventListener("click", function () {
        if (this.className.indexOf("taken") >= 0) {
            document.getElementById("modal-read-message").textContent = this.getAttribute("data-message") + " 🎁";
            document.getElementById("modal-read-name").innerHTML = this.getAttribute("data-name") + " " + this.getAttribute("data-l-name") + " from " + this.getAttribute("data-host");
        }
    });
}

window.onload = function () {

    var ip = "";
    fetch("http://ipinfo.io/ip")
        .then(response => response.text())
            .then(function(addr) {
                ip = addr.slice(0, -1);
            });

    firebase.initializeApp(firebaseConfig);

    var ref = firebase.database().ref("wishes");
    ref.once('value')
      .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {

              addBall({
                  id: childSnapshot.key,
                  first_name: childSnapshot.child("first_name").val(),
                  last_name: childSnapshot.child("last_name").val(),
                  msg: childSnapshot.child("msg").val(),
                  host: childSnapshot.child("host").val(),
                  x: childSnapshot.child("position").child("x").val(),
                  y: childSnapshot.child("position").child("y").val(),
                  bgcolor: getRandomColor()
              })

          });

          /* modal lib */
          MicroModal.init();

      });

    var submit = document.getElementById("submit");

    /* host mask */
    IMask(document.getElementById("modal-wish-host"), {
        mask: "{AEGEE-}[**********************]",
        lazy: false
    });

    submit.addEventListener("click", function (e) {
        e.preventDefault();
        if (
            document.getElementById("modal-wish-name").value === "" ||
            document.getElementById("modal-wish-last-name").value === "" ||
            document.getElementById("modal-wish-host").value === "" ||
            document.getElementById("modal-wish-message").value === ""
        ) {
            document.getElementById("modal-wish-hint").classList.add("is-show");
            document.getElementById("modal-wish-hint").innerText = "Fill all the gaps!";
        }
        document.getElementById("modal-wish-hint").classList.remove("is-show");
        //document.getElementById("modal-wish").classList.remove("is-show");
        
        var ball = {
            first_name: document.getElementById("modal-wish-name").value,
            last_name: document.getElementById("modal-wish-last-name").value,
            msg: document.getElementById("modal-wish-message").value,
            host: document.getElementById("modal-wish-host").value,
            position: {
                x: document.getElementById("modal-wish-x-position").value+'px',
                y: document.getElementById("modal-wish-y-position").value+'px'
            },
            ip: ip
        }
        ball.id = firebase.database().ref('wishes').push(ball).key;

        ball.bgcolor = getRandomColor();
        addBall(ball)
    });

    if (document.getElementById("modal-error")) {
        MicroModal.show("modal-error");
    }

    var tree_img = document.getElementById("tree");
    tree_img.addEventListener("click", function (e) {
        document.getElementById("modal-wish-x-position").value = e.layerX; //e.pageX - this.offsetLeft;
        document.getElementById("modal-wish-y-position").value = e.layerY; //e.pageY - this.offsetTop;
    });

    snow.start();
};
