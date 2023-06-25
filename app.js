const addBox = document.querySelector(".add-box"),
taskBox=document.querySelector(".task-box"),
popupBox = document.querySelector(".popup-box"),

filters=document.querySelectorAll(".filters span"),

titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i");


const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
//localstorage - that allows javascipt apps to save key value pair in a web browser with no expiration date
const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () =>{
    titleTag.focus();  // focus method for focusing on particular htmltag element 
    popupBox.classList.add("show");
});

filters.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTasks(btn.id);
    });
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    addBtn.innerText = " Add Task";
    popupTitle.innerText= "Add a New Task";
    popupBox.classList.remove("show");
});

function showTasks(filter){
    document.querySelectorAll(".task").forEach(task => task.remove());
    let liTag="";
    if(tasks){
        tasks.forEach((task,index) => {
            let isCompleted = task.status == "completed"?"checked":"";
            if(filter==task.status || filter=="all"){
                liTag+=`<li class="task">
                            <label for="${index}">
                              <input onclick="updateStatus(this)" type="checkbox" id="${index}" ${isCompleted}>
                              <div class="details">
                                <p>${task.title}</p>
                                <span>${task.description}</span>
                              </div>
                            </label>
                            <div class="bottom-content">
                              <span>${task.date}</span>
                              <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateTask(${index}, '${task.title}', '${task.description}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteTask(${index})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                              </div>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML=liTag || `<span>You don't have any tasks now</span>`;
}
showTasks("all");

function updateStatus(selectedTask){
    let taskName= selectedTask.parentElement.lastElementChild.firstElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        tasks[selectedTask.id].status="completed";
    }else{
        taskName.classList.remove("checked");
        tasks[selectedTask.id].status="pending";
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showMenu(elem){
    elem.parentElement.classList.add("show");
    //removing show class from settings menu on document click
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function updateTask(taskId,title,desc){
    isUpdate = true;
    updateId=taskId;
    addBox.click();
    titleTag.value = title;
    descTag.value =desc ;
    addBtn.innerText= "Update Task";
    popupTitle.innerText= "Update a Task";
}

function deleteTask(taskId){

    tasks.splice(taskId, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks("all");
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let taskTitle = titleTag.value,
    taskDesc = descTag.value;

    if(taskTitle || taskDesc){
        let dateObj=new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();

        let taskInfo = {
            title: taskTitle, description: taskDesc,
            date: `${month} ${day}, ${year}`,
            status:"pending"
        }
        if(!isUpdate) {
            tasks.push(taskInfo); // addding new task
        } else {
            isUpdate = false;
            tasks[updateId] = taskInfo; // updating specified task
        }
        //saving tasks to local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        closeIcon.click();
        showTasks("all");
    }
});