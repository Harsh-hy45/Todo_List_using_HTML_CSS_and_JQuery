const form = $("#new-task-form");
const inputTitle = $("#task-title");
const inputDescription = $("#task-description");
const inputCompleteByDate = $("#complete-by-date");
const taskList = $("#tasks");
const submitButton = $("#new-task-submit");
const openModelButton = $("#open-modal-button");
const closeModelButton = $("#close-modal-button");
const deleteModal = $("#delete-modal");
let tasks;
let taskToDeleteIndex;
let taskCounter = 1;

function openDeleteModal(index) {
    taskToDeleteIndex = index;
    deleteModal.css("display", "block");
}

function closeDeleteModal() {
    deleteModal.css("display", "none");
}

function addTask(title, description, completeByDate) {
    const taskRow = $(`
    <tr class="task">
      <td class="content">
        <input class="task-title" type="text" value="${title}" readonly>
        <p>${description ? description : ""}</p>
        <p>${completeByDate ? "Complete by: " + completeByDate : ""}</p>
      </td>
      <td class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </td>
    </tr>
  `);

    $("#task-table tbody").append(taskRow);
    const taskEditButton = $("#task-table tbody tr:last-child .edit");
    const taskDeleteButton = $("#task-table tbody tr:last-child .delete");

    taskEditButton.click(function () {
        const taskIndex = $(this).closest(".task").index();
        const taskToEdit = tasks[taskIndex];
        inputTitle.val(taskToEdit.title);
        inputDescription.val(taskToEdit.description);
        inputCompleteByDate.val(taskToEdit.completeByDate);
        form.data("edit-index", taskIndex);
        submitButton.val("Save Task");
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
    console.log(tasks);
}

function validateForm(title, description, completeByDate) {
    return validateTitle(title) && validateDescription(description) && validateCompleteBy(completeByDate);
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
    
    inputTitle.on('input', function () {
        const title = inputTitle.val();
        if (!validateTitle(title)) {
            showError(inputTitle, "Title should be between 3 and 50 characters.");
        } else {
            hideError(inputTitle);
        }
    });

    inputDescription.on('input', function () {
        const description = inputDescription.val();
        if (!validateDescription(description)) {
            showError(inputDescription, "Description should not exceed 200 characters.");
        } else {
            hideError(inputDescription);
        }
    });

    inputCompleteByDate.on('input', function () {
        const completeByDate = inputCompleteByDate.val();
        if (!validateCompleteBy(completeByDate)) {
            showError(inputCompleteByDate, "Complete by date is required.");
        } else {
            hideError(inputCompleteByDate);
        }
    });

    openModelButton.click(function () {
        form.trigger("reset");
        form.data("edit-index", undefined);
        submitButton.val("Add Task");
        $("#task-modal").css("display", "block");
    });

    closeModelButton.click(function () {
        form.trigger("reset");
        form.data("edit-index", undefined);
        $("#task-modal").css("display", "none");
    });

    $("#reset-form").click(function () {
        form.trigger("reset");
    });

    function resetFormErrors() {
        hideError(inputTitle);
        hideError(inputDescription);
        hideError(inputCompleteByDate);
    }
    
    function closeModal() {
        form.trigger("reset");
        form.data("edit-index", undefined);
        $("#task-modal").css("display", "none");
    }

    form.submit(function (e) {   
        e.preventDefault();
        resetFormErrors();
        const title = inputTitle.val();
        const description = inputDescription.val();
        const completeByDate = inputCompleteByDate.val();
        let formIsValid = validateForm(title, description, completeByDate);

        if (validateForm(title, description, completeByDate)) {
            closeModal();
        }
        else 
        {
            resetFormErrors();
            if (!validateTitle(title)) {
                showError(inputTitle, "Title should be between 3 and 50 characters.");
            }
            if (!validateDescription(description)) {
                showError(inputDescription, "Description should not exceed 200 characters.");
            }
            if (!validateCompleteBy(completeByDate)) {
                showError(inputCompleteByDate, "Complete by date is required.");
            }
        }

        if (form.data("edit-index") !== undefined) {
            const editIndex = form.data("edit-index");
            updateTask(editIndex, title, description, completeByDate);
            form.data("edit-index", undefined);
            submitButton.val("Add Task");
        } 
        else {
            addTask(title, description, completeByDate);
            const taskId = "task-" + taskCounter++;
            tasks.push({
                id: taskId,
                title,
                description,
                completeByDate,
            });
        }

        updateLocalStorageTasks();
        inputTitle.val("");
        inputDescription.val("");
        inputCompleteByDate.val("");
        // if(validateForm(title, description, completeByDate))
        // {
        //     $("#task-modal").css("display", "none");
        // }
    });

    submitButton.click(function () {
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
    }
});