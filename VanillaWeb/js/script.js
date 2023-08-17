const form = $("#task-form");
const inputTitle = $("#task-title");
const inputDescription = $("#task-description");
const inputCompleteByDate = $("#complete-by-date");
const taskList = $("#tasks");
const addButton = $("#task-submit");
const openModelButton = $("#open-modal-button");
const closeModelButton = $("#close-modal-button");
const deleteModal = $("#delete-modal");
const searchBar = $("#search-bar");
let currentDate = new Date();
let tasks;
let taskToDeleteIndex;
let editingMode = "add";
let taskCounter = 1;
let saveTask = "Save Task";
let addTask = "Add Task";

class Task {
    constructor(title, description, completeByDate) {
        this.title = title;
        this.description = description;
        this.completeByDate = completeByDate;
        this.completed = false;
        this.createdOn = currentDate;
        this.updatedOn = this.createdOn;
        this.completedOn = null;
    }
}

function openDeleteModal(index) {
    taskToDeleteIndex = index;
    deleteModal.css("display", "block");
}

function closeDeleteModal() {
    deleteModal.css("display", "none");
}

function viewTask(index) {
    const taskDetailsUrl = `details.html?id=${index}`;
    window.location.href = taskDetailsUrl;
}

function getDate(rawDate) {
    return rawDate ? new Date(rawDate).toDateString() : "In Progress...";
}

function addTaskToDOM(task) {
    const taskRow = $(`
    <tr class="task">
      <td class="status">
        <label class="checkbox-container">
           <input class="complete-checkbox" type="checkbox" ${task.completed ? "checked" : ""}>
           <span class="checkmark"><el>
      </td>
      <td class="content">
          <input class="task-title" type="text" value="${task.title}" readonly>
      </td>
      <td class="completeby">
          <input class="task-completeby" type="text" value="${getDate(task.completeByDate)}" readonly>
      </td>
      <td class="completedon">
          <input class="task-completedon" type="text" value="${task.completed ? getDate(task.completedOn) : 'In Progress...'}" readonly>
      </td>
      <td class="actions">
        <button class="view">View</button>
        ${task.completed ? '' : '<button class="edit">Edit</button>'}
        <button class="delete"><i class="fa fa-trash" aria-hidden="true" class="delete-icon"></i></button>
      </td>
    </tr>
  `);

    taskList.append(taskRow);
    const taskViewButton = $(".view");
    const taskEditButton = $(".edit");
    const taskDeleteButton = $("#task-table tbody tr:last-child .delete");

    taskViewButton.click(function () {
        const taskIndex = $(this).closest(".task").index();
        viewTask(taskIndex);
    });

    taskEditButton.click(function () {
        resetFormErrors();
        addButton.prop("disabled", false);
        const taskIndex = $(this).closest(".task").index();
        const taskToEdit = tasks[taskIndex];
        inputTitle.val(taskToEdit.title);
        inputDescription.val(taskToEdit.description);
        inputCompleteByDate.val(taskToEdit.completeByDate);
        form.data("edit-index", taskIndex);
        editingMode = "edit";
        addButton.val(saveTask);
        $("#task-modal").css("display", "block");
    });

    taskDeleteButton.click(function () {
        const taskIndex = $(this).closest(".task").index();
        openDeleteModal(taskIndex);
    });
}

function updateTask(index, title, description, completeByDate, completed) {
    const taskToEdit = tasks[index];
    taskToEdit.title = title;
    taskToEdit.description = description;
    taskToEdit.completeByDate = completeByDate;
    taskToEdit.completed = completed;
    taskToEdit.updatedOn = new Date().toISOString();
    if (completed) {
        taskToEdit.completedOn = new Date().toISOString();
    } else {
        taskToEdit.completedOn = "";
    }
    const taskRow = taskList.children().eq(index);
    const taskContentElement = taskRow.find(".content");
    taskContentElement.find(".task-title").val(title);
    taskContentElement.find("p:eq(0)").text(description ? description : "");
    taskContentElement.find("p:eq(1)").text(completeByDate ? "Complete by: " + completeByDate : "");
}

function updateLocalStorageTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function validateForm(title, description, completeByDate) {
    return (validateTitle(title) && validateDescription(description) && completeByDate);
}

function validateTitle(title) {
    return (title.trim().length >= 3 && title.trim().length <= 50);
}

function validateDescription(description) {
    return description.trim().length <= 200;
}

function resetFormErrors() {
    hideError(inputTitle);
    hideError(inputDescription);
    hideError(inputCompleteByDate);
}

function closeModal() {
    form.trigger("reset");
    $("#task-modal").css("display", "none");
}

function showError(inputElement, message) {
    const errorElement = $(`#${inputElement.attr('id')}-error`);
    errorElement.text(message);
    errorElement.show();
}

function hideError(inputElement) {
    const errorElement = $(`#${inputElement.attr('id')}-error`);
    errorElement.text("");
    errorElement.hide();
}

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}

$(document).ready(function () {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!Array.isArray(tasks)) {
        tasks = [];
    }

    openModelButton.click(function () {
        form.trigger("reset");
        resetFormErrors();
        editingMode = "add";
        addButton.prop("disabled", true);
        addButton.val(addTask);
        $("#task-modal").css("display", "block");
    });

    closeModelButton.click(function () {
        form.trigger("reset");
        editingMode = "add";
        $("#task-modal").css("display", "none");
    });

    taskList.on("change", ".complete-checkbox", function () {
        const taskIndex = $(this).closest(".task").index();
        const completed = $(this).prop("checked");
        const taskRow = taskList.children().eq(taskIndex);
        const editButton = taskRow.find(".edit");
        const completedOnInput = taskRow.find(".task-completedon");

        if (completed) {
            editButton.hide();
            completedOnInput.val(getDate(currentDate));
        } else {
            editButton.show();
            completedOnInput.val("In Progress...");
        }
        
        updateTask(taskIndex, tasks[taskIndex].title, tasks[taskIndex].description, tasks[taskIndex].completeByDate, completed);
        updateLocalStorageTasks();
    });

    $("#reset-form").click(function () {
        form.trigger("reset");
    });

    inputTitle.on('input', function () {
        const title = inputTitle.val().trim();
        if (!validateTitle(title)) {
            showError(inputTitle, "Title should be between 3 and 50 characters.");
            addButton.prop("disabled", true);
        } else {
            hideError(inputTitle);
        }
    });

    inputDescription.on('input', function () {
        const description = inputDescription.val().trim();
        if (!validateDescription(description)) {
            showError(inputDescription, "Description should not exceed 200 characters.");
            addButton.prop("disabled", true);
        } else {
            hideError(inputDescription);
            addButton.prop("disabled", false);
        }
    });

    inputCompleteByDate.on('input', function () {
        const completeByDate = inputCompleteByDate.val();
        date = currentDate.yyyymmdd();
        if (completeByDate < date) {
            showError(inputCompleteByDate, "You can't add previous date.");
            addButton.prop("disabled", true);
        }
        else if (!completeByDate) {
            showError(inputCompleteByDate, "Complete by date is required.");
            addButton.prop("disabled", true);
        } else {
            hideError(inputCompleteByDate);
            addButton.prop("disabled", false);
        }
    });

    searchBar.on("input", function () {
        const searchTerm = searchBar.val().toLowerCase();
        taskList.find('.task').show();
        taskList.find('.task .content .task-title').each(function () {
            const taskTitle = $(this).val().toLowerCase();
            if (!taskTitle.includes(searchTerm)) {
                $(this).closest('.task').hide();
            }
        });
    });

    form.submit(function (e) {
        e.preventDefault();
        const title = inputTitle.val();
        const description = inputDescription.val();
        const completeByDate = inputCompleteByDate.val();

        if (validateForm(title, description, completeByDate)) {
            closeModal();
            if (editingMode === "edit") {
                const editIndex = form.data("edit-index");
                updateTask(editIndex, title, description, completeByDate);
                form.data("edit-index", undefined);
                editingMode = "add";
                addButton.val("Add Task");
            } else {
                const newTask = new Task(title.trim(), description.trim(), completeByDate);
                tasks.push(newTask);
                addTaskToDOM(newTask);
            }
            updateLocalStorageTasks();
            inputTitle.val("");
            inputDescription.val("");
            inputCompleteByDate.val("");
        } else {
            if (!validateTitle(title)) {
                showError(inputTitle, "Title should be between 3 and 50 characters.");
            }
            if (!validateDescription(description)) {
                showError(inputDescription, "Description should not exceed 200 characters.");
            }
            if (!completeByDate) {
                showError(inputCompleteByDate, "Complete by date is required.");
            }
            addButton.prop("disabled", true);
        }
    });

    addButton.click(function () {
        $("#task-modal").css("display", "none");
    });

    $("#confirm-delete").click(function () {
        tasks.splice(taskToDeleteIndex, 1);
        updateLocalStorageTasks();
        $(".task").eq(taskToDeleteIndex).remove();
        closeDeleteModal();
    });

    $("#cancel-delete").click(function () {
        closeDeleteModal();
    });

    for (const task of tasks) {
        addTaskToDOM(task);
    }
});