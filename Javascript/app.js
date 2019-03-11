


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


var trainName;
var destination;
var firstTrainTime;
var trainFrequency;
var nextArrival;
var minutesAway;
var getHere;

//Create moment function to figure out the next arrival and minutes away fields.

function timeCalc(firstTrain, frequency) {

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var difference = moment().diff(moment(firstTrainConverted), "minutes");
    minutesAway = frequency - (difference % frequency);
    nextArrival = moment().add(minutesAway, "minutes");

    getHere = moment(nextArrival).format("hh:mm");


    pushToFirebase();
    //User moment to calculate the next train arrival time and how many minutes are left until then.

}

function pushToFirebase() {

    console.log("pushToFirebase");
    database.ref().push({
        Train_Name: trainName,
        Destination: destination,
        Next_Arrival: getHere,
        Minutes_Away: getHere
    })

}

function addToDOM() {
    //Possibly have event handler. See Tues class

}



$(document).ready(function () {



    $('.btn').on("click", function (event) {

        event.preventDefault();
        trainName = $("#trainNameInput").val();
        destination = $("#destinationInput").val();
        firstTrainTime = $("#firstTrainInput").val();
        trainFrequency = $("#frequencyInput").val();
        

        timeCalc(firstTrainTime, trainFrequency);

        


    })




})