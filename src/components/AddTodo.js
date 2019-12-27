import React, { useState } from 'react'
import { StyleSheet, View, TextInput, Keyboard, Alert } from 'react-native'
import { THEME } from '../theme'
import { AntDesign } from '@expo/vector-icons'


export const AddTodo = ({ onSubmit }) => {

    const [value, setValue] = useState('');

    const pressHandler = () => {
        if (value.trim()) {
            onSubmit(value)
            setValue('')
            Keyboard.dismiss()
        } else {
            Alert.alert('Названия дела не может быть пустым')
        }
    }

    return (
        <View style={styles.block}>
            <TextInput
                style={styles.input}
                onChangeText={setValue}
                value={value}
                placeholder='Введите название дела'
                autoCorrect={false}
                autoCapitalize='none'
            />
            <AntDesign.Button onPress={pressHandler} name='pluscircleo'>
                Добавить
            </AntDesign.Button>
            {/* <Button title="Добавить" onPress={pressHandler} /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    block: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10
    },
    input: {
        width: '60%',
        borderStyle: 'solid',
        borderBottomWidth: 2,
        borderBottomColor: THEME.MAIN_COLOR
    }
})