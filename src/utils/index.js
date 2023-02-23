import {throttle} from 'loadsh'


/*
 监听窗口滚动
 */
const resize = () => {
    const data = {
        event: throttle(function () {
            window.location.reload()
        }, 100),
    }
    data.register = () => {
        window.addEventListener('resize', data.event)
    }
    data.destroy = () => {
        window.removeEventListener('resize', data.event)
    }
    return data;
}

const utils = {
    resize
}

export default utils;
