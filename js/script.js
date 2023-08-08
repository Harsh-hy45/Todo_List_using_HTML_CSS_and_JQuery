const form = $("#new-task-form");
const inputTitle = $("#task-title");
const inputDescription = $("#task-description");
const inputCompleteByDate = $("#complete-by-date");
const taskList = $("#tasks");
const addButton = $("#new-task-submit");
const editButton = $(".edit");
const openModelButton = $("#open-modal-button");
const closeModelButton = $("#close-modal-button");
const deleteModal = $("#delete-modal");
const searchBar = $("#search-bar");
const taskTitles = [];

// const taskArray=$("#task-table tbody");

let date = new Date();
let tasks;
let taskToDeleteIndex;
let editingMode = "add";
let taskCounter = 1;


function openDeleteModal(index) {
    taskToDeleteIndex = index;
    deleteModal.css("display", "block");
}

function closeDeleteModal() {
    deleteModal.css("display", "none");
}

function viewTask(index) {
    const taskToView = tasks[index];
    console.log(index);
    const taskDetailsUrl = `task-details.html?id=${index}`;
    window.location.href = taskDetailsUrl;
}

function addTask(title, description, completeByDate) {
    const taskRow = $(`
    <tr class="task">
      <td class="content">
        <input class="task-title" type="text" value="${title}" readonly>
            </td>
      <td class="actions">
        <button class="view">View</button>
        <button class="edit">Edit</button>
        <button class="delete"><i class="fa fa-trash" aria-hidden="true" class="delete-icon"></i></button>
      </td>
    </tr>
  `);

    taskList.append(taskRow);

    const taskViewButton = $("#task-table tbody tr:last-child .view");
    const taskEditButton = $("#task-table tbody tr:last-child .edit");
    const taskDeleteButton = $("#task-table tbody tr:last-child .delete");

    taskViewButton.click(function () {
        const taskIndex = $(this).closest(".task").index();
        viewTask(taskIndex);
    });

    taskEditButton.click(function () {
        const taskIndex = $(this).closest(".task").index();
        const taskToEdit = tasks[taskIndex];
        inputTitle.val(taskToEdit.title);
        inputDescription.val(taskToEdit.description);
        inputCompleteByDate.val(taskToEdit.completeByDate);
        form.data("edit-index", taskIndex);
        editingMode = "edit";
        addButton.val("Save Task");
        $("#task-modal").css("display", "block");
    });

    taskDeleteButton.click(function () {
        const taskIndex = $(this).closest(".task").index();

        openDeleteModal(taskIndex);
    });
}

function updateTask(index, title, description, completeByDate) {
    const taskToEdit = tasks[index];
    taskToEdit.title = title;
    taskToEdit.description = description;
    taskToEdit.completeByDate = completeByDate;
    const taskRow = taskList.children().eq(index);
    const taskContentElement = taskRow.find(".content");
    taskContentElement.find(".task-title").val(title);
    taskContentElement.find("p:eq(0)").text(description ? description : "");
    taskContentElement.find("p:eq(1)").text(completeByDate ? "Complete by: " + completeByDate : "");
}

function updateLocalStorageTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(editingMode);
}

function validateForm(title, description, completeByDate) {
    if (validateTitle(title) && validateDescription(description) && validateCompleteBy(completeByDate)) {
        // addButton.prop("disabled", false);
        return true;
    }
    return false;
}


function validateTitle(title) {
    return title.length >= 3 && title.length <= 50;
}

function validateDescription(description) {
    return description.length <= 200;
}

function validateCompleteBy(completeByDate) {
    return !!completeByDate;
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
        addButton.val("Add Task");
        $("#task-modal").css("display", "block");
    });

    closeModelButton.click(function () {
        form.trigger("reset");
        editingMode = "add";
        $("#task-modal").css("display", "none");
    });

    $("#reset-form").click(function () {
        form.trigger("reset");
    });

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
    };

    function resetFormErrors() {
        hideError(inputTitle);
        hideError(inputDescription);
        hideError(inputCompleteByDate);
    }

    function closeModal() {
        form.trigger("reset");
        $("#task-modal").css("display", "none");
    }

    inputTitle.on('input', function () {
        const title = inputTitle.val().trim();
        if (!validateTitle(title)) {
            showError(inputTitle, "Title should be between 3 and 50 characters.");
            addButton.prop("disabled", true);
        } else {
            hideError(inputTitle);
            addButton.prop("disabled", false);
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
        currentDate = date.yyyymmdd();
        if (completeByDate < currentDate) {
            showError(inputCompleteByDate, "You can't add previous date.");
            addButton.prop("disabled", true);
        }
        else if (!validateCompleteBy(completeByDate)) {
            showError(inputCompleteByDate, "Complete by date is required.");
            addButton.prop("disabled", true);
        } else {
            hideError(inputCompleteByDate);
            addButton.prop("disabled", false);
        }
    });

    for (const task of tasks) {
        taskTitles.push(task.title);
    }

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
                addTask(title, description, completeByDate);
                tasks.push({
                    title,
                    description,
                    completeByDate,
                });
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
            if (!validateCompleteBy(completeByDate)) {
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
        addTask(task.title, task.description, task.completeByDate);
        console.log("hello");
    }
});