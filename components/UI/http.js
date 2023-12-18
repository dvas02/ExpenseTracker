import axios from 'axios'

const BACKEND_URL = 'https://expense-tracker-6801c-default-rtdb.firebaseio.com'
const MISTAKE_BACKEND_URL = 'https://expense-tracker-6801c-default-rtdb.fireaseio.com'

export async function storeExpense(expenseData){
  const response = await axios.post(
    MISTAKE_BACKEND_URL + '/expenses.json',
    // Second argument is the value to be sent
    expenseData
    // We only need to pass the amount/date/description not the id since one is generated
    // automatically by firebase
    ); 
    //Reques to create a new piece of data
    // The link is the one firebase gives us. Then we can add segments (these become
    // like folders in the database), here we added expenses. Each segment must have
    // the .json at the end

    const id = response.data.name;
    return id
}

export async function fetchExpenses(){
  const response = await axios.get(MISTAKE_BACKEND_URL + '/expenses.json'); 

  const expenses = []

  //console.log(response.data) -> can do this to see what the output is

  for(const key in response.data){
    // the keys are the ids of the expenses made by firebase
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date), //convert it str to date
      description: response.data[key].description,
    }
    expenses.push(expenseObj)
  }
  return expenses; //Now they have the format we want

}

export function updateExpense(id, expenseData){
  // To update we use put request
  return axios.put(MISTAKE_BACKEND_URL + `/expenses/${id}.json`, expenseData)
    //This is how you access specific items in firebase
    // What we are doing here is taking the expenseData and replacing the existing 
    // data at id
}


export function deleteExpense(id){
  return axios.delete(MISTAKE_BACKEND_URL + `/expenses/${id}.json`)
  // Delete items in firebase
}