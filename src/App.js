import logo from './logo.svg';
import './App.css';
import {Fragment,useReducer} from 'react'
import Context from './Context'

import {BrowserRouter as Router,
  Routes,
  Route} from "react-router-dom";
  import Login from './Login';
  import Home from './Home';
function App() {
  const store = {
    IsLogIn:false,
    UserInfo:null,
  }
  const reducer = (state,action) => {
    switch (action.type){
      case "isLogin": return {...state,IsLogIn:!state.IsLogIn};
      case "UserInfo": return {...state,UserInfo:action.payload};
      default: return state
    }
  }
  const [state,setState] = useReducer(reducer,store);
  return (
<Context.Provider value={[state,setState]}>
  <Router>
       <Routes>
       <Route exact path="/" element={<Login/>}/>
        <Route exact path="/Home" element={<Home/>}/>
      </Routes>

     </Router> 
</Context.Provider>)
  
}

export default App;
