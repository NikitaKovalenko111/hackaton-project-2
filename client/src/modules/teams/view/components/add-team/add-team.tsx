'use client'

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
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ROLE_TRANSLATION } from '@/libs/constants'
import { useGetCompanyEmployees } from '@/modules/employees/infrastructure/query/queries'
import { AddTeamDTO } from '@/modules/teams/domain/teams.type'
import { useCreateTeam } from '@/modules/teams/infrastructure/query/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

const zodSchema = z.object({
    team_name: z.string().min(1, { message: 'Название обязательно' }),
    team_desc: z.string().min(1, { message: 'Описание обязательно' }),
    company_id: z.number(),
    teamlead_id: z.string(),
})

export const AddTeam = ({
    companyId,
    handleCloseDialog,
}: {
    companyId: number
    handleCloseDialog: () => void
}) => {
    const { data } = useGetCompanyEmployees()

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm<AddTeamDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            company_id: companyId,
            team_name: '',
            team_desc: '',
            teamlead_id: '',
        },
    })

    useEffect(() => {
        setValue('company_id', companyId)
    }, [companyId])

    const { mutate } = useCreateTeam()

    const onSubmit: SubmitHandler<AddTeamDTO> = (data) => {
        mutate(data)
        handleCloseDialog()
        reset()
    }

    return (
        <DialogContent className="animate-appear" data-testid="add-team-dialog">
            <DialogHeader>
                <DialogTitle data-testid="add-team-title">Добавить команду</DialogTitle>
                <DialogDescription>
                    Добавьте новую команду. Нажмите "Добавить", когда закончите.
                </DialogDescription>
            </DialogHeader>
            <FieldSet className="grid gap-4">
<<<<<<< HEAD
                <form
                    id="create-skill"
                    className="grid gap-4"
                    onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="team_name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="grid gap-2">
                                <FieldLabel htmlFor="name">Название</FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    type="name"
                                    placeholder="Введите название"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    value={field.value}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
=======
                <form id="add-team-form" className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <Controller 
                        name="team_name"
                        control={control}
                        render={({field, fieldState}) => (
                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="name">Название</FieldLabel>
                            <Input
                                {...field}
                                id="name"
                                type="name"
                                placeholder="Введите название"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                value={field.value}
                                data-testid="add-team-name-input"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                        )}
                    />
                    <Controller
                        name="team_desc"
                        control={control}
<<<<<<< HEAD
                        render={({ field, fieldState }) => (
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
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
=======
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
                                data-testid="add-team-desc-input"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                        )}
                    />
                    <Controller
                        name="teamlead_id"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
<<<<<<< HEAD
                                <FieldLabel htmlFor="select_employee">
                                    Тимлид
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={String(field.value)}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id="form-rhf-complex-billingPeriod"
                                        aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Тимлид" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data?.map((employee, id) => (
                                            <SelectItem
                                                key={id}
                                                value={String(
                                                    employee.employee_id
                                                )}>
                                                {`${employee.employee_surname} ${employee.employee_name} (${ROLE_TRANSLATION[employee.role.role_name]})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldDescription>
                                    Выберите тимлида команды
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
=======
                            <FieldLabel htmlFor="select_employee">
                                Тимлид
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={String(field.value)}
                                onValueChange={field.onChange}
                                data-testid="add-team-teamlead-select"
                            >
                                <SelectTrigger
                                    id="form-rhf-complex-billingPeriod"
                                    aria-invalid={fieldState.invalid}
                                    data-testid="add-team-teamlead-trigger"
                                >
                                <SelectValue placeholder="Тимлид" />
                                </SelectTrigger>
                                <SelectContent>
                                {data?.map((employee, id) => (
                                    <SelectItem key={id} value={String(employee.employee_id)}>
                                    {`${employee.employee_surname} ${employee.employee_name} (${ROLE_TRANSLATION[employee.role.role_name]})`}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                Выберите тимлида команды
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
                            </Field>
                        )}
                    />
                </form>
            </FieldSet>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" data-testid="add-team-cancel-button">Отмена</Button>
                </DialogClose>
<<<<<<< HEAD
                <Button type="submit" form="create-skill">
                    Добавить
                </Button>
=======
                <Button type="submit" form="add-team-form" data-testid="add-team-submit-button">Добавить</Button>
>>>>>>> 406464a6635a45e452fdc7cc6ed7b58cbcdb014b
            </DialogFooter>
        </DialogContent>
    )
}
