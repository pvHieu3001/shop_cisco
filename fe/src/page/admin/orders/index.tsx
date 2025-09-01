import { Outlet } from "react-router-dom";
import ListOrders from "./_components/list";

export default function ProductOrdersManagement(){
    return (
        <div>
            <ListOrders/>
            <Outlet />  
        </div>
    )
}