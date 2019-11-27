function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addBall(params) {
    var ball = document.createElement("a");
    ball.setAttribute('class', 'ball taken');
    ball.setAttribute('id', params.id);
    ball.setAttribute('data-toggle', 'popover-hover');
    ball.setAttribute('title', '<b>'+params.first_name+'</b> '+params.last_name+' from '+params.host);
    ball.setAttribute('data-content', params.msg);
    ball.addEventListener("click", e => { e.stopPropagation(); });
    ball.style.left = params.position.x;
    ball.style.top = params.position.y;
    ball.style.backgroundColor = params.bgcolor;

    document.getElementById("tree").appendChild(ball);
}

async function saveNewBall() {
        if (
            document.getElementById("modal-wish-name").value === "" ||
            document.getElementById("modal-wish-last-name").value === "" ||
            document.getElementById("modal-wish-host").value === "" ||
            document.getElementById("modal-wish-message").value === ""
        ) {
            document.getElementById("modal-wish-hint").classList.add("is-show");
            document.getElementById("modal-wish-hint").innerText = "Fill all the gaps!";
            return;
        }
        document.getElementById("modal-wish-hint").classList.remove("is-show");
        //document.getElementById("modal-wish").classList.remove("is-show");
    
        //let response = await fetch('http://ipinfo.io/ip');
        //let ip = await response.text();
        
        var ball = {
            first_name: document.getElementById("modal-wish-name").value,
            last_name: document.getElementById("modal-wish-last-name").value,
            msg: document.getElementById("modal-wish-message").value,
            host: document.getElementById("modal-wish-host").value,
            position: {
                x: document.getElementById("modal-wish-x-position").value+'px',
                y: document.getElementById("modal-wish-y-position").value+'px'
            },
            //ip: ip.slice(0, -1)
            ip: "0.0.0.0"
        }
        ball.id = await firebase.database().ref('wishes').push(ball).key;

        ball.bgcolor = getRandomColor();
        addBall(ball)
    }

$(document).ready(function () {

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
                  position: {
                      x: childSnapshot.child("position").child("x").val(),
                      y: childSnapshot.child("position").child("y").val()
                  },
                  bgcolor: getRandomColor()
              })

          });

          /* modal lib */
          MicroModal.init();

          $('body').popover({
              html: true,
              trigger: 'hover click',
              placement: 'left',
              selector: '[data-toggle="popover-hover"]'
          });


      });

    var submit = document.getElementById("submit");

    /* host mask */
    IMask(document.getElementById("modal-wish-host"), {
        mask: "{AEGEE-}[**********************]",
        lazy: false
    });

    submit.addEventListener("click", function(e) {
        e.preventDefault();
        saveNewBall();
        $("#modal-wish-form").trigger("reset");
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
});
