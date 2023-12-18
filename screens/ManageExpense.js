import { StyleSheet, View } from "react-native";
import { useContext, useLayoutEffect, useState } from "react";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../ManageExpense/ExpenseForm";
import { storeExpense, updateExpense, deleteExpense } from "../components/UI/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({route, navigation}){

  const expensesCtx = useContext(ExpensesContext)

  const editedExpenseId = route.params?.expenseId; 
    //Safe way of drilling into an item if it is undefined
    // So the advantage of doing it this way, is that when you create a new expense
    // there will not be an id forwarded since it is new, so this will allow us to
    // check and adjust the screen between creating a new expense or managing an 
    // existing one

    const isEditing = !!editedExpenseId; // Convert a value into a boolean

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [error, setError] = useState()


    const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpenseId)


    useLayoutEffect(() => {
      navigation.setOptions({
        title: isEditing ? "Edit Expense" : "Add Expense", //Set the title dynamically
      })
    }, [navigation, isEditing])


  async function deleteExpenseHandler(){
    setIsSubmitting(true)
    try{
      await deleteExpense(editedExpenseId);
      expensesCtx.deleteExpense(editedExpenseId)
      navigation.goBack();
    } catch(error){
      setError('Could not delete expense - please try again later')
      setIsSubmitting(false)
    }
  }

  function cancelHandler() {
    navigation.goBack(); //Closes the model since it "goes back" to the screen before
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true)
    try{
      if(isEditing){ //EDIT
        expensesCtx.updateExpense(editedExpenseId, expenseData)
        await updateExpense(editedExpenseId, expenseData)
      }else{ //ADD
        const id = await storeExpense(expenseData); //Send to backend
        expensesCtx.addExpense({...expenseData, id: id}) //the 2nd id is the one made above
      }
      navigation.goBack();
    } catch (error){
      setError('Could not save data - please try again later')
      setIsSubmitting(false)
    }

  }

  function errorHandler(){
    setError(null)
  }

  if(error && !isSubmitting){
    return <ErrorOverlay message={error} onConfirm={errorHandler}/>
  }



  if(isSubmitting){
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container}>

      <ExpenseForm 
        onCancel={cancelHandler} 
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
        />

        {isEditing && <View style={styles.deleteContainer}>
          <IconButton 
          icon="trash" 
          color={GlobalStyles.colors.error500} 
          size={36}
          onPress={deleteExpenseHandler}
          />
        </View>
        }
    </View>
  )
}

export default ManageExpense;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    margin: 16,
    padding: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
})