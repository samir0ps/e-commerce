import { Link  , useNavigate} from "react-router-dom"
import { FormEvent, useState } from "react"
import background_image from "../components/images/E-Shop.png"
import React from "react"
import PasswordSwitcher from "../subcomponents/switchingPassword"
import "./styles/signup.css"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import ErrorMessage from "../subcomponents/errorMessage"

interface ErrorMessage{
    message: string
}
interface ErrorsTypes {
    firstName?: ErrorMessage | null
    lastName?: ErrorMessage | null
    email?: ErrorMessage | null
    password?: ErrorMessage | null
    confirmPassword?: ErrorMessage | null
    }
    interface Error_message { 
        response : {
            data : {
                error : string
            }
        }
    }
const Signup = ()=>{
    const queryClient = useQueryClient()
    const [emailFocus , setEmailFocus] = useState<boolean>(false)
    const [passwordFocus , setPasswordFocus] = useState<boolean>(false)
    const [email , setEmail] = useState<string>("")
    const [firstName , setFirstName] = useState<string>("")
    const [lastName , setLastName] = useState<string>("")
    const [firstNameFocus , setFirstNameFocus] = useState<boolean>(false)
    const [lastNameFocus , setLastNameFocus] = useState<boolean>(false)
    const [password , setPassword] = useState<string>("")
    const [passwordType , setPasswordType] = useState<boolean>(false)
    const [passwordConformation , setPasswordConformation] = useState<string>("")
    const [passwordCFocus , setPasswordCFocus] = useState<boolean>(false)
    const [errors , setErrors] = useState<ErrorsTypes| null>(null)
    const [error , setError] = useState<string | null>(null)
    const handleSettingEmail = (e:React.FormEvent<HTMLInputElement>)=>{
        setEmail((e.target as HTMLInputElement).value)
        setErrors((prev)=>({...prev ,email:null}))
    }
    const handleSettingFirstName= (e:React.FormEvent<HTMLInputElement>)=>{
        setFirstName((e.target as HTMLInputElement).value)
        setErrors((prev)=>({...prev ,firstName:null}))
    }
    const handleSettingLastName= (e:React.FormEvent<HTMLInputElement>)=>{
        setLastName((e.target as HTMLInputElement).value)
        setErrors((prev)=>({...prev ,lastName:null}))
    }
    const handleSettingPassword = (e:React.FormEvent<HTMLInputElement>)=>{
        setPassword((e.target as HTMLInputElement).value)
        setErrors((prev)=>({...prev ,password:null}))
    }
    const handleSettingPasswordConfirmation = (e:React.FormEvent<HTMLInputElement>)=>{
        setPasswordConformation((e.target as HTMLInputElement).value)
        setErrors((prev)=>({...prev ,confirmPassword:null}))
    }
    const navigate = useNavigate()
    const handleErrors = ()=>{
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validateEmail = regex.test(email)
        const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_()*&^%$#@!+=]).{10,}$/

        const validatePassword = passwordRegex.test(password)
        if(password==="" || password === null){
            setErrors((prev)=>({...prev ,password:{message:"Password is required"}}))
            
        }else if(!validatePassword){
            setErrors((prev)=>({...prev ,password:{message:"Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."}}))
        }
        
        else{
            setErrors((prev)=>({...prev ,password:null}))
        }
        if(email === "" || email === null){
            setErrors((prev)=>({...prev ,email:{message:"Email is required"}}))
        }else if(!validateEmail){
            setErrors((prev)=>({...prev ,email:{message:"Email form is not valid!"}}))
        }else{
            setErrors((prev)=>({...prev ,email:null}))
        }
        if(firstName === "" || firstName === null){
            setErrors((prev)=>({...prev ,firstName:{message:"First name is required"}}))
        }else{
            setErrors((prev)=>({...prev ,firstName:null}))
        }
        if(lastName === "" || lastName === null){
            setErrors((prev)=>({...prev ,lastName:{message:"Last name is required"}}))
        }else{
            setErrors((prev)=>({...prev ,lastName:null}))
        }
        if(passwordConformation !== password){
            setErrors((prev)=>({...prev ,confirmPassword:{message:"Password confirmation doesn't match"}}))
        }else if(passwordConformation ==="" || passwordConformation ===null){
            setErrors((prev)=>({...prev ,confirmPassword:{message:"Password confirmation is required"}}))
        }else{
            setErrors((prev)=>({...prev ,confirmPassword:null}))
        }
        if(password === "" || password === null || email === "" || email===null || !validateEmail || !validatePassword || passwordConformation === "" || passwordConformation===null || passwordConformation !== password || firstName===null || lastName === null || firstName === "" || lastName === ""){
            throw new Error("invalid input!")
        }
    }
    const mutation = useMutation({
        mutationFn:(newUser : object)=>{
            
            try {
                axios.defaults.withCredentials = true;
                return axios.post("http://localhost:3000/api/user/register", newUser);
                } catch (error) {
                throw new Error("Error occurred while signing up"); 
                }
            },
            onSuccess:()=>{
                queryClient.invalidateQueries({queryKey:["user"]})
                queryClient.invalidateQueries({queryKey:["userProfile"]})
                navigate("/")
            } ,
            onError(error:Error_message) {
                setError(error.response.data.error)
            },
        }
    )
    const handleSignup = async(e:FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()
            handleErrors()
            await mutation.mutateAsync({firstName:firstName , lastName:lastName , email:email , password:password})

        }catch(error:any){
            setError(error.message)
        }
        
    }
        
    return (
        <div className="login-container">
                <div className="image-login-container">
                    <img src={background_image}  className="login-image"/>
                </div>
                <div className="signup-form-container">
                    <form onSubmit={handleSignup} method="POST" className="signup-form">
                        <h1 className="signup-header">Register</h1>
                        <div className="name-container">
                            <svg className="svg-icon-signup" viewBox="0 0 20 20">
                                <path  d="M10,10.9c2.373,0,4.303-1.932,4.303-4.306c0-2.372-1.93-4.302-4.303-4.302S5.696,4.223,5.696,6.594C5.696,8.969,7.627,10.9,10,10.9z M10,3.331c1.801,0,3.266,1.463,3.266,3.263c0,1.802-1.465,3.267-3.266,3.267c-1.8,0-3.265-1.465-3.265-3.267C6.735,4.794,8.2,3.331,10,3.331z"></path>
                                <path d="M10,12.503c-4.418,0-7.878,2.058-7.878,4.685c0,0.288,0.231,0.52,0.52,0.52c0.287,0,0.519-0.231,0.519-0.52c0-1.976,3.132-3.646,6.84-3.646c3.707,0,6.838,1.671,6.838,3.646c0,0.288,0.234,0.52,0.521,0.52s0.52-0.231,0.52-0.52C17.879,14.561,14.418,12.503,10,12.503z"></path>
                            </svg>
                            <div className="first-name-container">
                                <label  htmlFor="first-inp" style={errors?.firstName?{color:"rgba(193, 18, 31 , 0.5)"} : {}} className={`${firstNameFocus || firstName !== ""?"floatingLabel-signup":"email-r-label"}  signup-label`}>First Name</label>
                                <input onChange={handleSettingFirstName} onFocus={()=>{setFirstNameFocus(true)}} onBlur={()=>{setFirstNameFocus(false)}}  type="text" id="first-inp" style={errors?.firstName?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} className="first-name signup-inp" />
                            </div>
                            <div className="last-name-container">
                                <label style={errors?.lastName?{color:"rgba(193, 18, 31 , 0.5)"} : {}}  htmlFor="first-inp" onFocus={()=>{setEmailFocus(true)}} onBlur={()=>{setEmailFocus(false)}} className={`${lastNameFocus || lastName !== ""?"floatingLabel-signup":"password-label-signup"} signup-label`}>Last Name</label>
                                <input onChange={handleSettingLastName} onFocus={()=>{setLastNameFocus(true)}} onBlur={()=>{setLastNameFocus(false)}} style={errors?.lastName?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} className="last-name signup-inp" />
                            </div>
                                <p className={`${errors?.firstName ? "inp-err":"inp-succ"}`}>{errors?.firstName?.message}</p>
                                <p className={`${errors?.lastName ? "inp-err":"inp-succ"}`}>{errors?.lastName?.message}</p>
                        </div>
                        <div className="email-container-signup">
                            <div className="email-sign-signup">@</div>
                            <label style={errors?.email?{color:"rgba(193, 18, 31 , 0.5)"} : {}}   htmlFor="email-inp-signup" className={`${emailFocus || email !== ""?"floatingLabel-norm-signup":"email-label-signup"} signup-norm-label`}>Email</label>
                            <input style={errors?.email?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} onChange={handleSettingEmail} onFocus={()=>{setEmailFocus(true)}} onBlur={()=>{setEmailFocus(false)}} type="text"  id="email-inp" className="signup-inp" />
                        </div>
                            <p className={`${errors?.email ? "inp-err":"inp-succ"}`}>{errors?.email?.message}</p>
                        <div className="password-container-signup">
                            <div className="password-sign-container-signup" >
                            <svg
                                className="password-sign-signup"
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
                            <label style={errors?.password?{color:"rgba(193, 18, 31 , 0.5)"} : {}}  htmlFor="password-inp-signup" className={`${passwordFocus || password !== ""?"floatingLabel-norm-signup":"password-label-signup"}  signup-norm-label`}>
                                Password
                            </label>
                            <input style={errors?.password?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} onChange={handleSettingPassword} onFocus={()=>{setPasswordFocus(true)}} onBlur={()=>{setPasswordFocus(false)}} type={passwordType? "text" : "password"} id="password-inp" className="password-inp-signup signup-inp"/>
                        </div>
                            <p className={`${errors?.password ? "inp-err":"inp-succ"}`}>{errors?.password?.message}</p>
                        <div className="password-confirmation-container-signup">
                        <div className="password-sign-c-container-signup">
                            <svg
                                className="password-sign-signup"
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
                            <label style={errors?.confirmPassword?{color:"rgba(193, 18, 31 , 0.3)"} : {}}  htmlFor="password-inp" className={`${passwordCFocus || passwordConformation !== ""?"floatingLabel-norm-signup":"password-label"}  signup-norm-label`}>
                                    Confirm Password
                                </label>
                                <input style={errors?.confirmPassword?{backgroundColor:"rgba(231, 111, 81 , 0.1)"} : {}} onChange={handleSettingPasswordConfirmation} onFocus={()=>{setPasswordCFocus(true)}} onBlur={()=>{setPasswordCFocus(false)}} type={passwordType? "text" : "password"} id="confirm-password-inp" className="password-inp-signup signup-inp"/>
                        </div>
                                <p className={`${errors?.confirmPassword ? "inp-err":"inp-succ"}`}>{errors?.confirmPassword?.message}</p>
                        <div className="password-opt-signup">
                            <PasswordSwitcher setPasswordType={setPasswordType} passwordType={passwordType}/>
                        </div>
                        
                        <div className="login-btn-container-signup">
                            <button className="login-btn-signup">{mutation.isPending ?"Signing up... ": "SIGNUP"}</button>
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
                                        <p className="google-text">Sign up using Google</p>
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
                                        Sign up using Facebook
                                    </p>
                                </button>
                            </div>
                            
                        </div>
                        <p className="register-redirect">Already have account?<Link className="register-link" to={"/login"}>Login</Link></p>
                    </form>
                </div>
                <ErrorMessage error={error} setError={setError}/>
            </div>
    )
}

export default Signup