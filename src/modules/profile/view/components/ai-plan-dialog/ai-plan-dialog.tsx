import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AiPlanData } from "@/modules/profile/domain/profile.types";
import ReactMarkdown from 'react-markdown'

export const AiPlanDialog = ({message, skill_level, skill_shape}: AiPlanData) => {

    return (
        <DialogContent className="animate-appear">
            <DialogHeader>
                <DialogTitle>
                    План повышения квалификации по компетенции
                </DialogTitle>
                {/* <DialogDescription>
                    Сохраните план! После
                </DialogDescription> */}
            </DialogHeader>
            {/* <div dangerouslySetInnerHTML={{__html: message}} className="max-h-[600px] overflow-y-scroll" /> */}
                {/* {message} */}
            <div className="p-5 max-h-[600px] overflow-y-scroll">
                <ReactMarkdown>{message}</ReactMarkdown>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" asChild>
                        Закрыть
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}