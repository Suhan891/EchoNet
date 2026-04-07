import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Hero() {
  return (
    <div className='mx-auto min-h-full flex-col items-center'>
    <Card size="default" className="mx-auto mt-16 w-full max-w-3xl" >
      <CardHeader>
        <CardTitle>Landing Page</CardTitle>
        <CardDescription>
          This would be built later
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This would contain a brief summary of the entire project
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="icon-lg" className="w-full">
          Comming Soon
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

