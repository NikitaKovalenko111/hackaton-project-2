'use client'

import "./calendar.css"
import {useState, useRef, useEffect} from 'react'


// Calendar
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import {EventClickArg} from '@fullcalendar/core'

// Form & validation
import toast from 'react-hot-toast'
// import 'react-datepicker/dist/react-datepicker.css'
import CalendarWrapper from '@/libs/view/calendar-wrapper/calendar-wrapper'
// import { ComeToBankGet, createComeToBank, DebtorBank, getComesToBank, getDebtors, TaskType } from '@/api/requests/calendar'
// import { getAllUsers } from '@/api/requests/users'
// import { useAuth } from '@/hooks/useAuth'
// import { CalendarDataDialog } from '@/views/components/calendar/CalendarDataDialog'
// import { Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material'
import { InterviewData, InterviewDTO, InterviewType } from '@/modules/interviews/domain/interviews.types'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z, { set } from 'zod'
import { useGetInterviews } from '@/modules/interviews/infrastructure/query/queries'
import { CalendarIcon, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddInterview, useFinishInterview } from "@/modules/interviews/infrastructure/query/mutations"
import { useGetTeamInfo } from "@/modules/teams/infrastructure/query/queries"
import { Employee } from "@/modules/profile/domain/profile.types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog"
import { getInterviewType } from "../../ui/interview-type"
import ProtectedRoute from "@/libs/protected-route"
import { useAuth } from "@/libs/providers/ability-provider"
// import { getBankList } from '@/api/requests/income'

// Types

const getCurrentView = (view: string) => {
    if (view === 'dayGridMonth') return 'month'
    if (view === 'dayGridWeek') return 'week'
    if (view === 'dayGridDay') return 'day'

    return 'month'
}



// export const getBankName = (bank: string) => {
//     if (bank === 'Alfa') return 'Альфа-Банк'
//     if (bank === 'Sberbank') return 'Сбербанк'
//     if (bank === 'PSB') return 'ПСБ'
//     if (bank === 'VTB') return 'ВТБ'
//     if (bank === 'Tbank') return 'ТБанк'

//     return bank
// }

// export const isDebtorInStages = (id: number, stages: any[]) => {
//     const res = stages.find((debtorId) => debtorId === id)

//     return res
// }

const zodSchema = z.object({
    interview_subject: z.string(),
    interview_date: z.date({message: 'Дата собеседования обязательна'}),
    interview_desc: z.string(),
    interview_type: z.string().refine((data) => ['tech', 'soft', 'hr', 'case'].includes(data) ).min(1, {message: 'Выберите тип собеседования'})
})

const interviewTypes: InterviewType[] = ['case', 'hr', 'soft', 'tech']

const CalendarInterview = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [events, setEvents] = useState<InterviewData[]>([])
    const [calEvents, setCalEvents] = useState<any>([])
    const [isAddEventDialogOpen, setAddEventDialogOpen] = useState(false)
    const [isFinishEventDialogOpen, setFinishEventDialogOpen] = useState(false)

    const handleCloseFinishEventDialog = () => {
        setFinishEventDialogOpen(false)
    }

    const { role } = useAuth()

    // const [calendarEvents, setCalendarEvents] = useState<>([])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [calendarApi, setCalendarApi] = useState<any>(null)
    const [selectedEvent, setSelectedEvent] = useState<InterviewData | null>(null)
    const [isViewEventDialogOpen, setViewEventDialogOpen] = useState(false)
    const [currentView, setCurrentView] = useState('dayGridMonth')

    const calendarRef = useRef<FullCalendar | null>(null)

    const [employees, setEmployees] = useState<Employee[]>([])

    const {data: teamInfo, refetch: refetchTeamInfo, isRefetching: isTeamInfoRefetching} = useGetTeamInfo()
    
    useEffect(() => {
        refetchTeamInfo()
    }, [])

    useEffect(() => {
        if (teamInfo && teamInfo.employees) {
            const empls: Employee[] = teamInfo.employees.filter(empl => empl.employee_id != teamInfo.teamlead.employee_id)
            setEmployees(empls)
        }
    }, [teamInfo])

    // const [data, setData] = useState<InterviewData[]>([])

    const {

        handleSubmit,
        control,
        formState: {errors},
        reset

    } = useForm<InterviewDTO>({
        resolver: zodResolver(zodSchema),
        mode: 'onChange',
        defaultValues: {
            interview_date: new Date(),
            interview_desc: '',
            interview_subject: '',
            interview_type: 'case'
        }
    })

    const {mutate} = useAddInterview()
    const {mutate: mutateFinish} = useFinishInterview()

    const onSubmit: SubmitHandler<InterviewDTO> = (data) => {
        // setEvents(prev => [...prev, data])
        // const positiveData: InterviewData | InterviewDTO = {
        //     interview_date: data.interview_date,
        //     interview_subject: teamInfo?.employees.find(empl => empl.employee_id == Number(data.interview_subject)),
        //     interview_owner: teamInfo?.teamlead,
        //     interview_type: data.interview_type as InterviewType,
        //     interview_desc: data.interview_desc,
        //     interview_id: events[-1].interview_id+1
        // }
        // setEvents(prev => [...prev, positiveData])
        setLoading(true)
        mutate(data)
        setTimeout(() => {
            setAddEventDialogOpen(false)
            setLoading(false)
            reset()
        }, 1000)
    }

    // const [formData, setFormData] = useState<InterviewDTO>({
    //     bankName: '',
    //     date: new Date().toISOString().slice(0, 10),
    //     taskType: 'WITHDRAW',
    //     userId: 0
    // })

    

    const [stages, setStages] = useState<number[]>([])

    const [banks, setBanks] = useState<string[]>([])

    // const [debtors, setDebtors] = useState<DebtorBank[]>([])
    // const [openDebtorDialog, setOpenDebtorDialog] = useState<boolean>(false)

    // const fetchBanks = async () => {
    //     try {
    //         const res = await getBankList()
    //         setBanks(res)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    const {data, refetch, isFetching} = useGetInterviews()


    useEffect(() => {
        refetch()
    }, [selectedEvent, currentView, isAddEventDialogOpen])

    useEffect(() => {
        if (data && data.length > 0) {
            debugger
            setEvents(data)
        }
    }, [data])

    useEffect(() => {
        if (events && events.length > 0) {
            const ev = events.map(item => ({
                id: String(item.interview_id),
                title: item.interview_type,
                extendedProps: {
                    subject: `${item.interview_subject.employee_name} ${item.interview_subject.employee_surname}`,
                    // owner: item.interview_owner
                },
                date: item.interview_date
            }))
            setCalEvents(ev)
        }
    }, [events])

    // const fetchDebtors = async () => {
    //     if (!formData.bankName) return
    //     try {
    //         const res = await getDebtors(formData.taskType, formData.bankName)
    //         setDebtors(res)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    // useEffect(() => {
    //     fetchDebtors()
    // }, [formData])

    // const fetchUsers = async () => {
    //     try {
    //         const res = await getAllUsers('WITHDRAWER')
    //         setUsers(res)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    // const fetchTrips = async () => {
    //     setLoading(true)
    //     try {
    //         const res = await getComesToBank({
    //             page: 0,
    //             pageSize: 30,
    //             period: getCurrentView(currentView)
    //         })
    //         setEvents(res.content)
    //     } catch (err) {
    //         console.error(err)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     fetchTrips()
    // }, [selectedEvent, currentView])

    // console.log(debtors)
    // useEffect(() => {
    //     if (events && events.length > 0) {
    //         const calEvents = events.map(item => ({
                
    //         }))

    //         setCalendarEvents(calEvents)
    //     }
    // }, [events])

    // useEffect(() => {
    //     fetchUsers()
    //     console.log(debtors)
    // }, [])
    // console.log(debtors)

    // const handleInputChange = (value: any, key?: keyof FormValues) => {
    //     if (key) setFormData(prev => ({...prev, [key]: value}))
    // }

    const handleAddEventClick = () => setAddEventDialogOpen(true)

    const handleCloseAddEventDialog = () => {
        reset()
        setAddEventDialogOpen(false)
    }

    const handleCloseViewEventDialog = () => {
        setSelectedEvent(null)
        setViewEventDialogOpen(false)
    }

    const handleEventClick = (info: EventClickArg) => {
        const clickedEvent = events.find(ev => String(ev.interview_id) === info.event.id)
        
        if (clickedEvent) {
            setSelectedEvent(clickedEvent)
            setViewEventDialogOpen(true)
        }
    }

    const handleStageChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            setStages(prev => ([...prev, id]))
        } else {
            setStages(prev => (prev.filter((debtorId) => debtorId != id)))
        }
    }

    // const handleCreateComeToBank = async () => {
    //     try {

    //         const res = await createComeToBank({
    //             ...formData,
    //             debtorFinReestrIds: stages
    //         })
    //         setEvents(prev => ([...prev, res]))
    //         handleCloseAddEventDialog()
    //         setDebtors([])
    //         toast.success('Поход в банк успешно добавлен!')
    //     } catch (err) {
    //         console.error(err)
    //         toast.error('Возникла ошибка')
    //     }
    // }

    

    const renderContent = (eventInfo: any) => {
        
        return (
            <div className="animate-appear cursor-pointer">
                {`${getInterviewType(eventInfo.event.title)} | ${eventInfo.event.extendedProps.subject}`}
            </div>
        )
    }

    // if (loading) {
    //     return (
    //         <Box
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //             height="100vh"
    //         >
    //             <CircularProgress />
    //         </Box>
    //     );
    // }

    return (
        <CalendarWrapper
            className='app-calendar'
            sx={{display: 'unset'}}
        >
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                            Планировщик собеседований
                        </CardTitle>
                        <CardDescription>
                            <div className='flex gap-2 flex-col'>
                                <ProtectedRoute allowedRoles={['admin', 'teamlead', 'techlead', 'hr']}>
                                    <div className='w-full'>
                                        <Button
                                            onClick={() => {
                                                setAddEventDialogOpen(true)
                                            }}
                                        >
                                            <Plus />
                                            Добавить собеседование
                                        </Button>
                                    </div>
                                </ProtectedRoute>
                                <div className='flex flex-row gap-2'>
                                    <Button
                                        variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
                                        onClick={() => {
                                            calendarRef.current?.getApi().changeView('dayGridMonth')
                                            setCurrentView('dayGridMonth')
                                        }}
                                    >
                                        Месяц
                                    </Button>
                                    <Button
                                        variant={currentView === 'dayGridWeek' ? 'default' : 'outline'}
                                        onClick={() => {
                                            calendarRef.current?.getApi().changeView('dayGridWeek')
                                            setCurrentView('dayGridWeek')
                                        }}
                                    >
                                        Неделя
                                    </Button>
                                    <Button
                                        variant={currentView === 'dayGridDay' ? 'default' : 'outline'}
                                        onClick={() => {
                                            calendarRef.current?.getApi().changeView('dayGridDay')
                                            setCurrentView('dayGridDay')
                                        }}
                                    >
                                        День
                                    </Button>
                                </div>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='min-h-[600px] w-full'>
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                events={calEvents}
                                eventClick={handleEventClick}
                                buttonText={{today: '', month: ''}}
                                locale={ruLocale}
                                height="100%"
                                dayMaxEvents={currentView === 'dayGridMonth' ? 3 : true}
                                firstDay={1}
                                eventContent={renderContent}
                                eventTimeFormat={{
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }}
                                datesSet={({view}) => {
                                    setCurrentView(view.type)
                                    const api = calendarRef.current?.getApi()
                                    if (api) setCalendarApi(api)
                                }}

                            />
                        </div>
                    </CardContent>
                </Card>
                {/* {selectedEvent && (
                    <CalendarDataDialog 
                        handleCloseViewEventDialog={handleCloseViewEventDialog}
                        isViewEventDialogOpen={isViewEventDialogOpen}
                        role={user?.role || 'CLERK'}
                        selectedEvent={selectedEvent}
                    />
                )} */}
            <Dialog open={isAddEventDialogOpen} onOpenChange={handleCloseAddEventDialog}>
                {isAddEventDialogOpen && (
                    <DialogContent className="animate-appear">
                        <DialogHeader>
                            <DialogTitle>
                                Добавить собеседование
                            </DialogTitle>
                        </DialogHeader>
                        <FieldSet>
                            <form className="grid gap-4" id="create-interview" onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="interview_type"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="select_type">
                                            Тип собеседования
                                        </FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={String(field.value)}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id="select_type"
                                                aria-invalid={fieldState.invalid}
                                            >
                                            <SelectValue placeholder="Тип собеседования" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {interviewTypes?.map((type, id) => (
                                                <SelectItem key={id} value={String(type)}>
                                                    {getInterviewType(type)}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>
                                            Выберите тип собеседования
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="interview_subject"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="select_inter">
                                            Собеседуемый
                                        </FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={String(field.value)}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id="select_inter"
                                                aria-invalid={fieldState.invalid}
                                            >
                                            <SelectValue placeholder="Собеседуемый" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {employees?.map((empl, id) => (
                                                <SelectItem key={id} value={String(empl.employee_id)}>
                                                    {`${empl.employee_name} ${empl.employee_surname}`}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>
                                            Выберите сотрудника
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />
                                <Controller 
                                    name="interview_date"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="interview_date">
                                                Дата собеседования
                                            </FieldLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                        format(field.value, "dd.MM.yyyy")
                                                        ) : (
                                                        <span>Выберите дату</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" side="top" align="center">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        endMonth={new Date(2100, 12)}
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </Field>
                                    )}
                                />
                                <Controller 
                                    name="interview_desc"
                                    control={control}
                                    render={({field, fieldState}) => (
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="interview_desc">Описание</FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="inetrview_desc"
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
                            <Button disabled={loading} type="submit" form="create-interview">Добавить</Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
            
            <Dialog open={isViewEventDialogOpen} onOpenChange={handleCloseViewEventDialog} >
                {selectedEvent && (
                    <DialogContent className="animate-appear max-w-3xl">
                        <DialogHeader>
                            <div className="flex items-start justify-between gap-4 w-full">
                                <div>
                                    <DialogTitle className="text-lg font-semibold">
                                        Информация о собеседовании
                                    </DialogTitle>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {getInterviewType(selectedEvent.interview_type)} • {format(selectedEvent.interview_date, 'dd.MM.yyyy')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-xs px-2 py-1 rounded-full font-medium",
                                            selectedEvent.interview_status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                        )}
                                    >
                                        {selectedEvent.interview_status === "completed" ? "Завершено" : "В процессе"}
                                    </span>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid gap-4 md:grid-cols-3 mt-4">
                            <div className="md:col-span-2 space-y-3">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Собеседующий</div>
                                    <div className="text-sm font-medium">{`${selectedEvent.interview_owner.employee_name} ${selectedEvent.interview_owner.employee_surname}`}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Собеседуемый</div>
                                    <div className="text-sm font-medium">{`${selectedEvent.interview_subject.employee_name} ${selectedEvent.interview_subject.employee_surname}`}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Описание</div>
                                    <div className="bg-muted p-3 rounded-md text-sm leading-relaxed max-h-40 overflow-auto whitespace-pre-wrap">
                                        {selectedEvent.interview_desc || 'Нет описания'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Комментарии</div>
                                    <div className="bg-muted p-3 rounded-md text-sm leading-relaxed max-h-40 overflow-auto whitespace-pre-wrap">
                                        {selectedEvent.interview_comment || 'Отсутствуют'}
                                    </div>
                                </div>
                            </div>

                            <aside className="md:col-span-1 space-y-3">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Продолжительность</div>
                                    <div className="text-sm">{selectedEvent.interview_duration ? `${selectedEvent.interview_duration} мин.` : 'Не указана'}</div>
                                </div>

                                <div className="pt-2">
                                    {((role === 'teamlead' || role === 'hr') && (selectedEvent.interview_status !== "completed")) && (
                                        <Button onClick={() => setFinishEventDialogOpen(true)} className="w-full">
                                            Завершить
                                        </Button>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            <Dialog open={isFinishEventDialogOpen} onOpenChange={handleCloseFinishEventDialog} >
                <DialogContent className="animate-appear">
                    <DialogHeader>
                        <DialogTitle>Завершить собеседование</DialogTitle>
                    </DialogHeader>

                    <form
                        id="finish-interview"
                        className="grid gap-4"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const form = e.currentTarget as HTMLFormElement
                            const fd = new FormData(form)
                            const result = String(fd.get('result') || '')
                            const notes = String(fd.get('notes') || '')                       

                            mutateFinish({
                                id: selectedEvent ? selectedEvent.interview_id : 0,
                                comment: notes,
                                duration: 0
                            })

                            setViewEventDialogOpen(false)
                            setFinishEventDialogOpen(false)
                            setSelectedEvent(null)
                            form.reset()
                        }}
                    >
                        <Field>
                            <FieldLabel htmlFor="result">Результат</FieldLabel>
                            <Select name="result" defaultValue="passed">
                                <SelectTrigger id="result">
                                    <SelectValue placeholder="Выберите результат" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="passed">Пройдено</SelectItem>
                                    <SelectItem value="failed">Не пройдено</SelectItem>
                                    <SelectItem value="other">Другое</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription>Выберите итог собеседования</FieldDescription>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="notes">Комментарии</FieldLabel>
                            <Textarea id="notes" name="notes" placeholder="Добавьте комментарии по собеседованию" />
                        </Field>
                    </form>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Отмена</Button>
                        </DialogClose>
                        <Button type="submit" form="finish-interview">Завершить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CalendarWrapper>
    )
}

export default CalendarInterview
