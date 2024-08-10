import { Outlet } from "react-router-dom";
import ListDetail from "./_components/list";

export default function DetailManagement(){
    return(
        <div>
            <ListDetail />
            <Outlet />  
    
        </div>
    )
}