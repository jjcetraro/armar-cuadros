const fs = require('fs')

main()

function main(){
    const jugadores = getJugadores()
    if(jugadores.length%2 !== 0 || jugadores.length > 14){
        console.log(`Se debe seleccionar una cantidad par de jugadores, y no se puede seleccionar más de 14 jugadores [seleccionados = ${jugadores.length}]`)
        return
    }
    
    let mejorParidadEncontrada = 999999
    for(let opcion = 0; opcion < Math.pow(2,14); opcion++){
        if(!dejaIgualCantDeJugadoresEnCadaCuadro(opcion, jugadores.length/2)){
            continue
        }
        const cuadros = getCuadros(jugadores, opcion)
        const cuadroA = cuadros.cuadroA
        const cuadroB = cuadros.cuadroB
        if(!mismaCantidadDeAltosODiferenciaDe1(cuadroA, cuadroB)){
            continue
        }

        const paridad = getParidadEntreCuadros(cuadroA, cuadroB)
        if(paridad <= mejorParidadEncontrada){
            imprimirOpcion(cuadroA, cuadroB, paridad)
            mejorParidadEncontrada = paridad
        }
    }
}

function getParidadEntreCuadros(cuadroA, cuadroB){
    const puntajeTotalCuadroA = getPuntajeTotalCuadro(cuadroA)
    const puntajeTotalCuadroB = getPuntajeTotalCuadro(cuadroB)
    return Math.abs(puntajeTotalCuadroA - puntajeTotalCuadroB)
}

function getPuntajeTotalCuadro(jugadores){
    let ret = 0
    for(let i = 0; i < jugadores.length; i++){
        ret += getPuntajeTotalJugador(jugadores[i])
    }
    return ret
}

function getPuntajeTotalJugador(jugador){
    return jugador.defensaPerimetral + jugador.defensaInterna + jugador.tiroExterior*1.25 + jugador.ataqueInterior*1.25 + jugador.contragolpe*1.25 + jugador.pase*1.25
}

function imprimirOpcion(cuadroA, cuadroB, paridad){
    imprimirCuadro('Cuadro A', cuadroA)
    imprimirCuadro('Cuadro B', cuadroB)
    console.log(`Diferencia de puntaje: ${paridad}\n\n`)
}

function imprimirCuadro(nombreCuadro, jugadores){
    console.log(`${nombreCuadro} (${getPuntajeTotalCuadro(jugadores)} pts)`)
    console.log('--------------------')
    for(let i = 0; i < jugadores.length; i++){
        console.log(`${jugadores[i].nombre} (${getPuntajeTotalJugador(jugadores[i])} pts) ${jugadores[i].altura === 'alto' ? '[alto]' : ''}`)
    }
    console.log('')
}

function mismaCantidadDeAltosODiferenciaDe1(cuadroA, cuadroB){
    let cantAltosCuadroA = 0
    let cantAltosCuadroB = 0
    for(let i = 0; i < cuadroA.length; i++){
        if(cuadroA[i].altura === 'alto') cantAltosCuadroA++
        if(cuadroB[i].altura === 'alto') cantAltosCuadroB++
    }
    return Math.abs(cantAltosCuadroA - cantAltosCuadroB) <= 1
}

function getCuadros(jugadores, opcion){
    const opcionBinario = opcion.toString(2)
    const cuadroA = []
    const cuadroB = []
    for(let i = 0; i < jugadores.length; i++){
        if(opcionBinario[i] === '0'){
            cuadroA.push(jugadores[i])
        }else{
            cuadroB.push(jugadores[i])
        }
    }
    return {cuadroA, cuadroB}
}

function dejaIgualCantDeJugadoresEnCadaCuadro(opcion, cantJugadoresPorCuadro){
    const opcionBinario = opcion.toString(2)
    let cantCeros = 0
    let cantUnos = 0
    for(let i = 0; i < opcionBinario.length; i++){
        if(opcionBinario[i] === '0') cantCeros++
        else cantUnos++
    }
    return cantCeros === cantJugadoresPorCuadro && cantUnos === cantJugadoresPorCuadro
}

function getJugadores(){
    try{
        const data = fs.readFileSync('jugadores.txt', 'utf8')
        const lineas = data.split('\n')
        const ret = []
        for(let i = 0; i < lineas.length; i++){
            if(!lineas[i].endsWith('@')){
                continue;
            }
            lineas[i] = lineas[i].substring(0, lineas[i].length-1)
            const vecJugador = lineas[i].split(',')
            ret.push({
                nombre: vecJugador[0],
                defensaPerimetral: Number(vecJugador[1]),
                defensaInterna: Number(vecJugador[2]),
                tiroExterior: Number(vecJugador[3]),
                ataqueInterior: Number(vecJugador[4]),
                contragolpe: Number(vecJugador[5]),
                pase: Number(vecJugador[6]),
                altura: vecJugador[7],
            })
        }
        return ret
    }catch(e){
        console.log('Error: ', e.stack)
    }
}