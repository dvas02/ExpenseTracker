import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../components/UI/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses(){

  const [isFetching, setIsFetching] = useState(true)

  const [error, setError] = useState()

  const expensesCtx = useContext(ExpensesContext)

  //const [fetchedExpenses, setFetchedExpenses] = useState([])

  useEffect(() => {
    async function getExpenses(){
      setIsFetching(true)
      try{
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses)
      } catch (error){
        setError('Could not fetch expenses')
      }

      setIsFetching(false)
      //setFetchedExpenses(expenses)
    }
    getExpenses()
  }, [])

  function errorHandler(){
    setError(null)
  }


  if(error && !isFetching){
    return <ErrorOverlay message={error} onConfirm={errorHandler}/>
  }

  if(isFetching){
    return <LoadingOverlay />
  }


  const recentExpenses = expensesCtx.expenses.filter((expense) => {
  //const recentExpenses = fetchedExpenses.filter((expense) => {
    const today = new Date(); // Gives todays date
    const date7DaysAgo = getDateMinusDays(today, 7); // Gives us the date 7 days ago
    return (expense.date >= date7DaysAgo) && (expense.date <= today)
  })


  return (
    <ExpensesOutput 
    fallbackText="No expenses registered for the last 7 days" 
    expenses={recentExpenses} 
    expensesPeriod="Last 7 Days" />
    )
}

export default RecentExpenses;