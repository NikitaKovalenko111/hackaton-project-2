'use client'

import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateSkillDTO } from "@/modules/skills/domain/skills.types"
import { useCreateSkill } from "@/modules/skills/infrastructure/query/mutations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import z from "zod"

const zodSchema = z.object({
    skill_name: z.string().min(1, {message: "Название обязательно"}),
    skill_desc: z.string().min(1, {message: "Описание обязательно"}),
    company_id: z.number()
})

export const CreateSkill = ({
    companyId,
    handleCloseDialog
}: {
    companyId: number,
    handleCloseDialog: () => void
}) => {

    const {

        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue

    } = useForm<CreateSkillDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            skill_name: "",
            skill_desc: "",
            company_id: companyId
        }
    })

    useEffect(() => {
        setValue("company_id", companyId)
    }, [companyId])

    const {mutate} = useCreateSkill()

    const onSubmit: SubmitHandler<CreateSkillDTO> = (data) => {
        mutate(data)
        handleCloseDialog()
        reset()
    }

    return (
        <DialogContent className="animate-appear">
            <DialogHeader>
                <DialogTitle>Добавить компетенцию</DialogTitle>
                <DialogDescription>
                    Добавьте новую компетенцию. Нажмите "Добавить", когда закончите.
                </DialogDescription>
            </DialogHeader>
            <FieldSet className="grid gap-4">
                <form id="create-skill" onSubmit={handleSubmit(onSubmit)}>
                    <Controller 
                        name="skill_name"
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
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                        )}
                    />
                    <Controller 
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
                    />
                </form>
            </FieldSet>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Отмена</Button>
                </DialogClose>
                <Button type="submit" form="create-skill">Добавить</Button>
            </DialogFooter>
        </DialogContent>
    )
}