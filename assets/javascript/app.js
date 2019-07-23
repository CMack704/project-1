
var ctx = $('#chart-canvas')
var ctx = document.getElementById('chart-canvas').getContext('2d');

//form input
var newActivity = {
    getDuration: function () {
        //pulls start and end info
        //removes the : in the timestamps and finds the difference
        var arrStart = $("#start-time").val().trim().split(":");
        var arrEnd = $("#end-time").val().trim().split(":");
        var diffHour = parseInt(arrEnd[0]) - parseInt(arrStart[0]);
        if (parseInt(arrEnd[1]) < parseInt(arrStart[1])) {
            parseInt(arrEnd[1]) + 60;
        }
        //if they put in an end time past midnight
        if (diffHour < 0) {
            $('#submit-activity').on(click, function () {
                $(".bg-modal").style.display = 'flex';
            });
            $('.close').on(click, function () {
                $(".bg-modal").style.display = 'none';
            });
            $("#start-time").val("");
            $("#end-time").val("");
        }
        var diffMin = parseInt(arrEnd[1]) - parseInt(arrStart[1]);
        if (diffMin < 0) {
            diffHour--;
            diffMin = (60 + diffMin);
        }
        //formats the difference to HH:mm and makes it a string
        if (diffHour.toString().length === 1) {
            diffHour = "0" + diffHour.toString();
        }
        else {
            diffHour.toString();
        }
        if (diffMin.toString().length === 1) {
            diffMin = "0" + diffMin.toString();
        }
        else {
            diffMin.toString();
        }
        //sets the difference as the duration
        var duration = diffHour + ":" + diffMin;
        console.log("getDuration calculated " + duration);
        return duration;
    }
}

// --------------------------------------------------------------------------------CHART CODE-----------------------------------------------------------------------------------

let chartData = [
    //The pie chart is composed of 24, hour long segments at default
    (100/24),   (100/24),   (100/24),    (100/24),
    (100/24),   (100/24),   (100/24),    (100/24),
    (100/24),   (100/24),   (100/24),    (100/24),
    (100/24),   (100/24),   (100/24),    (100/24),
    (100/24),   (100/24),   (100/24),    (100/24),
    (100/24),   (100/24),   (100/24),    (100/24),
   
    ]
let chartLabels = [
    //here is 12:00am
      "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM",
      "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM",
      "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
      "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
      "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", 
      "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
    ]
    
    // functions for adding and removing activities
    function addData(chart, actObj) {
        let convertedDuration = actObj.duration.split(":")
    let convertedStart = actObj.start.split(":")
    // let convertedEnd = actObj.end.split(":")
    
    // var parsedStartHr = parseInt(convertedStart[0]) * (100/24)
    // var parsedEndHr = parseInt(convertedEnd[0]) * (100/24)
    var parsedDuration = parseInt(convertedDuration[0]) * (100/24)
    
    var startClockTime = parseInt(convertedStart[0]);
    var durationClockUnits = parseInt(convertedDuration[0])
    
    
    
    
    
    for (var i = 0; i < chartData.length; i++) {
        
        if (i === startClockTime) {
            
            if (durationClockUnits > 1) {
                chartData[i] = parsedDuration;
                chartLabels[i] = actObj.name;
                colors[i] = actObj.newColor;
                colorReplacement.splice(0,1)
                
            for (var j = 0; j < durationClockUnits; j++){
                
                if(j > 0){
                    chartData.splice((i+j), 1)
                    chartLabels.splice((i+j), 1)
                    
                }
            }
        } else {
            chartData[i] = parsedDuration;
            chartLabels[i] = actObj.name;
            colors[i] = actObj.newColor;
            colorReplacement.splice(0,1)
            
            
        }
    
    }
}
chart.update();
}
var newActObj = {
    name: '',
    description: '',
    start: '',
    duration: '',
    end: '',
}
var colors = [
    'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   
    'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   
    'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   
    'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   
    'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   
    'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   'rgb(242, 242, 242)',   
]
var colorReplacement = [

    'rgba(255, 99, 132, 1)',    'rgba(54, 162, 235, 1)',    'rgba(255, 206, 86, 1)',    'rgba(0, 128, 0, 1)',
    'rgba(153, 102, 255, 1)',    'rgba(255, 0, 0, 1)',    'rgba(255, 159, 64, 1)',  'rgba(210, 180, 140, 1)',
    'rgba(204, 204, 0, 1)',    'rgba(0, 100, 0, 1)',    'rgba(139, 0, 139, 1)',    'rgba(139, 0, 0, 1)',
    'rgba(75, 192, 192, 1)',    'rgba(255, 140, 0, 1)',    'rgba(139, 69, 19, 1)',  'rgba(0, 0, 139, 1)',

]

// The data for our dataset
var data = {
    labels: chartLabels,
    datasets: [{
        label: 'Activity Durations',
        backgroundColor: colors.reverse(),
        // borderColor: 'rgba(255, 00, 132)',
        data: chartData.reverse(),
        borderWidth: 0,

    }]
}

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',
    data: data,
    
    // Configuration options go here
    options: {
        legend: {
            display: false
        },
        rotation: -.5 * Math.PI,
        borderWidth: 0,
        borderAlign: 'inner',
        layout: {
            responsive: true,
            maintainAspectRatio: false,
            padding: {
                left: '50px',
                right: '50px',
                top: '50px',
                bottom: '50px',
            },
        },
    }
})


// --------------------------------------------------------- END CHART CODE----------------------------------------------------------------------

$(document).ready(function () {

    //when user clicks Get Duration
    $("#get-duration").on("click", function (event) {
        event.preventDefault();

        //if the button is currently Clear Duration
        if ($("#get-duration").hasClass("clear-duration") === true) {
            console.log("Clear Duration");
            $("#get-duration").removeClass("clear-duration");
            $("#activity-duration").val("");
            $("#start-time").val("");
            $("#end-time").val("");
            $("#get-duration").text("Duration*");
        }
        else {
            //keeps Get Duration from running with no input
            if (($("#start-time").val() === "") || ($("#end-time").val() === "")) {
                console.log("Please input start and end time")
            }
            else {
                //calculates duration
                $("#activity-duration").val(newActivity.getDuration());
                $("#get-duration").addClass("clear-duration");
                //turns the button into a clear button
                $("#get-duration").text("Clear Duration")
            }
        }
    })

    //when user clicks submit
    $("#submit-activity").on("click", function (event) {
        event.preventDefault();

        //submit click won't set any variables if there's no activity name
        if (($("#activity-name").val().trim()) === "") {
            console.log("Please input an activity name")
            document.querySelector('.bg-modal').style.display = 'flex';
            document.querySelector('.close').addEventListener('click', function () {
                document.querySelector('.bg-modal').style.display = 'none';
            });
            return;
        }
        //or if there's no date and "daily" isn't checked
        else if ((($("#activity-date").val().trim()) === "") && (!$("#recurring").is(":checked"))) {
            document.querySelector('.bg-modal').style.display = 'flex';
            document.querySelector('.close').addEventListener('click', function () {
                document.querySelector('.bg-modal').style.display = 'none';
            });;
            return;
        }
        //or if there's no start time
        else if (($("#start-time").val().trim()) === "") {
            document.querySelector('.bg-modal').style.display = 'flex';
            document.querySelector('.close').addEventListener('click', function () {
            document.querySelector('.bg-modal').style.display = 'none';
            });
            return;
        }

        else {

            // We're going to push our newActivity object into here
            var activityList = []

            //pulls activity info
            newActivity.date = $("#activity-date").val().trim()
            newActivity.start = $("#start-time").val().trim()
            newActivity.name = $("#activity-name").val().trim()
            newActivity.end = $("#end-time").val().trim()
            newActivity.description = $("#activity-description").val().trim()
            newActivity.daily = false
            var tempDuration = $("#activity-duration").val().trim();

            //runs getDuration if they put in a start & end but didnt finish
            if (($("#activity-duration").val("") === "") &&
                ($("#start-time").val("") !== "") && ($("#end-time").val("") !== "")) {
                newActivity.duration = newActivity.getDuration()
                }
            //pulls duration from the box if they input it and a start time manually
            if (($("#activity-duration").val("") !== "") && ($("#start-time").val("") !== "")) {
                newActivity.duration = tempDuration;

                }
            if ($("#end-time").val() === "") {
                console.log("calculating end time...")
                var newStart = newActivity.start.split(":");
                var newDur = newActivity.duration.split(":");
                console.log(newStart);
                console.log(newDur);
                var addHour = parseInt(newStart[0]) + parseInt(newDur[0]);
                console.log(addHour + "is the hours");

                if (addHour > 24) {
                    alert("PLEASE ONLY EVENTS COMPLETED BEFORE MIDNIGHT");
                    return;
                    }
            
            if ($("#recurring").is(":checked")) {
                newActivity.daily = true;
                }
            else {
                if (addHour.toString().length === 1) {
                    addHour = "0" + addHour.toString();
                    console.log("we added 0 now it's " + addHour);
                    }
                else {
                    addHour.toString();
                    console.log("no zero needed " + addHour);
                    }
                }
            var addMin = parseInt(newStart[1]) + parseInt(newDur[1]);
            console.log("right now addMin is " + addMin);

            if (addMin > 60) {
                addMin = addMin - 60;
                console.log("math! changed it to " + addMin);
                }

            if (addMin.toString().length === 1) {
                addMin = "0" + addMin.toString();
                console.log("had to embiggen it to " + addMin);
                }
            else {
                addMin.toString();
                }
        
            //sets the new end time
            newActivity.end = addHour + ":" + addMin;
            console.log("we calculated " + newActivity.end + " as the end time");
            }   
        else if ($("#end-time").val() !== "") {
            newActivity.end = $("#end-time").val().trim();
        }

        //uses moment.js to set today's date if they left Date blank
        if ($("#activity-date").val() === "") {
            newActivity.date = moment().format("YYYY-MM-DD");
        }
        else {
            newActivity.date = $("#activity-date").val().trim();
        }

        // We're pushing newActivity into the array, stringifying the array, then locally storing the array
        activityList.push(newActivity)
        activityList = activityList.concat(JSON.parse(localStorage.getItem('activityList') || '[]'));
        localStorage.setItem("activityList", JSON.stringify(activityList));

        // This grabs the stored, stringified array from local storage and unstringifies it
        var getArray = JSON.parse(localStorage.getItem('activityList'));

        // This is looping through each object in the array and running the addData function with each object's name and duration


//-------------------------------------------------------------------------------CHART CODE P2---------------------------------------------------------------- 
        
        var newActObj = {
            name: newActivity.name,
            description: newActivity.description,
            start: newActivity.start,
            duration: newActivity.duration,
            end: newActivity.end,
            newColor: colorReplacement[0],
        }

        addData(chart, newActObj);

// --------------------------------------------------------------------------END CHART CODE P2------------------------------------------------------------------

        $("#activity-name").val("");
        $("#activity-date").val("")
        $("#start-time").val("");
        $("#end-time").val("");
        $("#activity-duration").val("");
        $("#activity-description").val("");
        $("#get-duration").text("Get Duration");
        $("#get-duration").removeClass("clear-duration");
    }
    });


//dark mode button
$("#dark-mode").on("click", function () {
    if ($("#css-link").hasClass("dark-on")) {
        $("#css-link").removeAttr("href");
        $("#css-link").attr("href", "assets/css/bootstrap.min.css");
        $("#dark-mode").text("Dark Mode");
        $("#css-link").removeClass("dark-on");
    }

    else {
        $("#css-link").removeAttr("href");
        $("#css-link").attr("href", "assets/css/bootstrap.dark.css");
        $("#dark-mode").text("Light Mode");
        $("#css-link").attr("class", "dark-on")
    }
})

})

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar-goes-here');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'list', 'interaction'],
        editable: true,
        defaultView: 'dayGridMonth',
        header: {
            center: 'addEventButton, listDay, dayGridWeek, dayGridMonth'
        },
        customButtons: {
            addEventButton: {
                text: 'update calendar...',
                click: function () {
                    var dateStr = $("#activity-date").val().trim();
                    //console.log(dateStr)            
                    // Gets stored data and parse it back
                    var getArray = JSON.parse(localStorage.getItem('activityList'));
                    console.log(getArray)
                    var date = new Date(dateStr + 'T00:00:00'); // will be in local time            
                    for (var i = 0; i < getArray.length; i++) {
                        calendar.addEvent({
                            title: getArray[i].name,
                            start: getArray[i].date + " " + getArray[i].start,
                            end: getArray[i].date + " " + getArray[i].end,
                            allDay: false,
                        });
                        
                    }
                }
            }
        }
    });
    calendar.render();
})