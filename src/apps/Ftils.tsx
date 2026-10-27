import type React from "react";
import { type ComponentType, useState } from "react";

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
                    <form className="w-full flex flex-col gap-y-2" action="" onSubmit={handleSubmit}>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="amount">Amount:</label>
                            <input placeholder="amount" className="p-1 border border-black" type="number" name="amount" id="" />
                        </div>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="currentCurrency">Current Currency:</label>
                            <input placeholder="currentCurrency" className="p-1 border border-black" type="text" name="currentCurrency" id="" />
                        </div>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="requiredCurrency">Required Currency:</label>
                            <input placeholder="requiredCurrency" className="p-1 border border-black" type="text" name="requiredCurrency" id="" />
                        </div>
                        <button className="w-14 cursor-pointer" type="submit">Submit</button>
                    </form>
                )
            },
            process: ({ amount, currentCurrency, requiredCurrency }: { amount: number, currentCurrency: string, requiredCurrency: string }) => {

                return {
                    amount: 0, requiredCurrency
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
        <main className="w-full h-full flex flex-col p-4">
            <div>
                Choose the utility: <select className="border-0 outline-0 cursor-pointer" id="" value={inUseUtility.name} onChange={(event) => {
                    const targetUtility = event.target.value as Utilities
                    setInUseUtility({
                        name: targetUtility,
                        component: utilityLookUp[targetUtility].input
                    })
                }}>
                    {Object.keys(utilityLookUp).map((utility) => <option className="cursor-pointer" key={utility} value={utility}>{utility}</option>)}
                </select>
            </div>

            <hr />
            <section className="flex flex-col my-4 gap-y-4">
                <Component />
                <hr />
                {renderer}
            </section>
        </main>
    )
}

export default Ftils