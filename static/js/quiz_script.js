
buildList()

function buildList() {
    wrapper = document.getElementById('list-wrapper')
    var url = "http://127.0.0.1:8000/api/quizs/"
    fetch(url).then((resp) => resp.json())
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
