import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CreateCompanyDTO, GreetMode } from "@/modules/company/domain/company.type"
import { useCreate } from "@/modules/company/infrastructure/queries/mutations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"

interface CreateCompanyProps {
    handleModeChange: (value: GreetMode) => void
}

const zodSchema = z.object({
    company_name: z.string().min(1, 'Название обязательно')
})

export const CreateCompany = ({handleModeChange}: CreateCompanyProps) => {
    const {

        handleSubmit,
        control,
        formState: {errors},
        reset

    } = useForm<CreateCompanyDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            company_name: ''
        }
    })

    const {mutate, isError, isSuccess} = useCreate()

    const onSubmit: SubmitHandler<CreateCompanyDTO> = (data) => {
        mutate(data)
        reset()
    }

    useEffect(() => {
        if (isError) toast.error('Возникла ошибка!')
    }, [isError])

    useEffect(() => {
        if (isSuccess) toast.success('Компания создана!')
    }, [isSuccess])

    return (
        <div className="flex flex-col gap-8 w-full transition-[margin-top]">
            <CardContent>
                <form id="create-company-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet className="flex flex-col gap-6">
                        <FieldGroup>
                            <Controller
                                name="company_name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="company_name_input">Название</FieldLabel>
                                        <Input
                                            {...field}
                                            id="company_name_input"
                                            type="text"
                                            placeholder="Название компании"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            value={field.value}
                                            required
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup> 
                    </FieldSet>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form="create-company-form" className="w-full cursor-pointer">
                    Создать
                </Button>
                <Button 
                    className="w-full cursor-pointer"
                    variant="outline"
                    onClick={() => handleModeChange('info')}
                >
                    Назад
                </Button>
            </CardFooter>
        </div>
    );
}