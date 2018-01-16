var win;
var local = false;
if (window.location.hostname == "localhost") {
    local = true;
}

function showSecret() {
    var x = document.getElementById("clientSecret");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function handleClick() {
    if (local) {
        if (document.getElementById("authEndpoint").value != "" && document.getElementById("clientID").value != "" && document.getElementById("scope").value != "") {

            win = window.open(window.location.protocol + '//' + window.location.host + '/wait.html', '_blank');
            win.document.write("Loading...Please wait");


        }

    }
    else {
        return true;
    }

}

function textCopy(id,alertId) {
    $('.alert').hide();

    var copyText = document.getElementById(id);
    if (copyText.value != "") {
        copyText.select();
        document.execCommand("Copy");
        $('.alert#'+alertId).text("Token copied successfully!").fadeTo(2000, 500).slideUp(500, function () {
            $(".alert#"+alertId).slideUp(500);
        });
    }


}