const input = document.getElementById("input");
const addBtn = document.getElementById("add");
const taskList = document.getElementById("tasklist");
const dropdown = document.querySelector(".custom-select");
const selectedOption = dropdown.querySelector(".selected");
const allOptions = dropdown.querySelectorAll(".options li");
const sortAZ = document.querySelector(".az");
const sortZA = document.querySelector(".za");
const sortDT = document.querySelector(".dt");

// DROPDOWN

selectedOption.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

allOptions.forEach((option) => {
  option.addEventListener("click", () => {
    selectedOption.innerText = option.innerText;
    dropdown.classList.remove("open");
  });
});

// TODO APP

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

addBtn.addEventListener("click", () => {
  const text = input.value.trim();

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  // Time and Date

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timestamp = now.getTime();

  tasks.push({
    text,
    completed: false,
    date,
    time,
    timestamp,
    animate: true,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  input.value = "";
});

// SORTING

// Sort A - Z

sortAZ.addEventListener("click", () => {
  tasks.sort((a, b) => a.text.localeCompare(b.text));
  renderTasks();
});

// Sort Z - A

sortZA.addEventListener("click", () => {
  tasks.sort((a, b) => b.text.localeCompare(a.text));
  renderTasks();
});

// Sort Date & Time

sortDT.addEventListener("click", () => {
  tasks.sort((a, b) => a.timestamp - b.timestamp);
  renderTasks();
});

// Render Task

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
  <div class="task-left">
    <input type="checkbox" class="complete" ${task.completed ? "checked" : ""}>
    
    <div class="task-disc">
      <span class="task-text">${task.text}</span>
      <small class="date-time">📅 ${task.date} | ⏰ ${task.time}</small>
    </div>
  </div>

  <div class="btns">
    <span class="delete">Delete</span>
    <span class="edit">Edit</span>
  </div>
`;

    // Add animation only if animate = true

    if (task.animate) {
      li.classList.add("task-animation");
      task.animate = false;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      li.classList.add("task-noanimation");
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Task Completed

    if (task.completed) {
      const textElement = li.querySelector(".task-text");
      textElement.style.textDecoration = "line-through";
      textElement.style.opacity = "0.6";
    }

    // Toggle completed/uncompleted

    li.querySelector(".complete").addEventListener("change", () => {
      task.completed = !task.completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    // Delete task

    li.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    // Edit task

    li.querySelector(".edit").addEventListener("click", () => {
      const newText = prompt("Edit your task:", task.text);

      if (newText !== "" && newText.trim()) {
        task.text = newText.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      }
    });

    // Add the created <li> to DOM
    taskList.appendChild(li);
  });
}
