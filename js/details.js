$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    const taskDetails = getTaskDetailsById(taskId);
    const taskDetailsElement = $("#task-details");

    taskDetailsElement.html(`
        <h2>${taskDetails.title}</h2>
        <p>${taskDetails.description}</p>
        <p>${taskDetails.completeByDate ? "Complete by: " + taskDetails.completeByDate : ""}</p>
    `);
});
