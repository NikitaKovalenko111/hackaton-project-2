import { Button } from "@/components/ui/button";
import { CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSignupDTO, LoginFormProps } from "@/modules/auth/domain/auth.type";
import { useSignup } from "@/modules/auth/infrastructure/query/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const zodSchema = z.object({
    employee_name: z.string().trim().min(1, {message: 'Имя обязательно'}),
    employee_surname: z.string().trim().min(1, {message: 'Фамилия обязательна'}), 
    employee_email: z.email({message: "Некорректный Email"}).min(2, {message: 'Email обязателен'}),
    employee_password: z.string().trim().min(6, {message: "Минимальная длина - 6 символов"})
})

const formStyleConditionErrors = [['mt-[30px]', 'gap-8'], ['mt-0', 'gap-8'], ['mt-0', 'gap-6'], ['mt-0', 'gap-4'], ['mt-0', 'gap-2']]

export const SignupForm = ({handleChangeMode}: LoginFormProps) => {

    const {

        handleSubmit,
        control,
        formState: {errors},
        reset

    } = useForm<AuthSignupDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            employee_name: '',
            employee_surname: '',
            employee_email: '',
            employee_password: ''
        }
    })

    const {mutate, isError, isSuccess} = useSignup()

    const onSubmit: SubmitHandler<AuthSignupDTO> = (data) => {
        mutate(data)
        reset()
    }

    return (
        <div className={clsx(
            "flex flex-col w-full transition-all",
            formStyleConditionErrors[Number(Object.keys(errors).length)][0],
            formStyleConditionErrors[Number(Object.keys(errors).length)][1]
        )}>
            <CardHeader>
                <CardTitle>Зарегистрируйтесь</CardTitle>
                <CardAction>
                    <Button 
                        className="cursor-pointer" 
                        variant="link"
                        onClick={() => handleChangeMode('login')}
                    >
                        Уже есть аккаунт? Войти
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldGroup className="flex flex-col gap-6">
                            <Controller 
                                name="employee_name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="name">Имя</FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            type="name"
                                            placeholder="Введите ваше имя"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            value={field.value}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller 
                                name="employee_surname"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="surname">Фамилия</FieldLabel>
                                        <Input
                                            {...field}
                                            id="surname"
                                            type="surname"
                                            placeholder="Введите вашу фамилию"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            value={field.value}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="employee_email"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            value={field.value}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="employee_password"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Field className="grid gap-2">
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">Пароль</FieldLabel>
                                        </div>
                                        
                                        <Input
                                            {...field}
                                            id="password" 
                                            type="password" 
                                            value={field.value}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </FieldSet>
                    
                </form>
            </CardContent>
            <CardFooter className="flex-col overflow-hidden">
                <Button type="submit" form="signup-form" className="w-full cursor-pointer">
                    Зарегестрироваться
                </Button>
            </CardFooter>
        </div>
        
    );
}