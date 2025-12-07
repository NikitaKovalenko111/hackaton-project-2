'use client'

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginForm } from "../login-form/login-form"
import { useState } from "react"
import { AuthMode } from "@/modules/auth/domain/auth.type"
import clsx from "clsx"
import { SignupForm } from "../signup-form/signup-form"

const variantStyleLogin: { [key in AuthMode]: string } = {
    login: 'left-0',
    signup: 'left-100'
}

const variantStyleSignup: { [key in AuthMode]: string } = {
    login: '-left-100',
    signup: 'left-0'
}

const variantStyleCard: { [key in AuthMode]: string } = {
    login: 'min-h-[395px]',
    signup: 'min-h-[580px]'
}

export const AuthForm = () => {

    const [mode, setMode] = useState<AuthMode>("login")

    const handleChangeMode = (value: AuthMode) => {
        setMode(value)
    }

    return (
        <Card className={clsx(
            "w-full max-w-sm relative overflow-hidden transition-all ease-in-out duration-300 animate-appear",
            variantStyleCard[mode]
        )} data-testid="auth-card">
            <div className={clsx(
                `flex top-6 flex-col gap-8 absolute w-full transition-[left]`,
                variantStyleLogin[mode]
            )}>
                <LoginForm handleChangeMode={handleChangeMode} />
            </div>
            <div className={clsx(
                `flex top-6 flex-col gap-8 absolute w-full transition-[left]`,
                variantStyleSignup[mode]
            )}>
                <SignupForm handleChangeMode={handleChangeMode} />
            </div>
        </Card>
    )
}