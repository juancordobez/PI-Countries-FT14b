import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getAllCountrys, setLoading } from "../../actions/index";
import { Spin } from '../ui/Spin';
// Ruta de creación de actividad turística: debe contener

//  Un formulario controlado con los siguientes campos
// Nombre
// Dificultad
// Duración
// Temporada
//  Posibilidad de seleccionar/agregar varios países en simultaneo
//  Botón/Opción para crear una nueva actividad turística

export const ActividadScreen = () => {

    const allCountrys = useSelector(state => state.allCountrys)
    const dispatch = useDispatch()

    

    const [state, setState] = useState({
        name: '',
        dificultad: 1,
        duracion: 1,
        temporada: 'Verano',
        // imagen: '',
        pais: [],
    })
    
    const [error, setError] = useState({
        name: '',
        dificultad: '',
        duracion: '',
        temporada: '',
        // imagen: '',
        pais: ''
    })
    


    useEffect(() => {
        dispatch(getAllCountrys())
    }, [dispatch])
    
    
    
    const [namePais, setNamePais] = useState('')
    
    const validaciones = e => {
  
        switch (e.target.name) {
            case 'name':
                setError({
                    ...error,
                    name: e.target.value.length < 20 && e.target.value.length > 2 ? '' : 'Debe tener entre 3 y 20 caracteres'
                })
                break;
            case 'dificultad':
                setError({
                    ...error,
                    dificultad: Number(e.target.value) <= 5 && Number(e.target.value) >= 1 ? '' :  'Seleccione dificultad de 1 a 5'
                })
                break;
            case 'duracion':
                setError({
                    ...error,
                    duracion: Number(e.target.value) >= 1 ? '' : 'Seleccione una duracion valida.'
                })
                break;
            case 'temporada':
                setError({
                    ...error,
                    temporada: ['Verano', 'Otoño', 'Invierno', 'Primavera'].includes(e.target.value) ? '' : 'Debe seleccionar una temporada.' 
                })
                break;
            case 'pais':
                setError({
                    ...error,
                    pais: state.pais.length >= 0 ? '' : 'Debe seleccionar un pais o mas.'
                })
                break;

            default:
                break;
        }
    }
    const handleChange = (e) => {
        
        let { name, value } = e.target;
        console.log(value);
        if (name === 'pais') {
            if (state.pais.includes(value)) {
                setState({
                    ...state,
                    pais: state.pais.filter(x => x !== value)
                })
            } else {
                setState({
                    ...state,
                    pais: [...state.pais, value]
                })
            }
        } else {
            setState({
                ...state,
                [name]: value
            })
        }
        validaciones(e)
    }

    const handleChangeNamePais = (e) => {
        let { value } = e.target
        let str = value ? value[0].toUpperCase() + value.slice(1) : '';
        setNamePais(str)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(
            state.name.length &&
            state.dificultad > 0 &&
            state.duracion> 0 &&
            ['Verano', 'Otoño', 'Invierno', 'Primavera'].includes( state.temporada) &&
            state.pais.length > 0
        ){
            dispatch( setLoading())
            await fetch('http://localhost:3001/activity', {
                method: 'post',
                body: JSON.stringify(state),
                headers: { 'Content-Type': 'application/json' },
            });
            setState({
                name: '',
                dificultad: 1,
                duracion: 1,
                temporada: 'Verano',
                pais: []
            })
            dispatch( setLoading())

        }
    }

    return (
        <div className='row wrap'>
            <Spin />
            <form className='row wrap' onSubmit={handleSubmit}>

                <div className='row wrap'>
        <div className='column'>

                    <label className='input row'>
                        Activity name*:

                        <input
                            name="name"
                            className='input'
                            onChange={handleChange}
                            value={state.name}
                            placeholder="Activity"
                        />
                    </label>
                        <span className='input span1'>{error.name}</span>

                    <label className='input row' >
                        Difficulty*:

                        <input

                            type="range"
                            min='1'
                            max='5'
                            name="dificultad"
                            value={state.dificultad}
                            onChange={handleChange}
                        />

                    </label>
                    <span className='input span1'>{error.dificultad}</span>

                    <label className='input row'>
                        Duration*:

                        <input
                            name="duracion"
                            type="number"
                            onChange={handleChange}
                            value={state.duracion}
                            className='input'
                            min="1"
                        />

                        Hours
                    </label>
                    <span className='input span1'>{error.duracion}</span>

                    <label className='input row' >
                        Season*:

                        <select
                            name="temporada"
                            onChange={handleChange}
                            value={state.temporada}
                            className='input'
                            >
                            {/* // 'Verano', 'Otoño', 'Invierno', 'Primavera' */}
                            <option value="Verano">Summer</option>

                            <option value="Otoño">Autumn</option>

                            <option value="Invierno">Winter</option>

                            <option value="Primavera">Spring</option>

                        </select>
                    </label>
                    <span className='input span1'>{error.temporada}</span>

                    </div>
                {/* </div>
                <div className='column wrap'> */}

                
                    <label className=' input listDiv ' >

                        <input
                            className='input'
                            onChange={handleChangeNamePais}
                            value={namePais}
                            placeholder="Search country"
                        />
                        {
                            state.pais.length
                                ?
                                <ul className='row wrap input'>
                                    {
                                        allCountrys.filter(x => state.pais.includes(x.ID)).map(x =>
                                            <li key={x.ID} className='row input'>
                                                <span className='input'>{x.nombre}</span>
                                                <button className='cardBtn' type='button' value={x.ID} name="pais" onClick={handleChange}>
                                                    -
                                                </button>
                                            </li>
                                        )
                                    }
                                </ul>
                                :
                                null
                        }

                        <ul className='row wrap'>
                            {
                                allCountrys.filter(x => x.nombre.includes(namePais) && !state.pais.includes(x.ID)).map(x =>
                                    <li key={x.ID} className='row input'>
                                        <span className='input'>{x.nombre}</span>
                                        <button className='cardBtn' type='button' value={x.ID} name="pais" onClick={handleChange}>
                                            +
                                        </button>
                                    </li>
                                )
                            }
                        </ul>

                    </label>
                    <span className='input span1'>{error.pais}</span>

                </div>

                <div className='row wrap'>
                <span className='input span1'>(*) Mandatory input</span>

                <input  type='submit' value='Subir' className='btn' />
                </div>

            </form>

        </div>
    )
}
