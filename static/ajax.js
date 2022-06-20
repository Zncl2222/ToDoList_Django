function getCookie(name){

    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {

        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {

            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?

            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    
    return cookieValue;
}

function getAllTodos(url, is_blank) {
    
    $.ajax({

      url: url,
      type: "GET",
      dataType: "json",

      success: (data) => {
        
        const blank_warning = $("#blank-warning");
        blank_warning.empty();
        
        const todoList = $("#todoList");
        todoList.empty();

        const completeList = $("#completeList");
        completeList.empty();

        if (is_blank == 1){

          const warningelement = `* 不得為空值或空白(Space)`
          blank_warning.append(warningelement);
        }

        (data.all_todo).forEach(todo => {
        
          const todo_html_element = `

              <tr>
                <th scope="row" style="width:35rem">

                <p >${todo.content}</p>
                </th>
                <th scope="row">

                    <form id = "deletetodoform" style="display:inline-block;">
                      <button id =${todo.id} type="submit" class="btn btn-light" style="float:right" onclick=" return clicked_remove(${todo.id})">移除</button>
                    </form>
        
                    <form id = "completetodoform"  style="display:inline-block; ">
                  
                        <button type="submit" id =${todo.id} class="btn btn-light" style="float:right" onclick=" return clicked_complete(${todo.id})">完成</button>
        
                    </form>
                
                </th>
              </tr>
          
          
            `
          todoList.append(todo_html_element);
        });

        (data.all_complete).forEach(todo => {
        
        const complete_html_element = `
            <tr>                   
              <th scope="row" style="width:50rem">
                  ${todo.content}
                  <p  style="float:right;">${todo.date}</p>
              </th>
            </tr>
        `
          completeList.append(complete_html_element);
        });

      },
      
      error: (error) => {
        console.log(error);
      }
    });
  }
  
  
function addTodo(url, payload) {

    $.ajax({

      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({payload: payload,}),
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      async : true,

      beforeSend: function(){

        $("#send").attr({ disabled: "disabled" });

      },

      success: (data) => {
        
        getAllTodos(url,data.judge);

      },

      complete: function () {
        $("#send").removeAttr("disabled");
      },

      error: (error) => {
        console.log(error);
      }
    });
}

function completeTodo(url) {
  
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      async : true,

      success: (data) => {
        console.log(data);
      },

      complete: function () {
        
      },
      
      error: (error) => {
        console.log(error);
      }
    });
}

function deleteTodo(url) {

    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      async : true,

      success: (data) => {
        console.log(data);
        getAllTodos(url);
      },

      complete: function () {
        
      },

      error: (error) => {
        console.log(error);
      }
    });
}
