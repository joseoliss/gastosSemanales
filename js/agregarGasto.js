const gastoBtn = document.getElementById('btn_agregarGasto')
const gastoTxt = document.getElementById('txt_gasto');
const montoTxt = document.getElementById('txt_monto');
const presupuestoDiv = document.getElementById("presupuesto");
const presupuestoSuma = document.getElementById("suma");
const presupuestoTxt = document.getElementById('txt_presupuesto');
const presupuestoBtn = document.getElementById('btn_presupuesto');
const form_gasto = document.getElementById('form-gasto');

function mensaje(msj, clase) {
    let mensaje = document.getElementById('mensajes')
    mensaje.innerHTML = `<p id="childMensaje">${msj}</p>`
    let contenido = document.getElementById('childMensaje')
    if (clase === true) {
        contenido.className = "alert alert-danger"
    } else {
        contenido.className = "alert alert-success"
    }

    setTimeout(function () {
        mensaje.removeChild(childMensaje)
    }, 2000);
}

function esNumero(valor) {
    if (!isNaN(valor)) {
        return true;
    } else {
        return false
    }
}

presupuestoBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if (presupuestoTxt.value !== "") {
        if (esNumero(presupuestoTxt.value)) {
            presupuestoDiv.innerHTML = `
            <div id="contenidoPresupuesto">
                <p class="h5 alert alert-dark  text-center">
                    Presupuesto: 
                    <strong id="p_presupuesto" class="h4">${presupuestoTxt.value}</strong> 
                </p>
            </div>
            `
            presupuestoTxt.disabled = true;
            presupuestoBtn.disabled = true;
        } else {
            mensaje("Por favor digite un presupuesto numérico", true)
            presupuestoTxt.value = ""
            presupuestoTxt.focus()
        }
    } else {
        mensaje("Por favor digite algún presupuesto", true)
        presupuestoTxt.value = ""
        presupuestoTxt.focus()
    }

})

gastoBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if (presupuestoDiv.childElementCount === 0) {
        mensaje("Debe digitar un presupuesto antes de incluir los gastos", true)
    } else {
        if (gastoTxt.value == "" || montoTxt.value == "") {
            mensaje("Por favor complete los campos de Nombre de gasto y Monto ", true)
        } else {
            if (esNumero(montoTxt.value)) {
                mensaje("Gasto agregado con éxito", false)
                agregarGasto()
            } else {
                mensaje("Monto no valido", true)
                montoTxt.value = ""
                montoTxt.focus()
            }
        }
    }
})



let cargarDatos = () => {
    let gastosGuardados = JSON.parse(localStorage.getItem('gastosGuardados'));
    let lista = document.getElementById('lista')
    let sumaGastos = 0;
    let presupuesto;
    lista.innerHTML = "";

    if (gastosGuardados != null) {
        for (let i = 0; i < gastosGuardados.length; i++) {
            let descripcion = gastosGuardados[i].descripcion;
            let monto = gastosGuardados[i].monto;

            sumaGastos = parseFloat(sumaGastos) + parseFloat(monto);
            if (presupuestoDiv.innerText === "") {
                presupuesto = gastosGuardados[i].presupuesto;
                presupuestoDiv.innerHTML = `
                <div id="contenidoPresupuesto">
                    <p class="h5 alert alert-dark  text-center">
                        Presupuesto: 
                        <strong id="p_presupuesto" class="h4">${presupuesto}</strong> 
                    </p>
                </div>
                `
                presupuestoTxt.value = "";
                presupuestoTxt.disabled = true;
                presupuestoBtn.disabled = true;
            }

            if (sumaGastos < document.getElementById('p_presupuesto').innerText) {
                presupuestoSuma.innerHTML = `
                    <p class="h5 alert alert-info text-center">Gastos toteles: ${sumaGastos}</p>
                `
            } else {
                presupuestoSuma.innerHTML = `
                    <p class="h5 alert alert-danger text-center">Gastos toteles: ${sumaGastos}</p>
                `
            }

            lista.innerHTML += `
            <div id="gasto" class="card mb-3">
                <div class="card-body">
                    <p class="h5" id="descripcion">Descripción: ${descripcion}</p>
                    <p class="h5">Monto: ${monto}</p>
                    <button onclick="eliminarGastos('${descripcion}')" class="form-control btn-danger">Eliminar</button>
                </div>
            </div>
        `;
        }
    }
}


let agregarGasto = () => {

    let descripcion = document.getElementById('txt_gasto').value
    let monto = document.getElementById('txt_monto').value
    let presupuesto = document.getElementById('p_presupuesto').innerText

    let gasto = {
        descripcion,
        monto,
        presupuesto
    }

    if (localStorage.getItem('gastosGuardados') === null) { //verifica si existe en local storage
        let gastos = [];
        gastos.push(gasto);
        localStorage.setItem('gastosGuardados', JSON.stringify(gastos));
    }
    else {
        let gastos = JSON.parse(localStorage.getItem('gastosGuardados'));
        gastos.push(gasto)
        localStorage.setItem('gastosGuardados', JSON.stringify(gastos))
    }


    form_gasto.reset()

    cargarDatos();
}

let eliminarGasto = (des) => {
    let gastos = JSON.parse(localStorage.getItem('gastosGuardados'));
    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].descripcion == des) {
            gastos.splice(i, 1);
        }
    }
    localStorage.setItem('gastosGuardados', JSON.stringify(gastos));
    cargarDatos()
}

cargarDatos()
