import { Button } from "@/components/ui/button";
import { CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormProps } from "@/modules/auth/domain/auth.type";

export const SignupForm = ({handleChangeMode}: LoginFormProps) => {

    return (
        <>
            <CardHeader>
                <CardTitle>Зарегестрируйтесь</CardTitle>
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
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Имя</Label>
                            <Input
                                id="name"
                                type="name"
                                placeholder="Введите ваше имя"
                                required
                                />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="surname">Фамилия</Label>
                            <Input
                                id="surname"
                                type="surname"
                                placeholder="Введите вашу фамилию"
                                required
                                />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Пароль</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Забыли пароль?
                                </a>
                        </div>
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full cursor-pointer">
                    Зарегестрироваться
                </Button>
            </CardFooter>
        </>
        
    );
}