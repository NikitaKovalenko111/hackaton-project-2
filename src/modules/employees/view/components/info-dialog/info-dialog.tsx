
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ROLE_TRANSLATION } from "@/libs/constants"
import { useGetEmployee } from "@/modules/employees/infrastructure/query/queries"
import { useGetSkill } from "@/modules/skills/infrastructure/query/queries"
import { memo, useEffect } from "react"
import { roleBadge } from "../../ui/role-badge"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { AddEmployeeToTeam } from "@/modules/employees/domain/employees.type"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetTeams } from "@/modules/teams/infrastructure/query/queries"
import { useAddEmployeeToTeam } from "@/modules/employees/infrastructure/query/mutations"
import { Team } from "@/modules/teams/domain/teams.type"
import { SkeletonInfoDialog } from "../../ui/skeleton-info-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface InfoDialogProps {
    skill_name: string
    skill_shape_id: number
}

const zodSchema = z.object({
    team_id: z.string(),
    employee_to_add_id: z.number()
})

export const InfoDialog = ({
    id,
    team,
    open
}: {
    id: number,
    team: Team | null,
    open: boolean
}) => {
    const {data, isLoading, isFetching, refetch, isSuccess} = useGetEmployee(id)

    const {data: teams, refetch: refetchTeams, isLoading: teamsLoading, isFetching: teamsFetching} = useGetTeams(data?.company.company_id || 0)


    useEffect(() => {
        refetchTeams()
    }, [isSuccess])

    useEffect(() => {
        refetch()
        refetchTeams()
        console.log(data?.team)
    }, [id, open])

    const {

        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue,
        getValues

    } = useForm<AddEmployeeToTeam>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            team_id: data ? String(data?.team.team_id) : '',
            employee_to_add_id: id
        }
    })

    useEffect(() => {
        if (id == data?.employee_id) {
            setValue('team_id', String(data.team.team_id))
        }
    }, [data])

    // useEffect(() => {
    //     if (data?.team && id == data.employee_id) {
    //         setValue("team_id", String(data.team.team_id))
    //     }
    // }, [data, isSuccess, id])

    // useEffect(() => {
    //     debugger
    //     if (data?.team && team?.team_id != data?.team.team_id && id == data.employee_id) {
    //         setValue('team_id', String(team?.team_id))
    //     } else {
    //         setValue('team_id', String(team?.team_id))
    //     }
        
    // }, [team, isLoading, isFetching, id])

    useEffect(() => {
        setValue("employee_to_add_id", id)
    }, [id])

    const {mutate} = useAddEmployeeToTeam()

    // if (isLoading || teamsLoading) {
    //     return (
    //         <div>
    //             loading
    //         </div>
    //     )
    // }

    const onSubmit: SubmitHandler<AddEmployeeToTeam> = (data) => {
        mutate(data)
    }
    
    return(
        <DialogContent>
                <DialogHeader>
                    {isLoading || teamsLoading || isFetching || teamsFetching ? (
                        <>
                            <DialogTitle>
                                <Skeleton className="w-30 h-4" />
                            </DialogTitle>
                            <Skeleton className="w-40 h-4" />
                        </>
                    ) : (
                        <>
                            <DialogTitle className="capitalize">Сотрудник {data?.employee_surname} {data?.employee_name}</DialogTitle>
                            <DialogDescription>
                                Полная информация о сотруднике
                            </DialogDescription>
                        </>
                    ) }
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="flex justify-center">
                        {isLoading || teamsLoading || isFetching || teamsFetching ? (
                            <Skeleton className="w-24 h-24 rounded-full" />
                        ) : (
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={data?.employee_photo}
                                    alt="Profile"
                                />
                                <AvatarFallback className="text-2xl">{`${data?.employee_name[0]}${data?.employee_surname[0]}`}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    <div>
                        {isLoading || teamsLoading || isFetching || teamsFetching ? (
                            <Skeleton className="w-40 h-5" />
                        ) : (
                            <>Роль: {roleBadge(data?.role.role_name!)}</>
                        )}
                    </div>
                    <div>
                        {isLoading || teamsLoading || isFetching || teamsFetching ? (
                            <Skeleton className="w-40 h-5" />
                        ) : (
                            <>Email: {data?.employee_email}</>
                        )}
                    </div>
                    {isLoading || teamsLoading || isFetching || teamsFetching ? 
                    (
                        <Skeleton className="w-full h-7" />
                    ) : (
                        <form id="add-employee-to-team-form" onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="team_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="select_employee">
                                        Команда
                                    </FieldLabel>
                                    <Select
                                        name={field.name}
                                        value={String(field.value)}
                                        defaultValue={team ? String(data?.team.team_id) : String(field.value)}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id="add-team"
                                            aria-invalid={fieldState.invalid}
                                        >
                                        <SelectValue placeholder="Команда" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {teams?.map((team, id) => (
                                            <SelectItem key={id} value={String(team.team_id)}>
                                                {team.team_name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription>
                                        Выберите команду для сотрудника
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    </Field>
                                )}
                            />
                        </form>
                    )}
                </div>
                {isLoading || teamsLoading || isFetching || teamsFetching ? (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Skeleton className="w-full sm:w-40 h-5" />
                        </DialogClose>
                        <Skeleton className="w-full sm:w-40 h-5" />
                    </DialogFooter>
                ) : (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Закрыть</Button>
                        </DialogClose>
                        <Button type="submit" form="add-employee-to-team-form">Сохранить</Button>
                    </DialogFooter>
                )}
        </DialogContent>
    )
}