let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];


// Open Modal

function openTaskModal() {

    document.getElementById("taskModal").style.display = "flex";

    document.getElementById("modalTitle").innerText = "Add New Task";

    document.getElementById("taskForm").reset();

    document.getElementById("editId").value = "";

}


// Close Modal

function closeTaskModal() {

    document.getElementById("taskModal").style.display = "none";

}


// Save Task

document.getElementById("taskForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const title =
        document.getElementById("taskTitle").value;

    const description =
        document.getElementById("taskDescription").value;

    const date =
        document.getElementById("taskDate").value;

    const priority =
        document.getElementById("taskPriority").value;

    const status =
        document.getElementById("taskStatus").value;

    const editId =
        document.getElementById("editId").value;


    if (editId) {

        const task = tasks.find(t => t.id == editId);

        task.title = title;
        task.description = description;
        task.date = date;
        task.priority = priority;
        task.status = status;

    } else {

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            date: date,

            priority: priority,

            status: status

        };

        tasks.push(newTask);

    }


    saveTasks();

    displayTasks();

    updateStats();

    closeTaskModal();

});


// Save to Local Storage

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// Display Tasks

function displayTasks() {

    const container =
        document.getElementById("taskContainer");

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const filter =
        document.getElementById("filterSelect").value;


    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(search) ||
            task.description.toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" ||
            task.status === filter;

        return matchesSearch && matchesFilter;

    });


    container.innerHTML = "";


    if (filteredTasks.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>📋 No tasks found</h3>
                <p>Add a new task to get started.</p>
            </div>
        `;

        return;

    }


    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";


        card.innerHTML = `

            <div class="task-top">

                <span class="priority ${task.priority}">
                    ${task.priority.toUpperCase()}
                </span>

            </div>


            <h3>${task.title}</h3>

            <p>${task.description}</p>


            <div class="task-date">
                📅 Due: ${formatDate(task.date)}
            </div>


            <span class="status ${task.status}">
                ${getStatusText(task.status)}
            </span>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✏ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑 Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


// Format Date

function formatDate(date) {

    if (!date) return "No date";

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// Status Text

function getStatusText(status) {

    if (status === "todo")
        return "To Do";

    if (status === "progress")
        return "In Progress";

    if (status === "completed")
        return "Completed";

}


// Edit Task

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;


    document.getElementById("modalTitle")
        .innerText = "Edit Task";


    document.getElementById("editId")
        .value = task.id;


    document.getElementById("taskTitle")
        .value = task.title;


    document.getElementById("taskDescription")
        .value = task.description;


    document.getElementById("taskDate")
        .value = task.date;


    document.getElementById("taskPriority")
        .value = task.priority;


    document.getElementById("taskStatus")
        .value = task.status;


    document.getElementById("taskModal")
        .style.display = "flex";

}


// Delete Task

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) return;


    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    displayTasks();

    updateStats();

}


// Update Statistics

function updateStats() {

    const total = tasks.length;


    const progress =
        tasks.filter(
            task => task.status === "progress"
        ).length;


    const completed =
        tasks.filter(
            task => task.status === "completed"
        ).length;


    const high =
        tasks.filter(
            task => task.priority === "high"
        ).length;


    document.getElementById("totalTasks")
        .innerText = total;


    document.getElementById("progressTasks")
        .innerText = progress;


    document.getElementById("completedTasks")
        .innerText = completed;


    document.getElementById("highTasks")
        .innerText = high;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    document.getElementById("progressPercent")
        .innerText = percentage + "%";


    document.getElementById("progressFill")
        .style.width = percentage + "%";

}


// Navigation

function showSection(section) {

    if (section === "tasks") {

        document.querySelector(".task-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    } else {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


// Initial Load

displayTasks();

updateStats();