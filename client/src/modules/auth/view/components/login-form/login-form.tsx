'use client'

import { Button } from '@/components/ui/button'
import {
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateEmail } from '@/libs/validators'
import { AuthLoginDTO, LoginFormProps } from '@/modules/auth/domain/auth.type'
import { useLogin } from '@/modules/auth/infrastructure/query/mutations'
import clsx from 'clsx'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useContext, useEffect, useState } from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { SocketContext } from '@/libs/hooks/useSocket'

const zodSchema = z.object({
    employee_email: z
        .email({ message: 'Некорректный Email' })
        .min(2, { message: 'Email обязателен' }),
    employee_password: z
        .string()
        .trim()
        .min(6, { message: 'Минимальная длина - 6 символов' }),
})

const formStyleConditionErrors = ['mt-[20px]', 'mt-[6px]', 'mt-0']

export const LoginForm = ({ handleChangeMode }: LoginFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<AuthLoginDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            employee_email: '',
            employee_password: '',
        },
    })

    const { regSocket } = useContext(SocketContext)

    const { mutate } = useLogin({ regSocket })

    const onSubmit: SubmitHandler<AuthLoginDTO> = (data) => {
        mutate(data)
        reset()
    }

    return (
        <div
            className={clsx(
                'flex flex-col gap-8 w-full transition-[margin-top]',
                formStyleConditionErrors[Number(Object.keys(errors).length)]
            )}>
            <CardHeader>
                <CardTitle data-testid="login-form-title">Войдите в ваш аккаунт</CardTitle>
                <CardAction>
                    <Button
                        className="cursor-pointer"
                        variant="link"
                        onClick={() => handleChangeMode('signup')}>
                        Зарегистрироваться
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet className="flex flex-col gap-6">
                        <FieldGroup>
                            <Controller
                                name="employee_email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            value={field.value}
                                            data-testid="login-email-input"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="employee_password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field className="grid gap-2">
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">
                                                Пароль
                                            </FieldLabel>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                                Забыли пароль?
                                            </a>
                                        </div>

                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            value={field.value}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            data-testid="login-password-input"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </FieldSet>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    type="submit"
                    form="login-form"
                    className="w-full cursor-pointer">
                    Войти
                </Button>
            </CardFooter>
        </div>
    )
}
