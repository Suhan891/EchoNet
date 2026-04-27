import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface params {
    children: React.ReactNode;
    description: string;
}

export default function HoverText({children, description}: params) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="font-semibold">EchoNet</div>
        <div>{description}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Updated on April 2026
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
