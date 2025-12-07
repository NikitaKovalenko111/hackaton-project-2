import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JSX } from "react"
import ReactMarkdown from "react-markdown"

type PropsType = {
    message: string
    employeeName?: string
    employeeSurname?: string
}

export const AiReviewDialog: React.FC<PropsType> = ({ message, employeeName, employeeSurname }): JSX.Element => {
    return (
        <DialogContent className="animate-appear max-w-3xl w-full rounded-lg bg-white dark:bg-slate-900/60 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <DialogHeader className="px-6 py-4">
                <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Ревью на сотрудника {employeeName} {employeeSurname}
                </DialogTitle>
            </DialogHeader>

            <div className="p-6 max-h-[600px] overflow-y-auto bg-transparent">
                <div className="prose max-w-none prose-slate dark:prose-invert">
                    <ReactMarkdown>{message}</ReactMarkdown>
                </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                <DialogClose asChild>
                    <Button variant="outline" asChild>
                        Закрыть
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}