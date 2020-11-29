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

function user() {
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
            if (data.username) {
                console.log(data)
                user.innerHTML = "Hi " + data.username + "<button id='logout' onclick='user_logout();'>Logout</button>"
            } else {

            }

        })
}


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
                if (data.user) {
                    console.log("User Data: ", data)
                    localStorage.setItem("access_token", data.token)
                    form.innerHTML += `<div class="alert alert-success" role="alert">Login Successful</div>`
                    window.location.href = "/"
                    user()
                    return
                } else {
                    console.log(data)
                    form.innerHTML += `<div class="alert alert-warning" role="alert">${data.non_field_errors}</div>`
                }
            })
    })

}

function user_register() {
    var csrftoken = get_cookie('csrftoken');

    var form = document.getElementById('form-wrapper')
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        console.log("form Submitted...")
        var username = document.getElementById('username').value
        var name = document.getElementById('name').value
        var email = document.getElementById('email').value
        var password = document.getElementById('password')
        var password2 = document.getElementById('password2')
        if (password.value != password2.value) {
            password2.innerHTML += `<div class="invalid-feedback">The two password fields didn’t match.</div>`
            return
        }
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
                "password": password.value
            })
        }).then(function (resp) {
            console.log(resp.status)
            status = resp.status
            return resp.json()
        }).then(function (data) {
            if (status > 399 && status < 500) {
                for (var i in data) {
                    form.innerHTML += `<div class="alert alert-warning" role = "alert" > ${data[i]}</div >`
                }
            } else {
                form.innerHTML += `<div class="alert alert-success" role = "alert" > Signup successful</div >`
            }
            console.log("User Data: ", data)
            window.location.href = '/login/'
        })
    })

}

function user_logout() {
    console.log("logout clicked...")
    localStorage.setItem('access_token', null)
    window.location.href = '/login/'

}

user();
// user_login();
// buildList()

function buildList() {
    // var access_token = get_cookie("access_token")
    var access_token = localStorage.getItem("access_token")
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
