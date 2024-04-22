import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/Loading";
import axios from "axios";
import "../App.css";
import "./styles/adminPageStyles.css";
import UserPreview from "../components/usersPreview";
import AdminCategories from "../components/categories_component";
import { useState } from "react";
import CreateCategory from "../components/createCategory";
import AdminTags from "../components/Tags_component";
import AddTagsComponent from "../components/TagsComponent";
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [openAddCategory , setOpenAddCategory] = useState<boolean>(false)
    const [openAddTag , setOpenAddTag] = useState<boolean>(false)
    const query = useQuery({
        queryKey: ["isAdmin"],
        queryFn: async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/get-user");
                const status = response.data.user.status;
                if (status === "Logged out") {
                    navigate("/");
                    throw new Error("Cannot load this page for normal user");
                } else {
                    const role = response.data.user.info.role;
                    if (role !== "ADMIN") {
                        navigate("/");
                        throw new Error("Cannot load this page for normal user");
                    } else {
                        return response.data;
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        }
    });

    return (
        <div className="admin-page">
            {!query.isPending ? (
                <div className="admin-d-container">
                    <h1 className="admin-header">Admin Dashboard</h1>
                    <h2 className="welcome-h">(Welcome Mr.{query.data.user.info.firstName})</h2>
                    <div className="admin-content-container">
                        <div className="categories-preview"><AdminCategories openAddCategory={openAddCategory} setOpenAddCategpry={setOpenAddCategory}/></div>
                        <div className="products-preview"><AdminTags openAddTag={openAddTag} setOpenAddTag={setOpenAddTag}/></div>
                        <div className="user-preview">
                            <UserPreview />
                            <CreateCategory openAddCategory={openAddCategory} setOpenAddCategory={setOpenAddCategory} />
                            <AddTagsComponent openAddTag={openAddTag} setOpenAddTag={setOpenAddTag}/>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='loading-suspense-container'><LoadingComponent /></div>
            )}
        </div>
    );
};

export default AdminDashboard;
