module.exports = {
    statement,
    formatUSD,
    amountFor,
}

const TRAGEDY_BASE = 40000;
const TRAGEDY_EXTRA = 1000;
const COMEDY_BASE = 30000;
const COMEDY_EXTRA = 10000;
const COMEDY_PER_AUDIENCE = 300;


function formatUSD(amount) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(amount);
};

function amountFor(perf, play) {
        switch (play.type) {
            case "tragedy":
                thisAmount = TRAGEDY_BASE;
                if (perf.audience > 30) {
                    thisAmount += TRAGEDY_EXTRA * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = COMEDY_BASE;
                if (perf.audience > 20) {
                    thisAmount += COMEDY_EXTRA + 500 * (perf.audience - 20);
                }
                thisAmount += COMEDY_PER_AUDIENCE * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        return thisAmount;
};

function volumeCreditsFor(perf, play) {
        let thisVolumeCredits = 0;
        // add volume credits
        thisVolumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === play.type) thisVolumeCredits += Math.floor(perf.audience / 5);

        return thisVolumeCredits;
};

function statementData(invoice, plays) {
    const data = {
        customer: invoice.customer, 
        performances: invoice.performances.map(perf => {
            const play = plays[perf.playID];
            const amount = amountFor(perf, play);
            const volumeCredits = volumeCreditsFor(perf, play);
            return {play, audience: perf.audience, amount, volumeCredits};
        }),
    };
    data.totalAmount = data.performances.reduce((sum, p) => sum + p.amount, 0);
    data.totalVolumeCredit = data.performances.reduce((sum, p) => sum + p.volumeCredits, 0);

    return data
};

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = amountFor(perf, play); 

        // add volume credits
        volumeCredits += volumeCreditsFor(perf, play);

        // print line for this order
        result += `  ${play.name}: ${formatUSD(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${formatUSD(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
};