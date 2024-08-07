const workers = () => {
    function workerSetup() {
        self.onmessage = (evt) => {
            const t = performance.now()
            // 模拟耗时任务,随机消耗时间 0~100ms
            while (performance.now() - t < Math.random() * 100) { }
            const { idx, val } = evt.data
            // 实际上只是算一下参数的平方
            self.postMessage({
                idx: idx,
                val: val * val
            })
        }
    }
    // 创建一个运行 workerSetup 函数的 worker
    const createWorker = () => {
        const blob = new Blob([`(${workerSetup.toString()})()`])
        const url = URL.createObjectURL(blob)
        return new Worker(url)
    }
    // 模拟 1000 个任务
    const tasks = Array(1000).fill(0).map((_, idx) => idx + 1)
    const result: any = []
    let rsCount = 0
    const onMsg = (evt: any) => {
        result[evt.data.idx] = evt.data.val
        rsCount += 1
        // 所有任务完成时打印结果
        if (rsCount === tasks.length) {
            console.log('task:', tasks)
            console.log('result:', result)
        }
    }

    // 模拟线程池
    const workerPool = Array(10).fill(0).map(createWorker)
    workerPool.forEach((worker, idx) => {
        worker.onmessage = onMsg
        // @ts-expect-error
        worker.id = idx
    })

    for (const idx in tasks) {
        // 随机分配任务
        const worker = workerPool[Math.floor(Math.random() * workerPool.length)]
        worker.postMessage({ idx, val: tasks[idx], state: 1 })
        // @ts-expect-error
        console.log(`Worker ${worker.id}, process task ${idx}`)
    }
}
