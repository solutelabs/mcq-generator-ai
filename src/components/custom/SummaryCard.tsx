"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { cn, getSummaryAndScore } from "@/lib/utils";
import { Badge } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

const colors = {
    easy: "bg-green-500 hover:bg-green-600",
    medium: "bg-yellow-500 hover:bg-yellow-600",
    hard: "bg-red-500 hover:bg-red-600",
}

const SummaryCard = ({ summaryAndScore }: { summaryAndScore: string }) => {

    const [score, setScore] = useState("")
    // const [summary, setSummary] = useState<string[]>([])
    const [summary, setSummary] = useState("")

    useEffect(() => {
        const [score, summary] = getSummaryAndScore(summaryAndScore);
        setScore(score)
        // setSummary(summaryArray);
        setSummary(summary);
        console.log(summary)
    }, [summaryAndScore])
    return (
        <Card className="m-10">
            <CardHeader>
                <CardTitle className="text-xl font-normal">Your Score: {score}</CardTitle>
            </CardHeader>
            <CardContent>
                <MarkdownRenderer markdownText={summary} />
            </CardContent>
        </Card>

    )
}

export default SummaryCard;