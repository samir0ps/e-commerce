import { Request, Response, Router} from "express"; 
import { adminUserPreview, banUser, changeUserRole, deleteUserImage, editUserAccount, logout, search_users, userLogin, userPreview, userRegister } from "../controllers/userController";
import {IsEmailDuplicated , validateUser} from "../middlewares/SignUpVerfication"
import { checkUser, loggedIn, requireAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerUploadImages";
import { userImageUpload } from "../middlewares/setDirectory";
const router  = Router()

router.post("/register"  , [IsEmailDuplicated , validateUser] ,userRegister )
router.post("/login" , userLogin)
router.get("/logout" , loggedIn , logout)
router.get("/get-user" , checkUser , (req:Request , res:Response)=>{
    if(req.user){
        res.status(201).json({user:{info:req.user , status:"logged"}})
    }
    if(!req.user){
        res.status(201).json({user:{status:"Logged out"}})
    }
})
router.get("/admin/users-preview" , requireAdmin , adminUserPreview)
router.put("/edit/profile" , userImageUpload ,checkUser , upload.single("image"),editUserAccount)
router.delete ("/delete/user-image" , loggedIn , deleteUserImage)
router.get("/admin/user-preview" , requireAdmin , userPreview)
router.post("/ban-user" , requireAdmin , banUser)
router.put("/user-role" , requireAdmin , changeUserRole)
router.get("/search-users" , requireAdmin , search_users)
export {router as userRouter}