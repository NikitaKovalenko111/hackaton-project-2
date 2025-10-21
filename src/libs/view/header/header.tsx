export const Header = ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <div className="fixed top-0 w-full border py-6 shadow-sm">
            {children}
        </div>
    )
}