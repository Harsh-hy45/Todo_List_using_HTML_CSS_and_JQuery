$(document).ready(function () {

    // Get the form and input elements
    const form = $("#new-task-form");
    const inputTitle = $("#task-title");
    const inputDescription = $("#task-description");
    const inputCompleteByDate = $("#complete-by-date");
    const taskList = $("#tasks");

    // Load existing tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    $("#open-modal-button").on("click", function() {
        $("#task-modal").css("display", "block");
    });

    // Close the modal when the close button is clicked
    $("#close-modal-button").on("click", function() {
        $("#task-modal").css("display", "none");
    });
    // Handle form submission
    form.submit(function (e) {
        e.preventDefault();

        // Get input values
        const title = inputTitle.val();
        const description = inputDescription.val();
        const completeByDate = inputCompleteByDate.val();

        let formIsValid = validateForm(title, description, completeByDate);
        if(!formIsValid)
        {
            return;
        }

            if (form.data("edit-index") !== undefined) {
                $(".edit").show();
                $("#new-task-submit").val("Add Task");
                // Get the index of the task being edited
                const editIndex = form.data("edit-index");
                updateTask(editIndex, title, description, completeByDate);
                form.data("edit-index", undefined);
                form.find(".edit").show();
            } else {
                // If not editing, add a new task
                addTask(title, description, completeByDate);
                tasks.push({
                    title,
                    description,
                    completeByDate
                });
            }

            // Update local storage with the updated tasks
            updateLocalStorageTasks();

            // Reset input fields after submission
            inputTitle.val("");
            inputDescription.val("");
            inputCompleteByDate.val("");

            // Refresh the page after successful submission
            location.reload();
        
    });

    // Add existing tasks to the UI
    for (const task of tasks) {
        addTask(task.title, task.description, task.completeByDate);
    }


    function validateForm(title, description, completeByDate) {
        let formIsValid = true;

        if (!validateTitle(title) || !validateDescription(description) || !validateCompleteBy(completeByDate)) {
            formIsValid = false;
        }

        return formIsValid;
    }
    // Function to add a new task to the UI
    function addTask(title, description, completeByDate) {
        const taskElement = $(`
            <div class="task">
                <div class="content">
                    <h3 class="task-title not-editing">${title}</h3>
                    ${description.trim() !== "" ? `<p>${description}</p>` : ''}
                    ${completeByDate.trim() !== "" ? `<p>Complete by: ${completeByDate}</p>` : ''}
                </div>
                <div class="actions">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
        `);
    
        taskList.append(taskElement);
    
        const taskEditButton = taskElement.find('.edit');
        const taskDeleteButton = taskElement.find('.delete');
    
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
    
            $(this).closest('.task').remove();
    
            tasks.splice(taskIndex, 1);
    
            updateLocalStorageTasks();
        });
    }
    

    // Function to update an existing task in the UI
    function updateTask(index, title, description, completeByDate) {
        const taskToEdit = tasks[index];
        taskToEdit.title = title;
        taskToEdit.description = description;
        taskToEdit.completeByDate = completeByDate;

        // Find the task element in the UI and update its content
        const taskElement = taskList.children().eq(index);
        const taskContentElement = taskElement.find(".content");

        taskContentElement.find(".task-title").text(title);
        taskContentElement.find("p:eq(0)").text(description ? description : "");
        taskContentElement.find("p:eq(1)").text(completeByDate ? "Complete by: " + completeByDate : "");
    }

    // Function to update local storage with the tasks data
    function updateLocalStorageTasks() {

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});

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

    }

    else if (description.length > 200) {

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