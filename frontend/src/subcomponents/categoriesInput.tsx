import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../pages/styles/newProductPage.css";
import LoadingComponent from "../components/Loading";
import { FC, FormEvent, useState } from "react";
type PropsType = {
    setCategoriesSelected: React.Dispatch<React.SetStateAction<string[] | null>>;
    categoriesSelected : string[]  | null ; 
}

const CategoriesDropdown: FC<PropsType> = ({ setCategoriesSelected  , categoriesSelected}) => {
    const [categoriesFilter, setCategoriesFilter] = useState<any[] | null>(null);
    const categories = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:3000/api/product/all-categories");
            return response.data;
        },
    });
    const handleInputBlur = ()=>{
            setInpFocus(false)
    }
    const [inpFocus, setInpFocus] = useState<boolean>(false);

    const handleSelectedCategory = (name: string) => {
        if(categoriesSelected?.includes(name)){
            return 
        }else{

            setCategoriesSelected((prev) => [...(prev || []), name.toString()]);
        }
    };

    const handleFiltering = (e: FormEvent<HTMLInputElement>) => {
        const inputValue = (e.target as HTMLInputElement).value.toLowerCase();
        if (categories.isSuccess && categories.data && categories.data.length > 0) {
            const filteredCategories = categories.data.filter((category: any) => category.name.toLowerCase().includes(inputValue));
            setCategoriesFilter(filteredCategories);
        }
        if (e.currentTarget.value === "") {
            setCategoriesFilter(categories.data);
        }
    };

    return (
        <div className="drop-container">
            <div className="select-category">
                <input onChange={handleFiltering} onFocus={() => setInpFocus(true)} onBlur={handleInputBlur} type="text" placeholder="Write category name..." />
            </div>
            <div className={`${inpFocus ? "open-select" : "close-select"} options-category`}>
                {categories.isPending ? <LoadingComponent /> : !categories.data.message ? (categoriesFilter !== null ? categoriesFilter : categories.data).map((category: any) => (<div key={category.id} onClick={() => handleSelectedCategory(category.name)} className="option-category">
                    {category.name}
                </div>)) :
                    (<div className="empty">
                        {categories.data.message}
                    </div>)
                }
            </div>
        </div>
    )
}

export default CategoriesDropdown;
