function compare(a, b) {
    if (a.dist == b.dist) {
        if (a.deliveryAgentNumber == b.deliveryAgentNumber) {
            return a.orderNumber < b.orderNumber
        }
        return a.deliveryAgentNumber < b.deliveryAgentNumber
    }
    return a.dist < b.dist
}


function dist(x, y) {
    return Math.sqrt((y.latitude - x.latitude) * (y.latitude - x.latitude) + (y.longitude - x.longitude) * (y.longitude - x.longitude))
}

const agentLocLatitude = process.argv[2]
const agentLocLongitude = process.argv[3]

fetch("https://zorang-recrutment.s3.ap-south-1.amazonaws.com/addresses.json")
    .then(res => res.json())
    .then(res => {
        let orderLoc = []
        for (let orderLocation in res) {
            delete res[orderLocation]._id
            orderLoc.push(res[orderLocation])
        }

        let agentLoc = []
        let order = []
        for (let j = 0; j < 10; j++) {
            agentLoc.push({
                latitude: agentLocLatitude,
                longitude: agentLocLongitude
            })
            order.push([])
        }

        let vis = []
        for (let j = 0; j < 100; j++) {
            vis.push(false)
        }

        for (let c = 0; c < 100; c++) {
            let listofdist = []
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 100; j++) {
                    if (vis[j]) {
                        continue
                    }
                    listofdist.push({
                        dist: dist(agentLoc[i], orderLoc[j]),
                        deliveryAgentNumber: i,
                        orderNumber: j
                    })
                }
            }

            listofdist.sort(compare)

            console.log(listofdist);

            const agent = listofdist[0].deliveryAgentNumber;
            const orderNo = listofdist[0].orderNumber;

            order[agent].push(orderNo);
            agentLoc[agent] = orderLoc[orderNo];
            vis[orderNo] = true;
        }

        // console.log(order);
    })