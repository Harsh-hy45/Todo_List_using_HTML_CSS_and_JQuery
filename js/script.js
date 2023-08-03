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
        addTask(title, description, completeByDate);
        tasks.push({
            title,
            description,
            completeByDate
        });
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
        const task_save_el = $("<button>").addClass("save").text("Save").hide();
        const task_delete_el = $("<button>").addClass("delete").text("Delete");

        task_actions_el.append(task_edit_el, task_save_el, task_delete_el);
        task_element.append(task_actions_el);
        list_element.append(task_element);

        task_edit_el.click(function () {
            task_edit_el.hide();
            task_save_el.show();

            const originalTitle = title; // Store the original title before editing
            const originalDescription = description;
            const originalCompleteByDate = completeByDate;

            const editTitleInput = $('<input>').attr('type', 'text').addClass('edit-title').val(title);
            const editDescriptionTextarea = $("<textarea>").addClass("edit-description").val(description);
            const editCompleteByInput = $("<input>").addClass("edit-complete-by").attr('type', 'datetime-local').val(completeByDate);

            task_title_element.replaceWith(editTitleInput);
            task_description_el.replaceWith(editDescriptionTextarea);
            task_complete_by_el.replaceWith(editCompleteByInput);

            editTitleInput.focus();
        });

        task_save_el.click(function () {
            task_save_el.hide();
            task_edit_el.show();

            const newTitle = $('.edit-title').val();
            const newDescription = $('.edit-description').val();
            const newCompleteByDate = $('.edit-complete-by').val();

            task_title_element.text(newTitle).addClass("task-title not-editing");

            if (newDescription.trim() !== "") {
                const task_updated_description_el = $("<p>").text(newDescription);
                task_description_el.replaceWith(task_updated_description_el);
            }

            if (newCompleteByDate.trim() !== "") {
                const task_updated_complete_by_el = $("<p>").text("Complete by: " + newCompleteByDate);
                task_complete_by_el.replaceWith(task_updated_complete_by_el);
            }

            const taskIndex = $(this).closest(".task").index();
            tasks[taskIndex] = { title: newTitle, description: newDescription, completeByDate: newCompleteByDate };
            updateLocalStorageTasks();
        });

        task_delete_el.click(function () {
            const taskIndex = $(this).closest(".task").index();
            $(this).closest(".task").remove();
            tasks.splice(taskIndex, 1);
            updateLocalStorageTasks();
        });
    }

    function updateLocalStorageTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
