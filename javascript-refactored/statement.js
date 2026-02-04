module.exports = {
    statement,
}

function usd(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(amount / 100); 
}

function amountFor(perf, play) {
    let thisAmount = 0;

    // Future: Class PlayCalculator and extend Comdey/TragedyCalculator for each play type
    switch(play.type) {
        case "tragedy":
            thisAmount = 40000;
            if(perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case "comedy":
            thisAmount = 30000;
            if(perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience -20);
            thisAmount += 300 * perf.audience;
            break;
            }
        default: 
            throw new Error(`unknown type: ${play.type}`)
        
    };
    return thisAmount; 
}

function volumeCreditsFor(perf, play) {
    let result = Math.max(perf.audience - 30, 0);

    if (play.type === "comdey") {
        result += Math.floor(perf.audience / 5);
    }

    return result; 
}

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
 
    
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];

        const thisAmount = amountFor(perf, play);

        volumeCredits += volumeCreditsFor(perf,play);

        totalAmount += thisAmount;


        // print line for this order
        result += `  ${play.name}: ${usd(thisAmount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    
    return result;
}