let questions = [];
let questionsNext = [];
let questionsDone = 0;
let questionNumber = 0;
let currentRoundCount = 0;

$(document).ready(function() {
    firebase.initializeApp({
        apiKey: "AIzaSyCuVgIBWEwIhY0OkLOsmtul93qNzaHi-EM",
        authDomain: "pytania-cc953.firebaseapp.com",
        projectId: "pytania-cc953"
    });

    var db = firebase.firestore();

    db.collection("question").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().test}`);
        });
    });

    let filename = getUrlParameter("p");
    filename = filename === undefined ? "pytania_wszystkie.txt" : filename;

    $.get("pytania/" + filename, function(data) {
        let lines = data.split("\n");

        $.each(lines, function(n, elem) {
            questions.push(elem);
        });

        shuffle(questions);

        console.log("Questions:" + questions.length);
        currentRoundCount = questions.length;
        $('#queprogress').attr('aria-valuemax', questions.length);
        setProgressbar(0);

        setQuestion(getNextQuestion());
    });

    $('button.btn-ok').click(function() {
        setProgressbar(++questionsDone);

        if(questions.length === 0 && questionsNext.length === 0) {
            youWin();
        }
        else if (questions.length === 0 && questionsNext.length > 0){
            nextRound();
            setQuestion(getNextQuestion());
        }
        else {
            setQuestion(getNextQuestion());
        }
    });

    $('button.btn-nok').click(function() {
        if($('div.card-header').text() !== 'Koniec') {
            questionsNext.push($('div.card-body').text());
        }

        if(questions.length === 0 && questionsNext.length === 0) {
            youWin();
        }
        else if(questions.length === 0 && questionsNext.length > 0) {
            nextRound();
            setQuestion(getNextQuestion());
        }
        else {
            setQuestion(getNextQuestion());
        }
    });
});

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getNextQuestion() {
    return questions.pop();
}

function setQuestion(question) {
    $('div.card-header').text('Pytanie ' + ++questionNumber + "/" + (currentRoundCount));
    $('div.card-body').text(question);
}

function setProgressbar(num) {
    let numMax = $('#queprogress').attr('aria-valuemax');

    $('#queprogress').attr('aria-valuenow', num).css('width', Math.round((num*100)/numMax) + "%");
}

function youWin()
{
    $('div.card-header').text('Koniec');
    $('div.card-body').text("Umiesz już wszystko!");
}

function nextRound() {
    questionNumber = 0;
    questions = questionsNext;
    questionsNext = [];
    shuffle(questions);
    currentRoundCount = questions.length;
}

function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};