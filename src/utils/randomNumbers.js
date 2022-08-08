process.on("message", async (amount) => {
    function randomNumbers(amount) {
        const numbers = {};
        for (let index = 1; index <= amount; index++) {
            numbers[index] = Math.floor(Math.random()*1000) +1;
        }
        return numbers;
    }
    process.send(randomNumbers(amount));
});