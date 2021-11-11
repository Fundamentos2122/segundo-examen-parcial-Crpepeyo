const attr_toggle="data-toggle";
const attr_target="data-target";
const attr_dismiss="data-dismiss";

const class_modal="modal";

const class_show="show";

const tareaForm=document.forms["tareaForm"];
const tareaList=document.getElementById("tareas");
const tareasKey= "tareas";
var todos=false;
 
document.addEventListener("DOMContentLoaded", function()
{
    //Botones que abren un modal
    let modal_open_buttons=document.querySelectorAll(`[${attr_toggle}='${class_modal}']`)

    modal_open_buttons.forEach(element => {
        element.addEventListener("click", OpenModal);
    });

    //Botones que cierran un modal
    let modal_close_buttons=document.querySelectorAll(`[${attr_dismiss}]`)

    modal_close_buttons.forEach(element => {
        element.addEventListener("click", CloseModal);
    });

    tareaForm.addEventListener("submit",addTarea);

    showTareas()
});

function checkboxClick(checkbox,id)
{  
    let tareas=getTareas();
    if(tareas==null)
    {
        tareas=[];
    }
    else
    {
        for (let index = 0; index < tareas.length; index++) {
            const element = tareas[index];
            if(element.id==id)
            {
                element.completado=checkbox.checked;
                break;
            }
        }
        localStorage.setItem(tareasKey,JSON.stringify(tareas));
        showTareas();
    }
}

function vertodosClick(checkbox)
{  
    todos=checkbox.checked;
    showTareas();
}

/**
 * Muestra un modal 
 * @param {PointerEvent} e 
 */
function OpenModal(e)
{
    //Obtener el selector del elemento a mostrar 
    let modal_selector=e.target.getAttribute(attr_target);

    //Obtener el elemento del DOM
    let modal=document.querySelector(modal_selector);

    //Agregar la clase para mostrar el modal 
    modal.classList.add(class_show);
}

/**
 * Cerrar un modal 
 * @param {PointerEvent} e 
 */
 function CloseModal(e)
 {
     //Obtener el selector del elemento a ocultar
     let modal_selector=e.target.getAttribute(attr_dismiss);
 
     //Obtener el elemento del DOM
     let modal=document.querySelector(modal_selector);
 
     //Quitar la clase para mostrar el modal 
     modal.classList.remove(class_show);
 }

 function addTarea(e)
 {
    
    //Detener el envio del formulario 
    e.preventDefault();

    //Obtener el texto del tweet 
    const tareaTitulo = tareaForm["titulo"].value;
    const tareaTexto = tareaForm["texto"].value;
    const tareaFecha = tareaForm["fecha"].value;
    const tareaId = Date.now();

    //Crear el nuevo elemento 
    const newTarea = document.createElement("div");

    //Anadir estilos y contenido 
    newTarea.className = "border-top";
    newTarea.innerHTML = 
    `
    <div class="row">
        <div class="col-7 col-S-8">
            <h3>${tareaTitulo}</h3>
        </div>
        <div ALIGN=RIGHT class="col-5 col-S-4">
            <h6>${tareaFecha}</h6>
        </div>
    </div>
    <p>${tareaTexto}</p>
    <div ALIGN=RIGHT style="margin-bottom: 1em;">
        <label for="C">Completada</label>
        <input id="C" onclick="checkboxClick(this,${tareaId})" type="checkbox">
    </div>
    `;
    
    //Se anade a la lista de tareas 
    tareaList.appendChild(newTarea);

    saveTarea({id:tareaId,tareaTitulo:tareaTitulo,tareaTexto:tareaTexto,tareaFecha:tareaFecha,completado:false});

 }

 function saveTarea(tarea)
{
    //Se anada a la lista de tweets
    let tareas=getTareas();

    tareas.push(tarea);

    //Guardar en LocalStorage
    localStorage.setItem(tareasKey,JSON.stringify(tareas));
}

//Obtiene los tweets de local storage 
function getTareas()
{
    //Obtenemos los datos del LocalStorage 
    let tareas=localStorage.getItem(tareasKey);
    
    //Verificamos si existe al menos uno 
    if(tareas==null)
    {
        tareas=[];
    }
    else
    {
        tareas=JSON.parse(tareas);
    }
    return tareas;
}

//Muestra los tweets guardados
function showTareas()
{
    while (tareaList.lastElementChild) {
        tareaList.removeChild(tareaList.lastElementChild)
    }
    let tareas=getTareas();
    tareas.forEach(tarea => {
        if (tarea.completado!=true || todos==true) {
            //Crear el nuevo elemento 
            const newTarea = document.createElement("div");

            //Anadir estilos y contenido 
            if (tarea.completado) 
                newTarea.className = "border-top bg-succes";
            else
                newTarea.className = "border-top";
            newTarea.innerHTML = 
            `
            <div class="row">
                <div class="col-7 col-S-8">
                    <h3>${tarea.tareaTitulo}</h3>
                </div>
                <div ALIGN=RIGHT class="col-5 col-S-4">
                    <h6>${tarea.tareaFecha}</h6>
                </div>
            </div>
            <p>${tarea.tareaTexto}</p>
            <div ALIGN=RIGHT style="margin-bottom: 1em;">
                <label for="C">Completada</label>
                <input id="C" ${tarea.completado?'checked':''} onclick="checkboxClick(this,${tarea.id})" type="checkbox">
            </div>

            `;
        
            //Se anade a la lista de tareas
            tareaList.appendChild(newTarea);
        }
    });
}

