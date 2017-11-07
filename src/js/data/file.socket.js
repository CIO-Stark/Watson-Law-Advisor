// import io from 'socket.io-client';
// const io = () => { return { on: () => {} } };

let socket = null;
let callback = {
    success: [],
    error: [],
    update: []
};

function initSocket () {
    socket = io('//portfolio-watson-law-advisor-orchestrator.mybluemix.net');
    // {file object}
    socket.on('file_success', file => { treatResponse('success', file); });
    // {
    //    id: int,
    //    message: string
    // }   
    socket.on('file_error', error => { treatResponse('error', error); });
    // {
    //     waiting: int,
    //     total: int
    // }
    socket.on('pipe_update', update => { treatResponse('update', update); });
}

function treatResponse (array, content) {
    callback[array].forEach(func => {
        func(JSON.parse(content));
    });
}

function subscribe (type, func) {
    callback[type].push(func);
}

function unsubscribe (type, func) {
    let index = callback[type].indexOf(func);
    callback[type].splice(index, 1);
}

export { initSocket, subscribe, unsubscribe };