const body = document.querySelector("body")
const createCircle = document.querySelector(".create-circle")
const todoInput = document.querySelector("#todo-input")
const todoForm = document.querySelector("#todo-form")
const items = document.querySelector(".items")
const counter = document.querySelector(".count")
const modal = document.querySelector(".modal")
const modalMessage = document.querySelector(".message")
const okBtn = document.querySelector(".ok")
const sunThemeChanger = document.querySelector(".sun")
const moonThemeChanger = document.querySelector(".moon")
const scrollbar = document.querySelector("::-webkit-scrollbar")
const xmark = document.querySelector(".xmark")
const clearCompleted = document.querySelector(".clear")
const allTodos = document.querySelectorAll(".all")
const activeTodos = document.querySelectorAll(".active")
const completedTodos = document.querySelectorAll(".completed-todos")

let dragged = null

let todos = !window.localStorage.todoApp 
? [] 
: JSON.parse(window.localStorage.getItem("todoApp")).todos

renderTodos(todos)

function renderTodos(listToRender) {
    if (items.children.length > 0) {
        for (let i = items.children.length - 1; i >= 0; --i) {
            items.children[i].remove()
        }
    }

    listToRender.forEach((item, index) => {
        let numberOfTodos = listToRender.length === 1 
            ? "1 item left" 
            : `${listToRender.length} items left`

        const todoItem = document.createElement("div")
        todoItem.className = "item"
        todoItem.setAttribute("draggable", "true")
    
        const itemText = document.createElement("div")
    
        const circle = document.createElement("div")
        circle.className = "circle"

        const input = document.createElement("input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("id", `checkbox${listToRender.length - index}`)
        input.className = "checkbox"

        if (item.isChecked) {
            itemText.className = "item-text completed"
            input.setAttribute("checked", "")
        } else {
            itemText.className = "item-text"
            if (input.hasAttribute("checked", "")) input.removeAttribute("checked", "")
        }
    
        circle.appendChild(input)
    
        const label = document.createElement("label")
        label.setAttribute("for", `checkbox${listToRender.length - index}`)
    
        circle.appendChild(label)
    
        itemText.appendChild(circle)
        itemText.innerHTML += item.text
    
        todoItem.appendChild(itemText)
        todoItem.innerHTML += '<svg class="cross" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" /></svg>'
    
        items.appendChild(todoItem)

        const crosses = document.querySelectorAll(".cross")

        crosses.forEach(cross => {
            cross.addEventListener("click", (event) => {
                const parentElement = event.target.nodeName === "svg" 
                ? event.target.parentNode
                : event.target.parentNode.parentNode

                todos = todos.filter(item => {
                    const innerContent = event.target.nodeName === "svg" 
                    ? event.target.previousSibling.innerText
                    : event.target.parentNode.previousSibling.innerText

                    return item.text !== innerContent
                })

                parentElement.remove()

                let numberOfTodos = items.children.length === 1 
                    ? "1 item left" 
                    : `${items.children.length} items left`

                counter.textContent = numberOfTodos

                if (items.children.length <= 5) {
                    items.style.overflowY = "hidden"
                }

                window.localStorage.setItem("todoApp", JSON.stringify({todos: todos, theme: body.className}))
            })
        })

        const labels = document.querySelectorAll("label")

        labels.forEach((checkbox) => {
            checkbox.addEventListener("click", (event) => {    
                                
                const parentElement = event.target.parentNode.parentNode

                if (!event.target.previousSibling.checked) {
                    for (let i = 0; i < listToRender.length; i++) {
                        if (listToRender[i].text === parentElement.textContent) {
                            listToRender[i] = {
                                ...listToRender[i],
                                isChecked: true
                            }
                        }
                    }

                    activeTodos.forEach(item => {
                        if (item.classList.contains("chosen")) {
                            todos = todos.map(todo => {
                                if (todo.text === parentElement.textContent) {
                                    return {
                                        ...todo,
                                        isChecked: true
                                    }
                                } else {
                                    return todo
                                }
                            })

                            let numberOfTodos = items.children.length === 1 
                            ? "1 item left" 
                            : `${items.children.length} items left`

                            counter.textContent = numberOfTodos

                            checkbox.parentElement.parentElement.parentElement.remove()
                        }
                    })

                    parentElement.classList.add("completed")

                    window.localStorage.setItem("todoApp", JSON.stringify({todos: todos, theme: body.className}))
                } else {
                    for (let i = 0; i < listToRender.length; i++) {
                        if (listToRender[i].text === parentElement.textContent) {
                            listToRender[i] = {
                                ...listToRender[i],
                                isChecked: false
                            }
                        }
                    }
                    completedTodos.forEach(item => {
                        if (item.classList.contains("chosen")) {
                            todos = todos.map(todo => {
                                if (todo.text === parentElement.textContent) {
                                    return {
                                        ...todo,
                                        isChecked: false
                                    }
                                } else {
                                    return todo
                                }
                            })

                            let numberOfTodos = items.children.length === 1 
                            ? "1 item left" 
                            : `${items.children.length} items left`

                            counter.textContent = numberOfTodos

                            checkbox.parentElement.parentElement.parentElement.remove()
                        }
                    })

                    parentElement.classList.remove("completed")

                    window.localStorage.setItem("todoApp", JSON.stringify({todos: todos, theme: body.className}))
                }
           })
        })

        todoItem.addEventListener("dragstart", (e) => {
            dragged = e.target
            dragged.classList.add("selected")
        })

        items.addEventListener("dragend", (e) => {
            e.preventDefault()

            dragged.classList.remove("selected")
        })
        
        counter.textContent = numberOfTodos
    })
}

function addNewTodo(e) {
    e.preventDefault()

    if (todoInput.value.trim() === "") {
        return
    } else {
        for (let i = 0; i < todos.length; i++) {    
            if (todos[i].text === todoInput.value) {
                todoInput.blur()
                modal.hidden = false
                okBtn.focus()
                modalMessage.textContent ="You already have a todo with this name!"
                return
            }
        }

        if (items.children.length >= 5) {
            items.style.overflowY = "scroll"
        }
        
        todos.unshift(
            {
                text: todoInput.value.trim(),
                isChecked: false
            }
        )

        todoInput.value = ""

        renderTodos(todos)

        activeTodos.forEach(item => {
            if (item.classList.contains("chosen")) {
                item.click()
            }
        })

        completedTodos.forEach(completedTodo => {
            if (completedTodo.classList.contains("chosen")) {
                completedTodo.click()
            }
        })
    }

    window.localStorage.setItem("todoApp", JSON.stringify({todos: todos, theme: body.className}))
}

function changeTheme() {
    body.classList.toggle("light-theme")

    window.localStorage.setItem("todoApp", JSON.stringify({todos: todos, theme: body.className}))
}

function hideModal(e) {
    if ((e.key === "Enter" || e.key === "Escape") || e.type === "click") {
        modal.hidden = true
    }

    setTimeout(() => { 
        todoInput.focus();
    }, 0)
}

function getNextElement(cursorPosition, currentElement) {
    const curElCoords = currentElement.getBoundingClientRect()

    const center = curElCoords.height/2 + curElCoords.y

    let nextElement = cursorPosition < center 
    ? currentElement
    : currentElement.nextElementSibling

    return nextElement
}

function arrayMove(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};

todoInput.addEventListener("focus", () => {
    const inputLabel = document.querySelector(".todo-label")
    
    inputLabel.style.paddingRight = "10px"
    inputLabel.textContent = "Currently typing"
    todoInput.placeholder = ""
})

todoInput.addEventListener("blur", () => {
    const inputLabel = document.querySelector(".todo-label")
    inputLabel.style.paddingRight = "0px"
    inputLabel.textContent = ""
    todoInput.placeholder = "Create a new todo..."
})

createCircle.addEventListener("click", (e) => addNewTodo(e))

todoForm.addEventListener("submit", (e) => addNewTodo(e))

okBtn.addEventListener("keydown", (e) => hideModal(e))

xmark.addEventListener("click", (e) => hideModal(e))

moonThemeChanger.addEventListener("click", changeTheme)

sunThemeChanger.addEventListener("click", changeTheme)

window.addEventListener("load", () => {
    setTimeout(() => {
        body.classList.remove("preload");
    }, 1000);
    
    body.className += !window.localStorage.todoApp
    ? "" 
    : " " + JSON.parse(window.localStorage.getItem("todoApp")).theme
})

clearCompleted.addEventListener("click", () => {
    todos = todos.filter(item => !item.isChecked)
    renderTodos(todos)
})

activeTodos.forEach(activeTodo => {
    activeTodo.addEventListener("click", () => {
        allTodos.forEach(item => {
            item.classList.remove("chosen")   
        })
        
        completedTodos.forEach(item => {
            item.classList.remove("chosen")   
        })

        activeTodos.forEach(item => {
            item.classList.add("chosen")
        })

        let listToRender = todos.filter(item => !item.isChecked)

        renderTodos(listToRender)

        let numberOfTodos = items.children.length === 1 
                    ? "1 item left" 
                    : `${items.children.length} items left`

                counter.textContent = numberOfTodos
    })
})

completedTodos.forEach(completedTodo => {
    completedTodo.addEventListener("click", () => {
        allTodos.forEach(item => {
            item.classList.remove("chosen")   
        })
        
        completedTodos.forEach(item => {
            item.classList.add("chosen")   
        })

        activeTodos.forEach(item => {
            item.classList.remove("chosen")
        })

        let listToRender = todos.filter(item => item.isChecked)

        renderTodos(listToRender)

        let numberOfTodos = items.children.length === 1 
        ? "1 item left" 
        : `${items.children.length} items left`

        counter.textContent = numberOfTodos
    })
})

allTodos.forEach(allTodo => {
    allTodo.addEventListener("click", () => {
        allTodos.forEach(item => {
            item.classList.add("chosen")   
        })
        
        completedTodos.forEach(item => {
            item.classList.remove("chosen")   
        })

        activeTodos.forEach(item => {
            item.classList.remove("chosen")
        })

        renderTodos(todos)
    })
})

items.addEventListener("dragover", (e) => {
    e.preventDefault()

    const currentElement = e.target

    const isMoveable = dragged !== currentElement &&
    currentElement.classList.contains("item");

    if (!isMoveable) {
        return;
    }
    
    const nextElement = getNextElement(e.clientY, currentElement)

    items.insertBefore(dragged, nextElement)

    const itemText = document.querySelectorAll(".item-text")

    let oldIndex

    todos.forEach((item, index) => {
        if (item.text === dragged.textContent) {
            oldIndex = index
        }
    })

    let newIndex

    itemText.forEach((item, index) => {
        if (item.textContent === dragged.textContent) {
            console.log(index)
            newIndex = index
        }
    })

    arrayMove(todos, oldIndex, newIndex)

    window.localStorage.setItem("todoApp", JSON.stringify({todos: todos, theme: body.className}))
})
