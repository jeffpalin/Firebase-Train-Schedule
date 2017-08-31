$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDpShUhcLZv7fYxEftnhqrx3OyoLSQOBjE",
        authDomain: "first-project-6ba1b.firebaseapp.com",
        databaseURL: "https://first-project-6ba1b.firebaseio.com",
        projectId: "first-project-6ba1b",
        storageBucket: "first-project-6ba1b.appspot.com",
        messagingSenderId: "801657408458"
    };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    //Submit button for train infomation in HTML file.
    $("#add-train-btn").on("click", function(event) {

        //Pulls user inputs from the form entries in HTML file.
        var trainName = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var trainTime = $("#first-train-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        //Create a local "temporary" object for holding train data.
        var newTrain = {
            localName: trainName,
            localDestination: destination,
            localTime: trainTime,
            localFrequency: frequency
        };

        //upload train data to the database
        database.ref().push(newTrain);

        //clear the text-boxes
        $("#name-input").val("");
        $("#destination-input").val("");
        $("first-train-input").val("");
        $("#frequency-input").val("");
    });

    //Create a firebase event for adding trains to the
    //database and a row in the HTML when a user adds a train.
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        //Store everything into a variable.
        var trainName = childSnapshot.val().localName;
        var destination = childSnapshot.val().localDestination;
        var trainTime = childSnapshot.val().localTime;
        var frequency = childSnapshot.val().localFrequency;

        //Train Info
        console.log(trainName);
        console.log(destination);
        console.log(trainTime);
        console.log(frequency);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
        console.log("TRAIN TIME CONVERTED: " + moment(trainTimeConverted).format("LT"));

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("LT"));

        // Difference between the times
        var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var timeRemainder = diffTime % frequency;
        console.log("TIME REMAINING: " + timeRemainder);

        // Minute Until Train
        var timeUntilTrain = frequency - timeRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + timeUntilTrain);

        // Next Train
        var nextTrain = moment().add(timeUntilTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("LT"));

        // Add each train's data into the table
        $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" +
            moment(nextTrain).format("LT") + "</td><td>" + timeUntilTrain + "</td><td>");

    });
});