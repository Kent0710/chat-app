export default function MessageContainerComponent(props : any) {
    const ReceiverNameComponent = (props : any) => {
        return (
            <div className="bg-slate-600 w-full h-20 flex items-center justify-center">
                Receiver : {props.receiverName}
            </div>
        )
    }

    

    return (
        <main className=" bg-cyan-500 w-screen">
            <ReceiverNameComponent receiverName={props.receiverName} />
        </main>
    )
}