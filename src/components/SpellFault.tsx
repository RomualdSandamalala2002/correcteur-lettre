interface SpellFaultProps{
    name:string
}

export default function SpellFault(props:SpellFaultProps){
    return <>
        <span className="red-flag">{props.name}</span>
    </>
}