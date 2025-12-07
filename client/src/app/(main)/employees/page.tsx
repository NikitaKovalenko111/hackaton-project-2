import ProtectedRoute from "@/libs/protected-route";
import { Employees } from "@/modules/employees/view/components/employees/employees";

export default function EmployeesPage() {

    return (
        <div className="w-full">
            <Employees />
        </div>
    )
}