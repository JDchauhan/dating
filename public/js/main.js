var showBody, logout;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isEmail(email) {
    if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
        email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
        return true;
    }
    return false;
}

function isPass(pass) {
    if (pass.length < 8) {
        return false;
    }
    return true;
}

$(function () {

    logout = function() {
        $.ajaxSetup({
            headers: {
                'authorization': getCookie("token")
            }
        });
        $.get("../logout", {},
            function (data, status, xhr) {
    
                setCookie("token", "", -1);
    
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    $('#err').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network error.</div>'
                    );
                    showBody();
                    return;
                }
                $('.alert').hide(500);
                $('#err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>Some error occured.</div>'
                );
                showBody();
                return;
            });
    };
})