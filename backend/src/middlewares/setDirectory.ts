import { Request , Response , NextFunction } from "express";
let directory: string;

export const setDirectory = (dir: string) => {
    directory = dir;
};

export const getDirectory = () => {
    return directory;
};

export const categoryImageUpload = (req:Request, res:Response, next:NextFunction) => {
    setDirectory("server_images/categories_images");
    next();
};

export const userImageUpload = (req:Request, res:Response, next:NextFunction) => {
    setDirectory("server_images/user_images");
    next();
};