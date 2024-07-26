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
import { Badge } from "@/components/ui/badge"
import { Label } from '@/components/ui/label';
import { Button } from "../ui/button";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { MCQ } from "./McqIframe";

const colors = {
    easy: "bg-green-500 hover:bg-green-600",
    medium: "bg-yellow-500 hover:bg-yellow-600",
    hard: "bg-red-500 hover:bg-red-600",
}

const Mcq = ({ mcq, setQuestionAnswer, chart }: { mcq: MCQ | null, setQuestionAnswer: React.Dispatch<React.SetStateAction<string>>, chart?: ReactNode }) => {

    const [description, setDescription] = useState<string>("")
    const [selected, setSelected] = useState<string>("")

    const checkAnswer = () => {
        console.log(mcq?.answer, selected)
        if (mcq?.answer === selected) {
            setDescription("Correct")
        } else {
            setDescription("Incorrect")
        }
        setQuestionAnswer(selected)
    }

    return (
        <Card className="m-10 border-2">
            <CardHeader>
                <CardTitle className="text-xl font-normal">{mcq?.question}</CardTitle>
                <CardDescription className={
                    cn("text-lg", description === "Incorrect" ? "text-red-500" : "text-green-500")
                }>
                    <Badge className={
                        cn(
                            "font-normal text-white",
                            mcq?.difficulty === "easy" ? colors.easy :
                                mcq?.difficulty === "medium" ? colors.medium :
                                    colors.hard
                        )
                    }>{mcq?.difficulty}</Badge>
                    <br />
                    {description && description}
                </CardDescription>

            </CardHeader>
            <CardContent>
                {chart && chart}
                <RadioGroup value={selected} onValueChange={setSelected} disabled={description !== ""}>
                    {mcq?.options[0] && <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[0] || "option-one"} id="option-one" />
                        <Label htmlFor="option-one"
                            className={
                                cn(description !== "" && mcq?.answer === mcq.options[0] ? "text-green-500" : "text-black")
                            }
                        >{mcq?.options[0]}</Label>
                    </div>}
                    {mcq?.options[1] && <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[1] || "option-two"} id="option-two" />
                        <Label htmlFor="option-two"
                            className={
                                cn(description !== "" && mcq?.answer === mcq.options[1] ? "text-green-500" : "text-black")
                            }
                        >{mcq?.options[1]}</Label>
                    </div>}
                    {mcq?.options[2] && <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[2] || "option-three"} id="option-three" />
                        <Label htmlFor="option-three"
                            className={
                                cn(description !== "" && mcq?.answer === mcq.options[2] ? "text-green-500" : "text-black")
                            }
                        >{mcq?.options[2]}</Label>
                    </div>}
                    {mcq?.options[3] && <div className="flex items-center space-x-2">
                        <RadioGroupItem value={mcq?.options[3] || "option-four"} id="option-four" />
                        <Label htmlFor="option-four"
                            className={
                                cn(description !== "" && mcq?.answer === mcq.options[3] ? "text-green-500" : "text-black")
                            }
                        >{mcq?.options[3]}</Label>
                    </div>}
                </RadioGroup>
            </CardContent>
            <CardFooter className="justify-end">
                <Button variant="outline" disabled={!selected || description !== ""} onClick={checkAnswer}>Check answer</Button>
            </CardFooter>
        </Card>

    )
}

export default Mcq