import { Button } from '@/components/ui/button'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ROLE_TRANSLATION, ROLES } from '@/libs/constants'
import { AddEmployeeDTO } from '@/modules/employees/domain/employees.type'
import { useAddEmployeeToCompany } from '@/modules/employees/infrastructure/query/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

interface AddEmployeeProps {
    companyId: number
    handleCloseDialog: () => void
}

const zodSchema = z.object({
    employee_role: z.enum([
        'hr',
        'developer',
        'teamlead',
        'techlead',
        'admin',
        'moderator',
    ]),
    employee_to_add_email: z.email({ message: 'Некорректный email' }),
    company_id: z.number(),
})

export const AddEmployee = ({
    companyId,
    handleCloseDialog,
}: AddEmployeeProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm<AddEmployeeDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            employee_role: 'developer',
            employee_to_add_email: '',
            company_id: companyId,
        },
    })

    const { mutate } = useAddEmployeeToCompany()

    const onSubmit: SubmitHandler<AddEmployeeDTO> = (data) => {
        mutate(data)
        handleCloseDialog()
        reset()
    }

    useEffect(() => {
        setValue('company_id', companyId)
    }, [companyId])

    return (
        <DialogContent className="animate-appear" data-testid="add-employee-dialog">
            <DialogHeader>
                <DialogTitle data-testid="add-employee-title">Добавить сотрудника</DialogTitle>
                <DialogDescription>
                    Добавьте сотрудника в свою компанию. Введите его почту.
                </DialogDescription>
            </DialogHeader>
            <FieldSet className="grid gap-4">
                <form
                    id="create-skill"
                    className="grid gap-4"
                    onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="employee_to_add_email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="grid gap-2">
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="Введите email"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    value={field.value}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="employee_role"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="select_employee">
                                    Роль
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id="form-rhf-complex-billingPeriod"
                                        aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Роль" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role, id) => (
                                            <SelectItem key={id} value={role}>
                                                {ROLE_TRANSLATION[role]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldDescription>
                                    Выберите роль сотрудника
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    {/* <Controller 
                        name="skill_desc"
                        control={control}
                        render={({field, fieldState}) => (
                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="desc">Описание</FieldLabel>
                            <Textarea
                                {...field}
                                id="desc"
                                placeholder="Введите описание"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                value={field.value}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                        )}
                    /> */}
                </form>
            </FieldSet>
            <DialogFooter>
                <DialogClose asChild>
                    <Button
                        variant="outline"
                        onClick={() => handleCloseDialog()}>
                        Отмена
                    </Button>
                </DialogClose>
                <Button type="submit" form="create-skill">
                    Добавить
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
