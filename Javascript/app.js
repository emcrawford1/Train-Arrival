


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCLQv9N2VEgEx4PW6GlyQHDWetvT0OIFl0",
    authDomain: "train-scheduler-197e2.firebaseapp.com",
    databaseURL: "https://train-scheduler-197e2.firebaseio.com",
    projectId: "train-scheduler-197e2",
    storageBucket: "train-scheduler-197e2.appspot.com",
    messagingSenderId: "165537716286"
}



firebase.initializeApp(config);

var database = firebase.database();

//Global variable declarations

var trainName;
var destination;
var firstTrainTime;
var trainFrequency;
var nextArrival;
var minutesAway;
var getHere;


//Function to calculate the number of minutes to the next train and the arrival time of the next train.  This function
//uses the moment.js library.

function timeCalc(firstTrain, frequency) {

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var difference = moment().diff(moment(firstTrainConverted), "minutes");
    minutesAway = frequency - (difference % frequency);
    nextArrival = moment().add(minutesAway, "minutes");

    getHere = moment(nextArrival).format("hh:mm");


    pushToFirebase();

}


//This function creates a new entry for each train in the Firebase database.  This function utilizes the push() method
//for each train so that existing data is not overwritten.

function pushToFirebase() {

    console.log("pushToFirebase");
    database.ref().push({
        Train_Name: trainName,
        Destination: destination,
        Frequency: trainFrequency,
        Next_Arrival: getHere,
        Minutes_Away: minutesAway
    })

}


//This function manipulates the DOM to add each train entry to webpage.

function addToDOM() {
    
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").addClass("frequency").text(trainFrequency),
        $("<td>").addClass("nextArrival").text(getHere),
        $("<td>").addClass("minutesAway").text(minutesAway)
    )

    $("#train-scheduler >tbody").append(newRow);

}



$(document).ready(function () {



    $('.btn').on("click", function (event) {

        event.preventDefault();
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstTrainTime = $("#firstTrainInput").val().trim();
        trainFrequency = $("#frequencyInput").val().trim();
        

        timeCalc(firstTrainTime, trainFrequency);

    })

    database.ref().on("child_added", function(childSnapshot){

        trainName = childSnapshot.val().Train_Name;
        destination = childSnapshot.val().Destination;
        trainFrequency = childSnapshot.val().Frequency;
        getHere = childSnapshot.val().Next_Arrival;
        minutesAway = childSnapshot.val().Minutes_Away;

        $('#trainNameInput').val('');
        $('#destinationInput').val('');
        $('#firstTrainInput').val('');
        $('#frequencyInput').val('');

        addToDOM();

     })




})