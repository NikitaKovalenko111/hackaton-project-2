import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

interface PeronsalTabProps {
    employee_name: string
    employee_surname: string
    employee_email: string
    isCurrentEmployee: boolean
    employee_status: string
}

export const PersonalTab = ({
    employee_email,
    employee_name,
    employee_status,
    isCurrentEmployee,
    employee_surname,
}: PeronsalTabProps) => {
    return (
        <TabsContent value="personal" className="space-y-6">
            <Card>
                <CardHeader>
                    {isCurrentEmployee ? (
                        <CardTitle>Личная информация</CardTitle>
                    ) : (
                        <CardTitle>Информация о сотруднике</CardTitle>
                    )}
                    {isCurrentEmployee && (
                        <CardDescription>
                            Здесь вы можете обновить личную информацию
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Имя</Label>
                            <Input
                                id="firstName"
                                style={{ opacity: 1 }}
                                disabled={!isCurrentEmployee}
                                defaultValue={employee_name}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Фамилия</Label>
                            <Input
                                style={{ opacity: 1 }}
                                disabled={!isCurrentEmployee}
                                id="lastName"
                                defaultValue={employee_surname}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={employee_email}
                                disabled={!isCurrentEmployee}
                                style={{ opacity: 1 }}
                            />
                        </div>
                        {/* <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" defaultValue="Senior Product Designer" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" defaultValue="Acme Inc." />
                    </div> */}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
