

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const filterTasks = document.getElementById("filterTasks");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// Update dashboard statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("remainingTasks").textContent = remaining;

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const filter = filterTasks.value;

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No tasks found. Add a new task!";
        emptyMessage.classList.add("empty-message");
        taskList.appendChild(emptyMessage);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const details = document.createElement("div");
        details.classList.add("task-details");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        taskText.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        });

        const information = document.createElement("small");

        const subject = task.subject || "Other";
        const priority = task.priority || "Medium";

        information.textContent =
            subject + " | " + priority + " Priority" +
            (task.date ? " | Due: " + task.date : "");

        information.classList.add("task-information");

        details.appendChild(taskText);
        details.appendChild(information);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        li.appendChild(details);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateStats();
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        subject: subjectInput.value,
        date: dateInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";

    displayTasks();
}

// Button click
addTaskButton.addEventListener("click", addTask);

// Press Enter to add a task
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Filter tasks
filterTasks.addEventListener("change", displayTasks);

// Initial dashboard display
displayTasks();
