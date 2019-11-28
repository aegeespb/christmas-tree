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

    document.getElementById("tree").appendChild(ball);
}

function validateData(data) {

    if ( data.first_name === "" || data.last_name === "" ||
         data.host === "" || data.message === "" ||
         data.position.x === "" || data.position.y === ""
    ) {
        $("#modal-wish-hint").text("Fill all the gaps!");
        return false;
    }

    if (data.first_name.length >= 20) {
        $("#modal-wish-hint").text("Name is too long!");
        return false;
    }

    if (data.last_name.length >= 30) {
        $("#modal-wish-hint").text("Last name is too long!");
        return false;
    }

    if (data.host.length >= 30) {
        $("#modal-wish-hint").text("Antennae name is too long!");
        return false;
    }

    return true;
}

async function saveNewBall() {
    
        //let response = await fetch('http://ipinfo.io/ip');
        //let ip = await response.text();
        
        var ball = {
            first_name: $("#modal-wish-name").val(),
            last_name: $("#modal-wish-last-name").val(),
            msg: $("#modal-wish-message").val(),
            host: $("#modal-wish-host").val(),
            position: {
                x: $("#modal-wish-x-position").val()+'%',
                y: $("#modal-wish-y-position").val()+'%'
            },
            //ip: ip.slice(0, -1)
            ip: "0.0.0.0"
        }

        if (!validateData(ball)) {
            $("#modal-wish-hint").addClass("is-show");
            return false;
        }
        $("#modal-wish-hint").removeClass("is-show");

        ball.msg = ball.msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
        ball.id = await firebase.database().ref('wishes').push(ball).key;

        addBall(ball);

        return true;
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

    $("#submit").click( async function(e) {
        e.preventDefault();
        if (await saveNewBall()) {
            MicroModal.close('modal-wish');
            $("#modal-wish-form").trigger("reset");
        }
    });

    var tree_img = document.getElementById("tree");
    tree_img.addEventListener("click", function (e) {
        var x = Math.floor((e.layerX - 0.03*this.clientWidth)*100/this.clientWidth);
        var y = Math.floor(e.layerY*100/this.clientHeight);
        $("#modal-wish-x-position").val(x); // e.layerX-18; //e.pageX - this.offsetLeft;
        $("#modal-wish-y-position").val(y); // e.layerY; //e.pageY - this.offsetTop;
    });

    snow.start();

    /* modal lib */
    MicroModal.init();
});
