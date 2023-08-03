$(document).ready(function () {
    
    const form = $("#new-task-form");
    const inputTitle = $("#task-title");
    const inputDescription = $("#task-description");
    const inputCompleteByDate = $("#complete-by-date");
    const list_element = $("#tasks");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    form.submit(function (e) {
        e.preventDefault();
        const title = inputTitle.val();
        const description = inputDescription.val();
        const completeByDate = inputCompleteByDate.val();
        
        // Check if we are editing an existing task
        if (form.data("edit-index") !== undefined) {
            form.find("#new-task-submit").val("Save Task").prop("disabled", false)
            const editIndex = form.data("edit-index");
            updateTask(editIndex, title, description, completeByDate);
            form.data("edit-index", undefined); // Reset edit-index
            form.find("#new-task-submit").val("Add Task").prop("disabled", false); // Change button text back to "Add Task"
            form.find(".edit").show(); // Show the "Edit" button again
        } else {
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
    });

    for (const task of tasks) {
        addTask(task.title, task.description, task.completeByDate);
    }

    function addTask(title, description, completeByDate) {
        const task_element = $("<div>").addClass("task");
        const task_content_element = $("<div>").addClass("content");
        task_element.append(task_content_element);

        const task_title_element = $("<h3>").text(title).addClass("task-title not-editing");
        task_content_element.append(task_title_element);

        if (description.trim() !== "") {
            const task_description_el = $("<p>").text(description);
            task_content_element.append(task_description_el);
        }

        if (completeByDate.trim() !== "") {
            const task_complete_by_el = $("<p>").text("Complete by: " + completeByDate);
            task_content_element.append(task_complete_by_el);
        }

        const task_actions_el = $("<div>").addClass("actions");
        const task_edit_el = $("<button>").addClass("edit").text("Edit");
        const task_delete_el = $("<button>").addClass("delete").text("Delete");

        task_actions_el.append(task_edit_el, task_delete_el);
        task_element.append(task_actions_el);
        list_element.append(task_element);

        task_edit_el.click(function () {
            const taskIndex = $(this).closest(".task").index();
            const taskToEdit = tasks[taskIndex];

            inputTitle.val(taskToEdit.title);
            inputDescription.val(taskToEdit.description);
            inputCompleteByDate.val(taskToEdit.completeByDate);

            form.data("edit-index", taskIndex); // Store the edit index to update the task later
            task_edit_el.hide();
        });

        task_delete_el.click(function () {
            const taskIndex = $(this).closest(".task").index();
            $(this).closest(".task").remove();
            tasks.splice(taskIndex, 1);
            updateLocalStorageTasks();
        });
    }

    function updateTask(index, title, description, completeByDate) {
        const taskToEdit = tasks[index];
        taskToEdit.title = title;
        taskToEdit.description = description;
        taskToEdit.completeByDate = completeByDate;

        const task_element = list_element.children().eq(index);
        const task_content_element = task_element.find(".content");

        task_content_element.find(".task-title").text(title);
        task_content_element.find("p:eq(0)").text(description ? description : "");
        task_content_element.find("p:eq(1)").text(completeByDate ? "Complete by: " + completeByDate : "");
    }

    function updateLocalStorageTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});