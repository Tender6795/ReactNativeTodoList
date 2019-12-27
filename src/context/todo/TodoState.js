import React, { useReducer, useContext } from 'react';
import { Alert } from 'react-native'
import { TodoContext } from './todoContext';
import { todoReducer } from './todoReducer'
import { ScreenContext } from '../screen/screenContext';
import {
    ADD_TODO,
    REMOVE_TODO,
    UPDATE_TODO,
    SHOW_LOADER,
    HIDE_LOADER,
    SHOW_ERROR,
    CLEAR_ERROR,
    FETCH_TODOS
} from '../types';


export const TodoState = ({ children }) => {
    const { changeScreen } = useContext(ScreenContext)
    const initialState = {
        todos: [],
        loading: false,
        error: null
    }
    const [state, dispatch] = useReducer(todoReducer, initialState)

    const addTodo = async title => {
        const responce = await fetch('', {
            method: "POST",
            headers: { 'Content-Type': 'aplication/json' },
            body: JSON.stringify({ title })
        })
        const data = await responce.json()
        dispatch({ type: ADD_TODO, title, id: data.name })

    }

    const removeTodo = id => {
        const todo = state.todos.find(t => t.id === id)
        Alert.alert(
            'Удаление элемента',
            `Вы уверены что хотите удалить ${todo.title} ?`,
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        changeScreen(null)
                        await fetch(``,{
                            method:'DELETE',
                            headers: { 'Content-Type': 'aplication/json' }
                        })
                        dispatch({ type: REMOVE_TODO, id })
                    },
                }
            ],
            { cancelable: false },
        );


    }

    const fetchTodos = async () => {
        showLoader()
        clearError()
        try {
            const responce = await fetch('', {
                method: "GET",
                headers: { 'Content-Type': 'aplication/json' },
            })
            const data = await responce.json()
            console.log('Fetch data ', data)
            const todos = Object.keys(data).map(key => ({ ...data[key], id: key }))
            dispatch({ type: FETCH_TODOS, todos })
        } catch (error) {
            showError('Что то пошло не так....')
            console.log(error)
        } finally {
            hideLoader()
        }
    }

    const updateTodo = async (id, title) => {
        clearError()
        try {
            await fetch(``, {
                method: 'PATCH',
                headers: { 'Content-Type': 'aplication/json' },
                body: JSON.stringify({ title })
            })
            dispatch({ type: UPDATE_TODO, id, title })
        } catch (error) {
            showError('Что то пошло не так....')
            console.log(error)
        }
    }

    const showLoader = () => {
        dispatch({ type: SHOW_LOADER })
    }

    const hideLoader = () => dispatch({ type: HIDE_LOADER })

    const showError = error => dispatch({ type: SHOW_ERROR, error })

    const clearError = () => dispatch({ type: CLEAR_ERROR })


    return (
        <TodoContext.Provider
            value={{
                todos: state.todos,
                loading: state.loading,
                error: state.error,
                addTodo,
                removeTodo,
                updateTodo,
                fetchTodos
            }}
        >
            {children}
        </TodoContext.Provider>
    )
}