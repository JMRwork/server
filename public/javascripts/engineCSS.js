var userOn = false;
function inicialize() {
    showBar();
}
function toggleLogin() {
    const button =
        document.querySelector(".butaoTopo");
    if (userOn === true) {
        button.innerHTML = "Logout";
        button.href = "/logout"
    } else {
        button.innerHTML = "Login";
        button.href = "/login"
    }
}
function showBar() {
    const buttons =
        document.querySelectorAll(".butaoEsquerda");
    if (userOn === true) {
        userOn = false;
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = "";
        }
    } else {
        userOn = true;
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = "none";
        }
    }
}