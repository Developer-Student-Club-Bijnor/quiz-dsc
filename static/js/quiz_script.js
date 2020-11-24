// Globals
function set_cookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value};expires=${expires.toUTCString()}`
    return true
}

function get_cookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

var access_token = localStorage.getItem("access_token")
url = "http://127.0.0.1:8000/api/auth/user/"
user = document.getElementById("user")

fetch(url, {
    method: "GET",
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Token ${access_token}`,
    },
}).then((resp) => resp.json()).then(
    function (data) {
        console.log(data)
        user.innerHTML += data.username + "<a href=''>Logout</a>"
    }
)


function user_login() {
    var csrftoken = get_cookie('csrftoken');

    var form = document.getElementById('form-wrapper')
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        console.log("form Submitted...")
        var username = document.getElementById('username').value
        var password = document.getElementById('password').value
        var url = "http://127.0.0.1:8000/api/auth/login/"
        fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log("User Data: ", data)
                localStorage.setItem("access_token", data.token)
            })
    })

}

function user_register() {
    var csrftoken = get_cookie('csrftoken');

    var form = document.getElementById('form-wrapper')
    form.addEventListener('submit', function (e) {
        // e.preventDefault()
        // console.log("form Submitted...")
        var username = document.getElementById('username').value
        var name = document.getElementById('name').value
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        var password2 = document.getElementById('password2').value
        var url = "http://127.0.0.1:8000/api/auth/register/"
        fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                "username": username,
                "name": name,
                "email": email,
                "password": password
            })
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log("User Data: ", data)
            })
    })

}
// user_login();
// buildList()

function buildList() {
    // var access_token = get_cookie("access_token")
    wrapper = document.getElementById('list-wrapper')
    var url = "http://127.0.0.1:8000/api/quizs/"
    fetch(url, {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${access_token}`,
        },
    }).then((resp) => resp.json())
        .then(function (data) {
            console.log('DATA: ', data)
            var list = data
            for (var i in list) {
                try {
                    document.getElementById(`data-row-${i}`).remove()
                } catch (err) { }
                var name = `<h3 class="name">${list[i].name}</h3>`
                var description = `<span class="description">${list[i].description}</span>`
                var question_count = `<small>Questions: ${list[i].questions_count}</small>`
                var slug = list[i].slug
                var item = `<div id="data-row-${i}" class="quiz-wrapper flex-wrapper"><div style="flex:7;">${name}</div>${description}  ${question_count}</div>`
                wrapper.innerHTML += item
            }
        })
}
