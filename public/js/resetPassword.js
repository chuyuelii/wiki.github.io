$(document).ready(function () {

    $('#lbl-confirm').hide();


    $('#confirmPassword').on('change', function (e) {
        var pass1 = $('#confirmPassword').val();
        var pass2 = $('#checkPassword').val();
        if (pass1 != pass2)
        {
            $('#lbl-confirm').show();
        }
        else {
            $('#lbl-confirm').hide();
        }
    });


});

function checkConfirmPasswords() {
    var pass1 = $('#confirmPassword').val();
    var pass2 = $('#checkPassword').val();
    if (pass1 == pass2) {
        return true;
    }
    else {
        alert("Error: Passwords do not match.");
        return false;
    }
}