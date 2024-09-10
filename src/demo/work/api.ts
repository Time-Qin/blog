export const retime = async (time=300) => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        }, time)
    })
}