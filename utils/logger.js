import logger from "pino";
import dayjs from "dayjs";

const log = logger({
    transport: {
        target: 'pino-pretty'
    },
    options: {
        colorize: true
    },
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format().split('.000').join(' ')}"`
})

export default log;