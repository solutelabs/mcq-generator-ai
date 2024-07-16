"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { MCQ } from "@/app/page"
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Mcq = ({ mcq }: { mcq: MCQ | null }) => {

    const [description, setDescription] = useState<string>("")
    const [selected, setSelected] = useState<string>("")

    const checkAnswer = () => {
        console.log(mcq?.answer, selected)
        if (mcq?.answer === selected) {
            setDescription("Correct")
        } else {
            setDescription("Incorrect")
        }
    }

    return (
        <Card className="m-10">
            <CardHeader>
                <CardTitle>{mcq?.question}</CardTitle>
                <CardDescription className={
                    cn("text-lg",description === "Incorrect" ? "text-red-500" : "text-green-500")
                }>{description && description}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup value={selected} onValueChange={setSelected}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[0] || "option-one"} id="option-one" />
                        <Label htmlFor="option-one">{mcq?.options[0]}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[1] || "option-two"} id="option-two" />
                        <Label htmlFor="option-two">{mcq?.options[1]}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[2] || "option-three"} id="option-three" />
                        <Label htmlFor="option-three">{mcq?.options[2]}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[3] || "option-four"} id="option-four" />
                        <Label htmlFor="option-four">{mcq?.options[3]}</Label>
                    </div>
                </RadioGroup>
            </CardContent>
            <CardFooter className="justify-end">
                <Button variant="outline" onClick={checkAnswer}>Check answer</Button>
            </CardFooter>
        </Card>

    )
}

export default Mcq