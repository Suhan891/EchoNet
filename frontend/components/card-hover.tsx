import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface params {
    title: string;
    description: string;
}

export default function Hovertext({title, description}: params) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link" size={"icon-sm"} className="inline align-baseline  text-blue-200 cursor-pointer">{title}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">EchoNet</div>
        <div>{description}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Updated on April 2026
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
