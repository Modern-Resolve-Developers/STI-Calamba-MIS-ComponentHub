
type AlertPlacementProps = {
    type: string
    title: string
    message: string
}

export const AlertMessagePlacement = ({
    type,
    title = 'Attention needed',
    message
}: AlertPlacementProps) => {
    switch(type){
        case 'warning':
            return (
                <div className="flex w-full border-l-6 border-warning bg-warning bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                    <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning bg-opacity-30">
                    <svg
                        width="19"
                        height="16"
                        viewBox="0 0 19 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z"
                        fill="#FBBF24"
                        ></path>
                    </svg>
                    </div>
                    <div className="w-full">
                    <h5 className="mb-3 text-lg font-semibold text-[#9D5425]">
                        {title}
                    </h5>
                    <p className="leading-relaxed text-[#D0915C]">
                        {message}
                    </p>
                    </div>
                </div>
            )
            case 'info':
            return (
                <div className="flex w-full border-l-6 border-info bg-info bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                    <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-info bg-opacity-30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
</svg>

                    </div>
                    <div className="w-full">
                        <h5 className="mb-3 text-lg font-semibold text-[#2563EB]">
                            {title}
                        </h5>
                        <p className="leading-relaxed text-[#93C5FD]">
                            {message}
                        </p>
                    </div>
                </div>
            );
        default:
            break;
    }
}