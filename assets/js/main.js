function addBall(params) {
    var ball_num = Math.floor(Math.random() * 11);

    var ball = document.createElement("img");
    ball.setAttribute('class', 'ball');
    ball.setAttribute('src', 'assets/images/ball-'+ball_num+'.png');
    ball.setAttribute('id', params.id);
    ball.setAttribute('data-toggle', 'popover-hover');
    ball.setAttribute('title', '<b>'+params.first_name+' '+params.last_name+'</b><br />from '+params.host);
    ball.setAttribute('data-content', params.msg);
    ball.addEventListener("click", e => { e.stopPropagation(); });
    ball.style.left = params.position.x;
    ball.style.top = params.position.y;
    ball.style.position = "absolute";
    ball.style.width = "36px";

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
        
        var msg = $("#modal-wish-message").val();
        msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
        
        var ball = {
            first_name: $("#modal-wish-name").val(),
            last_name: $("#modal-wish-last-name").val(),
            msg: msg,
            host: $("#modal-wish-host").val(),
            position: {
                x: $("#modal-wish-x-position").val()+'px',
                y: $("#modal-wish-y-position").val()+'px'
            },
            //ip: ip.slice(0, -1)
            ip: "0.0.0.0"
        }
        ball.id = await firebase.database().ref('wishes').push(ball).key;

        addBall(ball)
    }

$(document).ready(function () {

    firebase.initializeApp(firebaseConfig);

    var ref = firebase.database().ref("wishes");
    ref.once('value').then(function(snapshot) {

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
                }
            })

        });

        $('body').popover({
            html: true,
            trigger: 'hover click',
            placement: 'left',
            selector: '[data-toggle="popover-hover"]'
        });


    });

    /* modal lib */
    MicroModal.init();

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
        document.getElementById("modal-wish-x-position").value = e.layerX-18; //e.pageX - this.offsetLeft;
        document.getElementById("modal-wish-y-position").value = e.layerY; //e.pageY - this.offsetTop;
    });

    snow.start();
});
