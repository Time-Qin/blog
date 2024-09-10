let interval:NodeJS.Timer

self.onmessage = function(event){
    const { command, timeInSeconds } = event.data;
    // console.log(command, timeInSeconds);
    if(command === 'start'){
        let remainingTime =  timeInSeconds
        interval = setInterval(()=>{
            remainingTime--,
            self.postMessage({remainingTime})
            if(remainingTime <= 0){
                clearInterval(interval)
                self.postMessage({remainingTime:0})
            }
        },1000)
    }else if(command ==='stop'){
        clearInterval(interval)
    }
}

self.onerror = function(event){
    clearInterval(interval)
    // console.log(event,'error')
}