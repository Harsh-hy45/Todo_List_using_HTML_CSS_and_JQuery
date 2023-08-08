function getTaskDetailsById(taskId) {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks[taskId];
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    console.log(taskId);
    const taskDetails = getTaskDetailsById(taskId);
    
    $("#task-title").text(taskDetails.title);
    $("#task-description").text(taskDetails.description);
    $("#complete-by-date").text(taskDetails.completeByDate);
   
    const createdOnDate = new Date(taskDetails.createdOn);
    const createdDate = createdOnDate.toDateString();
    const createdTime = createdOnDate.toLocaleTimeString();
    $("#created-on-date").text(createdDate);
    $("#created-on-time").text(createdTime);

    // Display updatedOn date and time separately
    const updatedOnDate = new Date(taskDetails.updatedOn);
    const updatedDate = updatedOnDate.toDateString();
    const updatedTime = updatedOnDate.toLocaleTimeString();
    $("#updated-on-date").text(updatedDate);
    $("#updated-on-time").text(updatedTime);
});
