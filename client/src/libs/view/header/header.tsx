import Image from "next/image"

export const Header = ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <div className="fixed flex justify-between top-0 w-full border py-6 shadow-sm z-50 bg-white p-4">
            <p className="uppercase font-bold text-xl" >APC</p>
            {children}
        </div>
    )
}
