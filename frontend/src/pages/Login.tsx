    import { Link , useNavigate } from "react-router-dom"
    import { useState } from "react"
    import './styles/loginStyles.css'

    import background_image from "../components/images/E-Shop.png"
    import React from "react"
import PasswordSwitcher from "../subcomponents/switchingPassword"
import { useMutation  , useQueryClient} from "@tanstack/react-query"
import axios from "axios"
import ErrorMessage from "../subcomponents/errorMessage"


interface messageType{
    message : string
}
interface errorType {
    email? : messageType | null
    password ?: messageType |null
}
interface ErrorMessage { 
    response : {
        data : {
            error : string
        }
    }
}
    const Login = ()=>{
        const queryClient = useQueryClient()
        const navigate = useNavigate()
        const pathData = queryClient.getQueryData(['pathName'])
        const [error , setError] = useState<string | null>(null)
        const mutatation  = useMutation({
            mutationFn:async(userData : {})=>{
                await axios.post("http://localhost:3000/api/user/login" , userData)
                
            } , 
            onSuccess : ()=>{
                navigate(`${pathData}`)
                queryClient.invalidateQueries({queryKey:["user"]})
                queryClient.invalidateQueries({queryKey:["items"]})
            } ,
            onError(error:ErrorMessage) {
                setError(error.response.data.error)
            },
        })
        const handleError = ()=>{
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const validateEmail = regex.test(email)
            if(email === "" || email === null){
                setErrors((prev)=>({...prev ,email : {message:"Email is required!"}}))
            }
            else if(!validateEmail){
                setErrors((prev)=>({...prev , email:{message:"Email form is Invalid!"}}))
            }
            else{
                setErrors((prev)=>({...prev , email:null}))
            }
        if(password === "" || password === null){
            setErrors((prev)=>({...prev , password:{message:"Password is required!"}}))
        }else{
            setErrors((prev)=>({...prev , password:null}))
        }
        if(password === ""  || email === "" || !validateEmail || email === null || password === null){
            throw new Error("Invalid input!")
        }
        }
        const handleLoginSubmittion = (e:React.FormEvent<HTMLFormElement>)=>{
            try{

                e.preventDefault()
                handleError()
                mutatation.mutateAsync({email , password})
            }catch(error:any){
                setError(error.message)
            }
        }
        const [emailFocus , setEmailFocus] = useState<boolean>(false)
        const [passwordFocus , setPasswordFocus] = useState<boolean>(false)
        const [email , setEmail] = useState<string>("")
        const [password , setPassword] = useState<string>("")
        const [passwordType , setPasswordType] = useState<boolean>(false)
        const [errors  , setErrors] = useState<errorType | null>(null)
        const handleSettingEmail = (e:React.FormEvent<HTMLInputElement>)=>{
            setEmail((e.target as HTMLInputElement).value)
        }
        const handleSettingPassword = (e:React.FormEvent<HTMLInputElement>)=>{
            setPassword((e.target as HTMLInputElement).value)
        }
        return(
            <div className="login-container">
                <div className="image-login-container">
                    <img src={background_image}  className="login-image"/>
                </div>
                <div className="login-form-container">
                    <form onSubmit={handleLoginSubmittion} method="POST" className="login-form">
                        <h1 className="Login-header">Login</h1>
                        <div className="email-container">
                            <div className="email-sign">@</div>
                            <label style={errors?.email || error?{color:"rgba(193, 18, 31 , 0.5)"} : {}} htmlFor="email-inp" className={`${emailFocus || email !== ""?"floatingLabel":"email-label"} login-label`}>Email</label>
                            <input style={errors?.email || error ?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} onChange={handleSettingEmail} onFocus={()=>{setEmailFocus(true)}} onBlur={()=>{setEmailFocus(false)}} type="text"  id="email-inp" className="login-inp" />
                        </div>
                        <p className={`${errors?.email   ? "inp-err":"inp-succ"}`}>{errors?.email?.message}</p>
                        <div className="password-container">
                            <div className="password-sign-container">
                            <svg
                                className="password-sign"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M18 10.5C19.6569 10.5 21 11.8431 21 13.5V19.5C21 21.1569 19.6569 22.5 18 22.5H6C4.34315 22.5 3 21.1569 3 19.5V13.5C3 11.8431 4.34315 10.5 6 10.5V7.5C6 4.18629 8.68629 1.5 12 1.5C15.3137 1.5 18 4.18629 18 7.5V10.5ZM12 3.5C14.2091 3.5 16 5.29086 16 7.5V10.5H8V7.5C8 5.29086 9.79086 3.5 12 3.5ZM18 12.5H6C5.44772 12.5 5 12.9477 5 13.5V19.5C5 20.0523 5.44772 20.5 6 20.5H18C18.5523 20.5 19 20.0523 19 19.5V13.5C19 12.9477 18.5523 12.5 18 12.5Z"
                                    fill="currentColor"
                                />
                                </svg>
                            </div>
                            <label style={errors?.email || error?{color:"rgba(193, 18, 31 , 0.5)"} : {}} htmlFor="password-inp" className={`${passwordFocus || password !== ""?"floatingLabel":"password-label"} login-label`}>
                                Password
                            </label>
                            <input style={errors?.email || error ?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} onChange={handleSettingPassword} onFocus={()=>{setPasswordFocus(true)}} onBlur={()=>{setPasswordFocus(false)}} type={passwordType? "text" : "password"} id="password-inp" className="password-inp login-inp"/>
                        </div>
                        <p className={`${errors?.password ? "inp-err":"inp-succ"}`}>{errors?.password?.message}</p>
                        <div className="password-opt">
                            <PasswordSwitcher setPasswordType={setPasswordType} passwordType={passwordType}/>
                            <Link className="forget-password" to={"#"}>Forgot your password</Link>
                        </div>
                        
                        <div className="login-btn-container">
                            <button className="login-btn">LOGIN</button>

                        </div>
                        <div className="another-methods">
                            <div className="login-divider"><p className="or-text"><span>OR</span></p></div>
                            <div className="login-btns">
                                <button className="google-login">
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <path
                                            d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
                                            fill="currentColor"
                                        />
                                        </svg>
                                        <p className="google-text">Login with Google</p>
                                </button>
                                <button className="facebook-login">
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <path
                                        d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                                        fill="currentColor"
                                    />
                                    </svg>
                                    <p className="facebook-text">
                                        Login with Facebook
                                    </p>
                                </button>
                            </div>
                            
                        </div>
                        <p className="register-redirect">Don't have account?<Link className="register-link" to={"/register"}>Register</Link></p>
                    </form>
                </div>
                <ErrorMessage error={error} setError={setError} />
            </div>
        )
    }

    export default Login