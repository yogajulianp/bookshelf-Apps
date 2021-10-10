const BELUMBaca = "incompleteBookshelfList";
const SELESAIBaca = "completeBookshelfList";
const TODO_ITEMID = "itemId";

function addBuku() {
    const bukuBelumDibaca = document.getElementById(BELUMBaca);
    const bukuSelesaiDibaca = document.getElementById(SELESAIBaca)

    const titleBuku = document.getElementById("inputBookTitle").value;
    const penulisBuku = document.getElementById("inputBookAuthor").value;
    const timestamp = document.getElementById("inputBookYear").value;
    const bukuSelesai = document.getElementById("inputBookIsComplete")
  

    if (bukuSelesai.checked === true ) {
        const buku = makeBukuList( titleBuku, penulisBuku, timestamp, true);
       
        const todoObject = composeTodoObject(titleBuku, penulisBuku, timestamp, true);
       
        buku[TODO_ITEMID] = todoObject.id;
        todos.push(todoObject);

        bukuSelesaiDibaca.append(buku);
        updateDataToStorage();

    } else {
        const buku = makeBukuList( titleBuku, penulisBuku, timestamp, false);
        
        const todoObject = composeTodoObject(titleBuku, penulisBuku, timestamp, false);
       
        buku[TODO_ITEMID] = todoObject.id;
        todos.push(todoObject);
        
        bukuBelumDibaca.append(buku);
        updateDataToStorage();
    }

}


function makeBukuList(title, penulis, year, isCompleted) {
 
    const textTitleBuku = document.createElement("h3");
    textTitleBuku.innerText = title;
 
    const textPenulisBuku = document.createElement("h5");
    textPenulisBuku.innerText = penulis;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = year;
 
    const textContainer = document.createElement("div");
    textContainer.classList.add("book_item")
    textContainer.append(textTitleBuku, textPenulisBuku, textTimestamp);
 
    const container = document.createElement("div");
    container.classList.add("book_shelf", "shadow")
    container.append(textContainer);


    if(isCompleted){
        container.append(createUndoButton(), createTrashButton() );
    } else {
        container.append(createCheckButton(), createTrashButton() );
    }
    return container;
}

function createButton(buttonTypeClass , text, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = text;
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}


function createCheckButton() {
    return createButton("green", "Selesai dibaca", function(event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(SELESAIBaca);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskPenulis = taskElement.querySelector(".book_item > h5").innerText
    const taskTimestamp = taskElement.querySelector(".book_item > p").innerText;
    
 
    const newTodo = makeBukuList(taskTitle, taskPenulis, taskTimestamp, true);
    
    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = true;
    newTodo[TODO_ITEMID] = todo.id;

    listCompleted.append(newTodo);
    taskElement.remove();

    updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
    const todoPosition = findTodoIndex(taskElement[TODO_ITEMID]);
    todos.splice(todoPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function createTrashButton() {
    return createButton("red", "Hapus", function(event){
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function undoTaskFromCompleted(taskElement){
    
    const listUncompleted = document.getElementById(BELUMBaca);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskPenulis = taskElement.querySelector(".book_item > h5").innerText
    const taskTimestamp = taskElement.querySelector(".book_item > p").innerText;
    
    const newTodo = makeBukuList(taskTitle, taskPenulis, taskTimestamp, false);
   
    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = false;
    newTodo[TODO_ITEMID] = todo.id;

    listUncompleted.append(newTodo);
    taskElement.remove();

    updateDataToStorage();
}
 
function createUndoButton() {
    return createButton("green", "Belum Selesai dibaca", function(event){
        undoTaskFromCompleted(event.target.parentElement);
    });
}