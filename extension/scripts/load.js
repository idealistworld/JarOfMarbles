var inputtedThought = "";
var indexOfThought = "";
var newDay;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

async function checkDay() {
    await chrome.storage.local.get(['dateToday'], function (result) {
        if (result.dateToday != today) {
            chrome.storage.local.set({ dateToday: today }, function () {
            });
            newDay = true;
        }
    });
}

function saveThought() {
    if (document.getElementById("newThought").value != "") {
        inputtedThought = document.getElementById("newThought").value;
        chrome.storage.local.get(['database'], function (result) {
            var db = result.database;
            db.push({ "thought": inputtedThought, "displayCount": 0, "date": today });
            chrome.storage.local.set({ database: db }, function () {
            });
        });
        document.getElementById("newThought").value = "";
        document.getElementById("newThought").placeholder = "Thought submitted";
    }
}

function deleteThought() {
    chrome.storage.local.get(['database'], function (result) {
        var db = result.database;
        db.splice(indexOfThought, 1);
        document.getElementById("delete").style.display = "none"
        chrome.storage.local.set({ database: db }, function () {
        });
    });
}

function clearThoughts() {
    chrome.storage.local.set({ database: [] }, function () {
    });
}

function compareDisplays(a, b) {
    if (a.displayCount < b.displayCount) {
        return -1;
    } else {
        return 1;
    }
}

async function setThought() {
    var randomInt = "";
    var data = [];
   
    await chrome.storage.local.get(['database'], function (result) {
        data = result.database;
    });

    await chrome.storage.local.get(['todayThoughtIndex'], function (result) {
        var thoughtIndex = result.todayThoughtIndex;
        if (result.todayThoughtIndex = today) {
            document.getElementById("currentThought").innerHTML = data[thoughtIndex].thought + " created on " + data[thoughtIndex].date + " times displayed " + data[thoughtIndex].displayCount;
            displayed = true;
            return;
        }
        else {
            chrome.storage.local.set({ dateToday: today }, function () {
            });
        }
    });

    await chrome.storage.local.get(['database'], function (result) {
        var db = result.database;
        randomInt = db.length;
        var displayed = false;
        if (db.length != 0 && newDay) {
            while (displayed == false) {
                var index = Math.floor(Math.random() * randomInt);
                if (db[index].displayCount < db[0].displayCount + 1) {
                    document.getElementById("currentThought").innerHTML = db[index].thought + " created on " + db[index].date + " times displayed " + db[index].displayCount;
                    db[index].displayCount++;
                    indexOfThought = index;
                    db.sort(compareDisplays);
                    chrome.storage.local.set({ database: db }, function () {
                    });
                    chrome.storage.local.set({ todayThoughtIndex: index}, function () {
                    });
                    displayed = true;
                    return;
                }
            }
        }
    });
}

function setDate ()
{
    var newDate = document.getElementById("dateInput").value;
    chrome.storage.local.set({ dateToday: newDate }, function () {
    });
}

checkDay();
document.getElementById("save").addEventListener("click", saveThought);
document.getElementById("delete").addEventListener("click", deleteThought);
document.getElementById("clear").addEventListener("click", clearThoughts);
document.getElementById("changeDate").addEventListener("click", setDate);
document.onload = setThought();