var like, superLike, block;

function centerModal() {
    $(this).css('display', 'block');
    var $dialog = $(this).find(".modal-dialog");
    var offset = ($(window).height() - $dialog.height()) / 2;
    // Center modal vertically in window
    $dialog.css("margin-top", offset);
}

$('.modal').on('show.bs.modal', centerModal);
$(window).on("resize", function () {
    $('.modal:visible').each(centerModal);
});

var socket = io.connect('http://localhost:3000/', {
    query: { token: getCookie("token") }
});

socket.on('connect', function () {
    console.log("socket_connected")
});

socket.on('notifyUser', function (data) {
    if(data.flag === "LIKE"){
        alert("Someone Liked your profile")
    }else{
        $("#imageToShow").attr("src","/public/images/user/" + data.by);
        $("#btnClk").trigger("click")
    }
});

$(function () {
    $.ajaxSetup({
        headers: {
            'authorization': "bearer " + getCookie("token")
        }
    });

    $.ajax({
        url: "/list",
        type: 'GET',
        contentType: 'application/json',
        success: function (result) {
            result.results.forEach(user => {
                $('#images').append(
                    `<div class="col-md-3">
                        <img src=${user.image} class="img-responsive" height="300px" width="250px"></img>
                        <div class="btn-group pb-5" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-secondary" onclick="like('${user._id}')">Like</button>
                            <button type="button" class="btn btn-secondary" onclick="superLike('${user._id}')">Super Like</button>
                            <button type="button" class="btn btn-secondary" onclick="block('${user._id}')">Block</button>
                        </div>
                    </div>`                        
                );
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            var errMsg;
            if (xhr.status === 0) {
                errMsg = "Network error.";
            } else {
                errMsg = JSON.parse(xhr.responseText).message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                if (errMsg === 'Validation failed.') {
                    errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                }
            }

            $('.alert').hide(500);
            $('#msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> ' + errMsg +
                '</div>'
            );
        }
    });

    $(document).on('click', '#imageUpload', function () {
        var form = $('#fileUploadForm')[0];
        var data = new FormData(form);    
        $.ajax({
            url: "/image",
            type: "POST",
            enctype: 'multipart/form-data',
            processData: false,  // Important!
            contentType: false,
            data: data,
            cache: false,
            success: function (result) {
                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your Image uploaded successfully.' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg;
                if (xhr.status === 0) {
                    errMsg = "Network error.";
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    if (errMsg === 'Validation failed.') {
                        errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                    }
                }

                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong> ' + errMsg +
                    '</div>'
                );
            }
        });
    });

        

    like = function(userId){
        $.ajax({
            url: "/likes",
            type: 'POST',
            data: JSON.stringify({
                user: userId
            }),
            contentType: 'application/json',
            success: function (result) {
                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your like is casted successfully.' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg;
                if (xhr.status === 0) {
                    errMsg = "Network error.";
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    if (errMsg === 'Validation failed.') {
                        errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                    }
                }

                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong> ' + errMsg +
                    '</div>'
                );
            }
        });
    }

    superLike = function(userId){
        $.ajax({
            url: "/superLikes",
            type: 'POST',
            data: JSON.stringify({
                user: userId
            }),
            contentType: 'application/json',
            success: function (result) {
                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your super like is casted successfully.' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg;
                if (xhr.status === 0) {
                    errMsg = "Network error.";
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    if (errMsg === 'Validation failed.') {
                        errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                    }
                }

                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong> ' + errMsg +
                    '</div>'
                );
            }
        });
    }

    block = function(userId){
        $.ajax({
            url: "/block",
            type: 'POST',
            data: JSON.stringify({
                user: userId
            }),
            contentType: 'application/json',
            success: function (result) {
                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your blocked successfully.' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg;
                if (xhr.status === 0) {
                    errMsg = "Network error.";
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    if (errMsg === 'Validation failed.') {
                        errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                    }
                }

                $('.alert').hide(500);
                $('#msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong> ' + errMsg +
                    '</div>'
                );
            }
        });
    }
});