
import './App.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";

// import AuthContextProvider from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import { UserAuthContextProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

import MainLayout from './pages/MainLayout';
import InvitedPage from './pages/invitedPage';


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

      {/* <AuthContextProvider> */}
        <UserAuthContextProvider>
          <Routes>
            {/* <Route path='/Login' element={
            <div>
              <Login></Login>
            </div>
            }></Route> */}
            <Route path='/' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/login/:docId' element={<LoginPage/>}/>
            <Route path='/chello/*' element={<MainLayout/>}/>
            <Route path='/invited/:docId' element={<InvitedPage/>}/>


            {/* <Route path='/SignUp' element={<SignUp></SignUp>}></Route> */}
            {/* <Route path='/Account' elem
            
            ent={<Account></Account>}></Route> */}
            {/* <Route path='/form' element={<FormEx></FormEx>}></Route> */}
          </Routes>
        </UserAuthContextProvider>
      {/* </AuthContextProvider> */}
    </div>
   
  );
}

export default App;
