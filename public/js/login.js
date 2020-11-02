$(document).ready(function () {

    //Jump to signup page
    $('#password').on('change', function (e) {
       $('#password_error').hide();
        $('#email_not_exist').hide();
    });
    $('#email').on('change', function (e) {
        $('#email_not_exist').hide();
        $('#password_error').hide();
    });

    //Used in Register password checking
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

    //Used in reset password checking
    $('#lbl-confirm2').hide();

    $('#confirmPassword2').on('change', function (e) {
        var pass1 = $('#confirmPassword2').val();
        var pass2 = $('#checkPassword2').val();
        if (pass1 != pass2)
        {
            $('#lbl-confirm2').show();
        }
        else {
            $('#lbl-confirm2').hide();
        }
    });


});

//Used in Register password checking
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

//Used in reset password page checking
function checkConfirmPasswords2() {
    var pass1 = $('#confirmPassword2').val();
    var pass2 = $('#checkPassword2').val();
    if (pass1 == pass2) {
        return true;
    }
    else {
        alert("Error: Passwords do not match.");
        return false;
    }
}