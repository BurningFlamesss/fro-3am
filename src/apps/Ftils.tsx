import type React from "react";
import { type ComponentType, useState } from "react";
import convert, { type Unit } from "convert";

type Utilities = "currencyConverter" | "unitConverter"
interface UtilityStructure {
    input: () => React.ReactNode;
    process: (payload: any) => any;
    output: (payload: any) => React.ReactNode
}


function Ftils() {
    const handleUtility = async (payload: any, target: Utilities) => {
        const targetUtility = utilityLookUp[target]

        if (targetUtility) {
            const layer2Payload = await targetUtility.process(payload)
            const output = await targetUtility.output(layer2Payload)
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
                    const from = formData.get("from")
                    const to = formData.get("to")
                    const payload = {
                        amount,
                        from,
                        to
                    }

                    handleUtility(payload, "currencyConverter")
                }
                return (
                    <form className="w-full flex flex-col gap-y-2" action="" onSubmit={handleSubmit}>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="amount">Amount:</label>
                            <input placeholder="67" className="p-1 border border-black" type="number" name="amount" id="" />
                        </div>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="from">From:</label>
                            <input placeholder="usd" className="p-1 border border-black" type="text" name="from" id="" />
                        </div>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="to">To:</label>
                            <input placeholder="npr" className="p-1 border border-black" type="text" name="to" id="" />
                        </div>
                        <button className="w-14 cursor-pointer" type="submit">Submit</button>
                    </form>
                )
            },
            process: async ({ amount, from, to }: { amount: number, from: string, to: string }) => {
                const normalFrom = from.trim().toUpperCase()
                const normalTo = to.trim().toUpperCase()

                if (normalFrom === normalTo) {
                    return {
                        amount,
                        to: normalTo
                    }
                }

                const response = await fetch(
                    `https://api.frankfurter.dev/v2/rate/${encodeURIComponent(normalFrom)}/${encodeURIComponent(normalTo)}`
                );

                if (!response.ok) {
                    throw new Error("could not fetch")
                }

                const data = await response.json()

                return {
                    amount: amount * data.rate, to: normalTo
                }
            },
            output: ({ amount, to }: { amount: number, to: string }) => {
                return (
                    <p>{to} {amount}</p>
                )
            },
        },
        unitConverter: {
            input: () => {
                const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault()

                    const formData = new FormData(event.currentTarget)
                    const amount = formData.get("amount")
                    const from = formData.get("from")
                    const to = formData.get("to")
                    const payload = {
                        amount,
                        from,
                        to
                    }

                    handleUtility(payload, "unitConverter")
                }
                return (
                    <form className="w-full flex flex-col gap-y-2" action="" onSubmit={handleSubmit}>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="amount">Amount:</label>
                            <input placeholder="67" className="p-1 border border-black" type="number" name="amount" id="" />
                        </div>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="from">From:</label>
                            <input placeholder="seconds" className="p-1 border border-black" type="text" name="from" id="" />
                        </div>
                        <div className="w-full flex flex-row items-center gap-x-2">
                            <label htmlFor="to">To:</label>
                            <input placeholder="minutes" className="p-1 border border-black" type="text" name="to" id="" />
                        </div>
                        <button className="w-14 cursor-pointer" type="submit">Submit</button>
                    </form>
                )
            },
            process: async ({ amount, from, to }: { amount: number, from: string, to: string }) => {
                const normalFrom = from.trim() as Unit
                const normalTo = to.trim() as Unit

                const response = convert(amount, normalFrom).to(normalTo);

                return {
                    amount: response || 0, to: normalTo
                }
            },
            output: ({ amount, to }: { amount: number, to: string }) => {
                return (
                    <p>{amount} {to}</p>
                )
            },
        },
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
            <div className="mb-2">
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
                <fieldset className="flex flex-row gap-2 items-center">
                    <div className="flex-1 border-t border-white"></div>
                    <span className="text-sm">Output</span>
                    <div className="flex-1 border-t border-white"></div>
                </fieldset>


                {renderer}
            </section>
        </main>
    )
}

export default Ftils