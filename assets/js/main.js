$(document).ready(function () {
    /* modal lib */
    MicroModal.init();

    /* balls processing */
    var balls = document.querySelectorAll("div.ball");
    var submit = document.getElementById("submit");

    /* host mask */
    IMask(document.getElementById("modal-wish-host"), {
        mask: "{AEGEE-}[**********************]",
        lazy: false
    });

    balls.forEach(function (ball, index) {
        ball.addEventListener("mouseover", function () {
            ball.style.cursor = "pointer";
        });
        ball.addEventListener("click", function () {
            if (this.className.indexOf("taken") >= 0) {
                document.getElementById("modal-read-message").textContent = this.getAttribute("data-message") + " 🎁";
                document.getElementById("modal-read-name").innerHTML = this.getAttribute("data-name") + " " + this.getAttribute("data-l-name") + " from " + this.getAttribute("data-host");
            } else if (this.className.indexOf("empty") >= 0) {
                document.getElementById("modal-wish-hint").classList.remove("is-show");
                document.getElementById("modal-wish-position").value = this.className.match(/\d/g).join("");
            }
        });
    });

    submit.addEventListener("click", function (e) {
        if (
            document.getElementById("modal-wish-name").value === "" ||
            document.getElementById("modal-wish-last-name").value === "" ||
            document.getElementById("modal-wish-host").value === "" ||
            document.getElementById("modal-wish-message").value === ""
        ) {
            document.getElementById("modal-wish-hint").classList.add("is-show");
            document.getElementById("modal-wish-hint").innerText = "Fill all the gaps!";
            e.preventDefault();
        }
    });

    if (document.getElementById("modal-error")) {
        MicroModal.show("modal-error");
    }
});