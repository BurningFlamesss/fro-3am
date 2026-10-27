
function Ftils() {
    const utilityLookUp = {
        currencyConverter: {
            input: () => {
                const handleSubmit = () => {

                }
                return (
                    <form action="">
                        <input type="number" name="amount" id="" />
                        <input type="text" name="currentCurrency" id="" />
                        <input type="text" name="requiredCurrency" id="" />
                        <button type="submit">Submit</button>
                    </form>
                )
            },
            process: (amount: number, currentCurrency: string, requiredCurrency: string) => {

                return {
                    amount: 0, requiredCurrency: ""
                }
            },
            output: (amount: number, requiredCurrency: string) => {
                return (
                    <p>{requiredCurrency} {amount}</p>
                )
            },
        }
    }

    return (
        <main className="w-full h-full flex items-center justify-center">

        </main>
    )
}

export default Ftils