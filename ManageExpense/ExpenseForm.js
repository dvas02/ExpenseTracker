import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "./Input";
import { useState } from "react";
import Button from "../components/UI/Button";
import { getFormattedDate } from "../util/date";
import { GlobalStyles } from "../constants/styles";



function ExpenseForm({onCancel, onSubmit, submitButtonLabel, defaultValues}) {
  const [inputs, setInputs] = useState({
    amount: {
      value : defaultValues ? defaultValues.amount.toString() : '', 
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : '',
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
    }
  }) 
  //No matter what the input is, it will always be text initially (so set 
  // intial value to be empty string)

  function inputChangedHandler(inputIdentifier, enteredValue){
    // Note: enteredValue is passed automatically be React Native
    setInputs((curInputValues) => {
      return{
        ...curInputValues,
        [inputIdentifier] : {value: enteredValue, isValid: true} 
      }
    })
  }

  function submitHandler(){
    const expenseData = {
      amount: +inputs.amount.value, //the "+" converts string to a number
      date: new Date(inputs.date.value),
      description: inputs.description.value
    }

    const amountIsVaid = expenseData.amount > 0 && !isNaN(expenseData.amount)
    const dateIsValid = expenseData.date.toString() !== 'Invalid Date' 
      // The invalid date is given to the date if its not valid
    const descriptionIsValid = expenseData.description.trim().length > 0
      // trim removes excess white space at the start and end
    
    if(!amountIsVaid || !dateIsValid || !descriptionIsValid){
      //Alert.alert("Invalid input", "Please check your input values")
      setInputs((curInputs) => {
        return{
          amount: {value: curInputs.amount.value, isValid: amountIsVaid},
          date: {value: curInputs.date.value, isValid: dateIsValid},
          description: {value: curInputs.description.value, isValid: descriptionIsValid}
        }
      })
      return; // Stop function execution so the form is not submitted
    }

    onSubmit(expenseData)
  }

  const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid

  return (
    <View style={styles.form}>

      <Text style={styles.title}>Your Expense</Text>

      <View style={styles.inputsRow}>
        <Input 
          label="Amount" 
          invalid={!inputs.amount.isValid}
          style = {styles.rowInput}
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'amount'), 
              //Function that does something when the user clicks enter
              //Do not need to pass enteredValue since its passed automatically
            value: inputs.amount.value
          }}

        />
        <Input 
          label="Date" 
          invalid={!inputs.date.isValid}
          style = {styles.rowInput}
          textInputConfig={{
            placeholder: 'YYYY-MM-DD',
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, 'date'),
            value: inputs.date.value
          }}

          />
      </View>
      
    
      <Input label="Description" invalid={!inputs.description.isValid} textInputConfig={{
        multiline: true, //allows multiple lines of text
        //autoCorrect: false, //Default is true
        //autoCapitalize: 'none', //Default is set to 'sentences'
        onChangeText: inputChangedHandler.bind(this, 'description'),
        value: inputs.description.value
        
      }}/>

      {formIsInvalid && (
        <Text style={styles.errorText}>Invalid input values - please check your entered data</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>Cancel</Button>
        <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
      </View> 

    </View>
  )
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
    textAlign: 'center',
    margin: 8,
  }
})