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
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    CreateSkillDTO,
    Orders,
    SkillLevel,
} from '@/modules/skills/domain/skills.types'
import {
    useCreateSkill,
    useCreateSkillOrder,
} from '@/modules/skills/infrastructure/query/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

// const zodSchema = z.object({
//     skill_name: z.string().min(1, {message: "Название обязательно"}),
//     skill_desc: z.string().min(1, {message: "Описание обязательно"}),
//     company_id: z.number()
// })

interface Skill {
    skill_shape_id: number
    skill_name: string
}

export const CreateOrder = ({
    companyId,
    handleCloseDialog,
    skills,
}: {
    companyId: number
    handleCloseDialog: () => void
    skills: Skill[]
}) => {
    const { mutate } = useCreateSkillOrder()

    const [skillId, setSkillId] = useState<number | null>(null)
    const [level, setLevel] = useState<SkillLevel | ''>('')
    const [countOrders, setCountOrders] = useState<number>(1)
    const [orders, setOrders] = useState<Orders[]>([
        {
            order_text: '',
        },
    ])
    const [orderTexts, setOrderTexts] = useState<string[]>([])
    const [isOrdersEmpty, setIsOrdersEmpty] = useState<boolean>(false)

    const handleAddCount = () => {
        setCountOrders((prev) => prev + 1)
        setOrders((prev) => [...prev, { order_text: '' }])
        setOrderTexts((prev) => [...prev, ''])
    }

    const handleMinusCount = () => {
        setCountOrders((prev) => (prev == 1 ? prev : prev - 1))
        setOrders((prev) => prev.slice(0, countOrders))
        setOrderTexts((prev) => prev.slice(0, countOrders))
    }

    const handleLevelChange = (val: SkillLevel) => {
        setLevel(val)
    }

    // useEffect(() => {
    //     console.log(orders)
    // }, [])

    // useEffect(() => {
    //     for (let i = 0; i < countOrders; i++) {
    //         if (!orders[i].order_text) {

    //             setIsOrdersEmpty(true)
    //             return
    //         }
    //     }
    //     setIsOrdersEmpty(false)
    // }, [orderTexts])

    const handleOrdersTextChange = (i: number, text: string) => {
        setOrders((prev) =>
            prev.map((item, id) =>
                id == i
                    ? {
                          order_text: text,
                      }
                    : item
            )
        )
        setOrderTexts((prev) => prev.map((val, id) => (id == i ? text : val)))
    }

    const onSubmit = () => {
        mutate({
            orders,
            skill_level: level as SkillLevel,
            skill_shape_id: skillId as number,
        })
    }

    const getOrders = (countOrders: number) => {
        const arr = new Array(countOrders).fill(0)
        return (
            <>
                {arr.map((item, i) => (
                    <div key={i} className="mb-2">
                        <FieldLabel className="mb-2" htmlFor={`order_${i + 1}`}>
                            Критерий
                        </FieldLabel>
                        <Textarea
                            placeholder="Введите описание критерия"
                            autoComplete="off"
                            value={orders[i].order_text}
                            onChange={(e) =>
                                handleOrdersTextChange(i, e.target.value)
                            }
                        />
                    </div>
                ))}
            </>
        )
    }

    // const {

    //     handleSubmit,
    //     control,
    //     formState: {errors},
    //     reset,
    //     setValue

    // } = useForm<CreateSkillDTO>({
    //     resolver: zodResolver(zodSchema),
    //     mode: 'onChange',
    //     defaultValues: {
    //         skill_name: "",
    //         skill_desc: "",
    //         company_id: companyId
    //     }
    // })

    // useEffect(() => {
    //     setValue("company_id", companyId)
    // }, [companyId])

    // const {mutate} = useCreateSkill()

    // const onSubmit: SubmitHandler<CreateSkillDTO> = (data) => {
    //     mutate(data)
    //     handleCloseDialog()
    //     reset()
    // }

    return (
        <DialogContent className="animate-appear" data-testid="create-order-dialog">
            <DialogHeader>
                <DialogTitle data-testid="create-order-title">Добавить регламент</DialogTitle>
                <DialogDescription>
                    Добавьте новый регламент для компетенции.
                </DialogDescription>
            </DialogHeader>
            <FieldSet className="grid gap-4">
                <form id="create-order">
                    <div className="mb-4">
                        <Select
                            onValueChange={(val) => setSkillId(Number(val))}
                            data-testid="create-order-skill-select"
                        >
                            <Label className="mb-2">Компетенция</Label>
                            <SelectTrigger className="w-[180px]" data-testid="create-order-skill-trigger">
                                <SelectValue placeholder="Компетенция" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Компетенция</SelectLabel>
                                    {skills.map((skill, id) => (
                                        <SelectItem
                                            key={id}
                                            value={String(
                                                skill.skill_shape_id
                                            )}>
                                            {skill.skill_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <Select
                            onValueChange={(val) => handleLevelChange(val as SkillLevel)}
                            data-testid="create-order-level-select"
                        >
                            <Label className="mb-2">Уровень</Label>
                            <SelectTrigger className="w-[180px]" data-testid="create-order-level-trigger">
                                <SelectValue placeholder="Уровень" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Уровень компетенции
                                    </SelectLabel>
                                    <SelectItem value="junior">
                                        Junior
                                    </SelectItem>
                                    <SelectItem value="junior+">
                                        Junior+
                                    </SelectItem>
                                    <SelectItem value="middle">
                                        Middle
                                    </SelectItem>
                                    <SelectItem value="middle+">
                                        Middle+
                                    </SelectItem>
                                    <SelectItem value="senior">
                                        Senior
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {getOrders(countOrders)}
                </form>
            </FieldSet>
            <DialogFooter className="relative">
                <div className="absolute left-0 flex gap-2">
                    <Button 
                        variant='outline' 
                        size='icon'
                        onClick={() => handleMinusCount()}
                        data-testid="create-order-remove-criterion-button"
                    >
                        <MinusIcon />
                    </Button>
                    <Button 
                        variant='outline' 
                        size='icon'
                        onClick={() => handleAddCount()}
                        data-testid="create-order-add-criterion-button"
                    >
                        <PlusIcon />
                    </Button>
                </div>
                <DialogClose asChild>
                    <Button variant="outline" data-testid="create-order-cancel-button">Отмена</Button>
                </DialogClose>
                <Button
                    onClick={() => {
                        onSubmit()
                        handleCloseDialog()
                    }} 
                    disabled={isOrdersEmpty || !level} 
                    type="submit" 
                    form="create-skill"
                    data-testid="create-order-submit-button"
                >
                    Добавить
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
