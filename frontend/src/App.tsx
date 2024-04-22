import './App.css'
import Navbar from './components/navbar'
import { Routes , Route , BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import LoadingComponent from './components/Loading'
import  {Suspense , lazy} from 'react'
import SearchPage from './pages/searchPage'
import NotFound from './pages/notFound'
import Cart from './pages/Cart'
import EditProduct from './pages/productEdit'
import OrderOneProduct from './pages/orderPage'
import SucceededPage from './pages/succeedPage'
const AccountSettings = lazy(()=>import ('./pages/settingPage')) 
const AddNewProduct = lazy(()=>import ('./pages/AddNewProduct')) 
const  Home =lazy(()=>import('./pages/Home'))
const Signup = lazy(()=>import('./pages/signup'))
const  Product = lazy(()=>import('./pages/products'))
const AdminDashboard = lazy(()=>import('./pages/adminDashboard'))
function App() {

  return (
    <>
      <title>

      </title>
      <BrowserRouter>
        <Suspense fallback={<div className='loading-suspense-container'><LoadingComponent/></div>}>
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Signup/>} />
            <Route path='/product/:id' element={<Product/>} />
            <Route path='/admin/dashboard' element={<AdminDashboard/>} />
            <Route path='/user/account/settings/:id'  element={<AccountSettings/>}/>
            <Route path="/admin/add-product" element={<AddNewProduct/>} />
            <Route path='/search' element={<SearchPage/>}/>
            <Route path='*' element={<NotFound/>} />
            <Route path='/cart/:id' element={<Cart/>}></Route>
            <Route path='/product-edit/:id' element={<EditProduct/>} />
            <Route path='/order/:id' element={<OrderOneProduct/>}/>
            <Route path='/success' element={<SucceededPage/>} />
          </Routes>
          </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
