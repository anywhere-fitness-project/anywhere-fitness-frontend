import React, { useState } from 'react'
import { connect } from 'react-redux'

import { useForm } from '../hooks/useForm'
import { classSchema } from '../services/classSchema'
import { axiosWithAuth } from '../utils/axiosWithAuth'
import { getClasses } from '../actions'


const initClassValues = {
    class_type: '',
    class_location: '',
    class_date: new Date(),
    class_time: '',
    class_duration: '',
    intensity_level: ''
}

const initErrors = {
    class_type: '',
    class_location: '',
    class_date: '',
    class_time: '',
    class_duration: '',
    intensity_level: ''
}

function ClassForm(props) {
    const { classToEdit, setDisplayClassForm, getClasses, setClassToEdit } = props
    const [
        classFormValues,
        errors,
        change,
        disabled
    ] = useForm(classToEdit ? classToEdit : initClassValues, initErrors, classSchema)
    const [err, setErr] = useState(null)

    const options = cb => cb()

    const add = e => {
        e.preventDefault()
        const newClass = {
            class_type: classFormValues.class_type,
            class_location: classFormValues.class_location,
            class_duration: parseInt(classFormValues.class_duration),
            class_date: classFormValues.class_date,
            class_time: classFormValues.class_time,
            intensity_level: parseInt(classFormValues.intensity_level)
        }
        axiosWithAuth()
            .post('/api/classes', newClass)
            .then(() => {
                getClasses()
                setDisplayClassForm(false)
            })
            .catch(err => {
                setErr(err.response.data.message)
            })
    }

    const edit = e => {
        e.preventDefault()
        const updatedClass = {
            class_type: classFormValues.class_type,
            class_location: classFormValues.class_location,
            class_duration: parseInt(classFormValues.class_duration),
            class_date: classFormValues.class_date,
            class_time: classFormValues.class_time,
            intensity_level: parseInt(classFormValues.intensity_level)
        }
        axiosWithAuth()
            .put(`/api/classes/${classFormValues.class_id}`, updatedClass)
            .then(() => {
                getClasses()
                setDisplayClassForm(false)
            })
            .catch(err => {
                setErr(err.response.data.message)
            })
    }

    const cancel = () => {
        setClassToEdit(initClassValues)
        setDisplayClassForm(false)
    }

    console.log('form renders')

    return (
        <div className='class-form-wrap'>
            <form className='class-form'>
                <label>Class type
                    <input
                        name='class_type'
                        type='text'
                        onChange={change}
                        value={classFormValues.class_type}
                    />
                </label>
                <label>Location
                    <input
                        name='class_location'
                        type='text'
                        value={classFormValues.class_location}
                        onChange={change}
                    />
                </label>
                <label>Date
                    <input
                        name='class_date'
                        type='date'
                        value={classFormValues.class_date}
                        onChange={change}
                    />
                </label>
                <label>Time
                    <input
                        name='class_time'
                        type='time'
                        value={classFormValues.class_time}
                        onChange={change}
                    />
                </label>
                <label>Duration (in minute)
                    <input
                        name='class_duration'
                        type='number'
                        value={classFormValues.class_duration}
                        onChange={change}
                    />
                </label>
                <label>Intensity
                    <select
                        name='intensity_level'
                        value={classFormValues.intensity_level}
                        onChange={change}
                    >
                        <option value='0'>--Select one--</option>
                        {options(() => {
                            const row = []
                            for (let i = 1; i <= 10; i++) {
                                row.push(<option value={i}>{i}</option>)
                            }
                            return row
                        })}

                    </select>
                </label>
                {classToEdit.class_id
                    ? <button
                        className='editClass-btn'
                        disabled={disabled}
                        onClick={edit}
                    >
                        Update class
                    </button>
                    : <button
                        className='addClass-btn'
                        disabled={disabled}
                        onClick={add}
                    >
                        Add class
                    </button>}

                <button
                    className='cancel-btn'
                    onClick={cancel}
                >
                    Cancel
                </button>
                {Object.values(errors).map((err, idx) => <div key={idx}>{err}</div>)}
                {err ? <div>{err}</div> : <></>}
            </form>
        </div>
    )
}

export default connect(null, { getClasses })(ClassForm)
