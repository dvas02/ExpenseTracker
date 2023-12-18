import { createContext, useReducer} from "react";

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({description, amount, date}) => {},
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, {description, amount, date}) => {},
});

function expensesReducer(state, action) { 
  // This functin must be outside of the provider function
  // Job of the function is to return a new state value (or return the same one)
  switch(action.type){
    case 'ADD':
      //const id = new Date().toString() + Math.random().toString();
      //return [{...action.payload, id: id}, ...state]
      return [action.payload, ...state]
    case 'SET': 
      //return action.paylaod
      const inverted = action.payload.reverse();
      return inverted;
    case 'UPDATE':
      const updatableExpenseIndex = state.findIndex(  //Finds element in array
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex]
      const updatedItem = {...updatableExpense, ...action.payload.data}
      const updatedExpenses = [...state]
      updatedExpenses[updatableExpenseIndex] = updatedItem
      return updatedExpenses
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload)

    default:
      return state;

  }
}

function ExpensesContextProvider({children}) {
  
  const [expensesState, dispatch] = useReducer(expensesReducer, []); 
  // Good for more complex state management
  
  function addExpense(expenseData){
    dispatch({type: 'ADD', payload: expenseData}); 
    //Need to name it the same as what you defined it in expenseReducer for type
    //payload is the typical name for the data you forward here
  }

  function setExpenses(expenses){
    dispatch({type: 'SET', payload: expenses})
  }

  function updateExpense(id, expenseData){
    dispatch({type: 'UPDATE', payload: {id: id, data: expenseData}}); 
  }

  function deleteExpense(id){
    dispatch({type: 'DELETE', payload: id}); 
  }

  const value ={
    expenses: expensesState,
    addExpense: addExpense,
    setExpenses: setExpenses,
    updateExpense: updateExpense,
    deleteExpense: deleteExpense,
  }

  return (
    <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
  )
}

export default ExpensesContextProvider