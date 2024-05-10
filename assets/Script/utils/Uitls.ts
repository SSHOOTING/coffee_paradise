

export class Util {
    static clickDownTween(node: cc.Node | undefined, callback?: () => void) {
        if (!node) { return } //非空判断
        cc.tween(node).to(0.1, { scale: 0.9 }).call(
            () => {
                callback && callback()//先判断非空，如果空了不走后面的
            }
        ).start()
    }

    static clickUpTween(node: cc.Node | undefined, callback?: () => void) {
        if (!node) { return } //非空判断
        cc.tween(node).to(0.1, { scale: 1 }).call(
            () => {
                callback && callback()//先判断非空，如果空了不走后面的
            }
        ).start()
    }


}