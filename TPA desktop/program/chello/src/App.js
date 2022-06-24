import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Navbar from './pages/Navbar';
import FormEx from './pages/FormEx';
import AuthContextProvider from './context/AuthContext';


function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path='/' element={<Home></Home>}></Route>
    //     {/* <Route path='/login' element={<Login></Login>}></Route> */}
    //   </Routes>
    // </BrowserRouter>
    <div>
      {/* <Home></Home>
      <Login></Login> */}
      {/* <h1 className='text-center text-3xl font-bold'>Firebase Auth</h1> */}

      <AuthContextProvider>
      <Routes>
         <Route path='/Login' element={
         <div>
           <Login></Login>
         </div>
         }></Route>
         <Route path='/SignUp' element={<SignUp></SignUp>}></Route>
         <Route path='/Account' element={<Account></Account>}></Route>
         <Route path='/form' element={<FormEx></FormEx>}></Route>
      </Routes>

      </AuthContextProvider>
    </div>
   
  );
}

export default App;
