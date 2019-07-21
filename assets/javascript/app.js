
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
        console.log(diffHour);
        if (parseInt(arrEnd[1]) < parseInt(arrStart[1])) {
            parseInt(arrEnd[1]) + 60;
        }
        //if they put in an end time past midnight
        if (diffHour < 0) {
            alert("Please only enter activities that can be completed in one day!")
            $("#start-time").val("");
            $("#end-time").val("");
        }
        var diffMin = parseInt(arrEnd[1]) - parseInt(arrStart[1]);
        console.log(diffMin);
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
        console.log("duration " + duration);
        return duration;

    }

}


// functions for adding and removing activities
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        tempArr.push(data)
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
        tempArr.pop()

    });
    chart.update();
}

var tempArr = []
var placeHolder = {
    duration:  100 - (tempArr.reduce(function(acc, val) { return acc + val; }, 0)),
    name : 'unscheduled time',
}

// The data for our dataset
var data ={
    labels: [placeHolder.name,],
    datasets: [{
        label: 'Activitie Durations',
        backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        // borderColor: 'rgb(255, 00, 132)',
        data: [placeHolder.duration,]
        
    }]
}

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',
    data: data, 

    // Configuration options go here
    options: {
        rotation: -.5 * Math.PI ,
        borderWidth: 50,
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

$(document).ready(function () {

    //when user clicks Get Duration
    $("#get-duration").on("click", function (event) {
        event.preventDefault();
        //keeps Get Duration from running with no input
        // if (($("#start-time").val("")) || ($("#end-time").val(""))) {
        //     console.log("NO BLANKS")
        // }
        // else {
        $("#activity-duration").val(newActivity.getDuration());
        $("#activity-duration").attr("disabled", true);
        //option to clear the duration and start over
        $("#get-duration").text("Clear Duration").on("click", function () {
            $("#activity-duration").attr("disabled", false);
            $("#activity-duration").val("");
            $("#start-time").val("");
            $("#end-time").val("");
            $("#get-duration").text("Get Duration");
        })
    })
    
    //when user clicks submit
    $("#submit-activity").on("click", function (event) {
        event.preventDefault();

        // We're going to push our newActivity object into here
        var activityList = []

        //pulls activity info
        newActivity.date = $("#activity-date").val().trim()
        newActivity.start = $("#start-time").val().trim()
        newActivity.name = $("#activity-name").val().trim()
        newActivity.end = $("#end-time").val().trim()
        newActivity.duration = newActivity.getDuration()
        newActivity.description = $("#activity-description").val().trim()
        newActivity.daily = false

        //runs getDuration if they put in a start & end but didnt finish
        if ($("#activity-duration").val("") === "") {
            newActivity.duration = newActivity.getDuration()
        }
        if ($("#recurring").is(":checked")) {
            newActivity.daily = true;
        }

        // We're pushing newActivity into the array, stringifying the array, then locally storing the array
        activityList.push(newActivity)
        activityList = activityList.concat(JSON.parse(localStorage.getItem('activityList')||'[]'));      
        localStorage.setItem("activityList", JSON.stringify(activityList));
      
        // This grabs the stored, stringified array from local storage and unstringifies it
        var getArray = JSON.parse(localStorage.getItem('activityList'));

        // This is looping through each object in the array and running the addData function with each object's name and duration
        for (var i = 0; i < getArray.length; i++) {
            addData(chart, getArray[i].name, parseInt(getArray[i].duration))
        }

        //clears form
        $("#activity-name").val("");
        $("#activity-date").val("")
        $("#start-time").val("");
        $("#end-time").val("");
        $("#activity-duration").val("");
        $("#activity-description").val("");
        $("#checkboxId").prop("checked", false);
        $("#get-duration").text("Get Duration");
        $("#get-duration").off();

        console.log("name " + newActivity.name);
        console.log("date " + newActivity.date);
        console.log("start time " + newActivity.start);
        console.log("duration " + newActivity.duration); //only working if you input start time/end
        console.log("description " + newActivity.description);
        console.log("daily reoccurance is " + newActivity.daily);

    })

    $('#remove-activity').on('click', function (e) {
        e.preventDefault()
        console.log('you clicked me')
        removeData(chart, newActivity.name, newActivity.duration)
    })

})

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar-goes-here');
    
    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'dayGrid', 'list', 'interaction' ],
      defaultView: 'dayGridMonth',
      header: {
        center: 'addEventButton, dayGridWeek, dayGridMonth'
      },
      customButtons: {
        addEventButton: {
          text: 'add event...',
          click: function() {
            var title = $("#activity-name").val().trim();
            var dateStr = $("#activity-date").val().trim();
            //var d = date.getDate();
            //var m = date.getMonth();
            //var y = date.getFullYear();
            var startTime = $("#start-time").val().trim().split(":");
            var endTime = $("#end-time").val().trim().split(":");
            var date = new Date(dateStr + 'T00:00:00'); // will be in local time
  
            if (!isNaN(date.valueOf())) { // valid?
              calendar.addEvent({
                title: title,
                start: date,
                allDay: true
              });
              
            } else {
              alert('Invalid date.');
            }
          }
        }
      }
    });
  
    calendar.render();
  });