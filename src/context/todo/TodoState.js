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
import { Http } from '../../http'

export const TodoState = ({ children }) => {
    const { changeScreen } = useContext(ScreenContext)
    const initialState = {
        todos: [],
        loading: false,
        error: null
    }
    const [state, dispatch] = useReducer(todoReducer, initialState)

    const addTodo = async title => {
        clearError()
        try {
            const data = await Http.post(
                'https://rn-todo-app-c79d8.firebaseio.com/todos.json',
                { title }
            )
            dispatch({ type: ADD_TODO, title, id: data.name })
        } catch (error) {
            showError('Что пошло не так')
        }
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
                        clearError()
                        try {
                            await Http.delete(`https://rn-todo-app-c79d8.firebaseio.com/todos/${id}.json`,'DELETE')
                        } catch (error) {
                            showError('Что пошло не так')
                        }
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
            const data = await Http.get(`https://rn-todo-app-c79d8.firebaseio.com/todos.json`)
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
            await Http.patch(`https://rn-todo-app-c79d8.firebaseio.com/todos/${id}.json`,{title})
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