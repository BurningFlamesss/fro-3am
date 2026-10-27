import type React from "react";
import { useState, type ComponentType } from "react";

type Utilities = "currencyConverter"
interface UtilityStructure {
    input: () => React.ReactNode;
    process: (payload: any) => any;
    output: (payload: any) => React.ReactNode
}


function Ftils() {
    const handleUtility = (payload: any, target: Utilities) => {
        const targetUtility = utilityLookUp[target]

        if (targetUtility) {
            const layer2Payload = targetUtility.process(payload)
            const output = targetUtility.output(layer2Payload)
            setRenderer(output)
        }
    }

    const utilityLookUp: Record<Utilities, UtilityStructure> = {
        currencyConverter: {
            input: () => {
                const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault()

                    const formData = new FormData(event.currentTarget)
                    const amount = formData.get("amount")
                    const currentCurrency = formData.get("currentCurrency")
                    const requiredCurrency = formData.get("requiredCurrency")
                    const payload = {
                        amount,
                        currentCurrency,
                        requiredCurrency
                    }

                    handleUtility(payload, "currencyConverter")
                }
                return (
                    <form action="" onSubmit={handleSubmit}>
                        <input type="number" name="amount" id="" />
                        <input type="text" name="currentCurrency" id="" />
                        <input type="text" name="requiredCurrency" id="" />
                        <button type="submit">Submit</button>
                    </form>
                )
            },
            process: ({ amount, currentCurrency, requiredCurrency }: { amount: number, currentCurrency: string, requiredCurrency: string }) => {

                return {
                    amount: 0, requiredCurrency: ""
                }
            },
            output: ({ amount, requiredCurrency }: { amount: number, requiredCurrency: string }) => {
                return (
                    <p>{requiredCurrency} {amount}</p>
                )
            },
        }
    }

    const [renderer, setRenderer] = useState<React.ReactNode>()
    const [inUseUtility, setInUseUtility] = useState<{
        name: Utilities,
        component: ComponentType
    }>({
        name: "currencyConverter",
        component: utilityLookUp.currencyConverter.input
    })

    const Component = inUseUtility.component

    return (
        <main className="w-full h-full flex items-center justify-center">
            Choose any one: <select id="" value={inUseUtility.name} onChange={(event) => {
                const targetUtility = event.target.value as Utilities
                setInUseUtility({
                    name: targetUtility,
                    component: utilityLookUp[targetUtility].input
                })
            }}>
                {Object.keys(utilityLookUp).map((utility) => <option key={utility} value={utility}>{utility}</option>)}
            </select>

            <Component />
            {renderer}
        </main>
    )
}

export default Ftils