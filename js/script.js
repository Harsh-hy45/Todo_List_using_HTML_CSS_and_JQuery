const form = $("#new-task-form");
const inputTitle = $("#task-title");
const inputDescription = $("#task-description");
const inputCompleteByDate = $("#complete-by-date");
const taskList = $("#tasks");
const openModelButton = $("#open-modal-button");
const closeModelButton = $("#close-modal-button");

let tasks;


let taskToDeleteIndex;

// Open the delete modal when the delete button is clicked
function openDeleteModal(index) {
  taskToDeleteIndex = index;
  $("#delete-modal").css("display", "block");
}

// Close the delete modal
function closeDeleteModal() {
  $("#delete-modal").css("display", "none");
}

$(document).ready(function () {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!Array.isArray(tasks)) {
        tasks = [];
    }
    openModelButton.click(function () {
        $("#task-modal").css("display", "block");
    });
    closeModelButton.click(function () {
        $("#task-modal").css("display", "none");
    });

    form.submit(function (e) {
        e.preventDefault();
        const title = inputTitle.val();
        const description = inputDescription.val();
        const completeByDate = inputCompleteByDate.val();
        let formIsValid = validateForm(title, description, completeByDate);
        if (!formIsValid) {
            return;
        }
        if (form.data("edit-index") !== undefined) {
            $(".edit").show();
            $("#new-task-submit").val("Add Task");
            const editIndex = form.data("edit-index");
            updateTask(editIndex, title, description, completeByDate);
            form.data("edit-index", undefined);
            form.find(".edit").show();
        }
        else {
            addTask(title, description, completeByDate);
            tasks.push({
                title,
                description,
                completeByDate
            });

        }

        updateLocalStorageTasks();
        inputTitle.val("");
        inputDescription.val("");
        inputCompleteByDate.val("");
        $("#task-modal").css("display", "none");
    });

    $("#new-task-submit").click(function () {
        $("#task-modal").css("display", "none");
    });

    for (const task of tasks) {
        addTask(task.title, task.description, task.completeByDate);
    }
});

function validateForm(title, description, completeByDate) {
    let formIsValid = true;
    if (!validateTitle(title) || !validateDescription(description) || !validateCompleteBy(completeByDate)) {
        formIsValid = false;
    }
    return formIsValid;
}

function addTask(title, description, completeByDate) {

    const taskRow = $(`
    <tr class="task">
    <td>${title}</td>
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
        const taskIndex = $(this).closest('.task').index();
        const taskToEdit = tasks[taskIndex];
        inputTitle.val(taskToEdit.title);
        inputDescription.val(taskToEdit.description);
        inputCompleteByDate.val(taskToEdit.completeByDate);
        form.data('edit-index', taskIndex);
        taskEditButton.hide();
        $('#new-task-submit').val('Save Task');
    });

    taskDeleteButton.click(function () {
        const taskIndex = $(this).closest('.task').index();
        openDeleteModal(taskIndex);
    });
}

$("#confirm-delete").click(function () {
    // Delete the task after confirmation
    tasks.splice(taskToDeleteIndex, 1);
    updateLocalStorageTasks();
    $(".task").eq(taskToDeleteIndex).remove();
    closeDeleteModal();
  });

  // Add event listener for the cancel delete button in the modal
  $("#cancel-delete").click(function () {
    // Close the delete modal without deleting the task
    closeDeleteModal();
  });

function updateTask(index, title, description, completeByDate) {
    const taskToEdit = tasks[index];
    taskToEdit.title = title;
    taskToEdit.description = description;
    taskToEdit.completeByDate = completeByDate;
    const taskRow = taskList.children().eq(index);
    const taskContentElement = taskRow.find(".content");
    taskContentElement.find(".task-title").text(title);
    taskContentElement.find("p:eq(0)").text(description ? description : "");
    taskContentElement.find("p:eq(1)").text(completeByDate ? "Complete by: " + completeByDate : "");
}

function updateLocalStorageTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(tasks);
}

function validateTitle(title) {
    if (title.length === 0) {
        alert("Title is required.");
        return false;
    }
    else if (title.length < 3 || title.length > 50) {
        alert("Title should be between 3 and 50 characters.");
        return false;
    }
    return true;
}

function validateDescription(description) {
    if (description.length === 0) {
        alert("Description is required.");
    } else if (description.length > 200) {
        alert("Description should not exceed 200 characters.");
        return false;
    }
    return true;
}

function validateCompleteBy(completeByDate) {
    if (!completeByDate) {
        alert("Complete by date is required.");
        return false;
    }
    return true;
}