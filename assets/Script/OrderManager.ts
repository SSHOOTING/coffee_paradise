// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { StaticInstance } from "./StaticInstance";
import OrderConfig from "./config/GameConfig";
import drinkAd from "./config/adConfig";
import { Util } from "./utils/Uitls";

const {ccclass, property} = cc._decorator;

interface IOrder {
    desc: string,
    coffeeNum: number,
    milkNum: number,
    waterNum: number,
    price: number
}


@ccclass
export default class OrderManager extends cc.Component {

    @property(cc.Label) orderName: cc.Label = undefined
    @property(cc.Label) orderState: cc.Label = undefined
    @property(cc.Label) orderDesc: cc.Label = undefined

    @property(cc.Node) orderCheck: cc.Node = undefined
    @property(cc.Label) moneyIn: cc.Label = undefined

    currentOrder: IOrder = {
        desc: "desc of drink",
        coffeeNum: 0,
        milkNum: 0,
        waterNum: 0,
        price: 0
    }

    checkReadyFlag: boolean = false
    checking: boolean = false
    checkTimeStamp = 0
    checkingDuration = 1

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        StaticInstance.setOrderaManager(this)
        this.generateOrder()
    }
    
    clearOrder() {

        StaticInstance.actionTable.coffeeHaved -= this.currentOrder.coffeeNum
        StaticInstance.actionTable.milkHaved -= this.currentOrder.milkNum
        StaticInstance.actionTable.waterHaved -= this.currentOrder.waterNum
        
        
        // 消失动画
        this.node.stopAllActions()
        this.node.angle = 0
        cc.tween(this.node)
            .to(0.1, {angle:2.5}) //一秒时间转到10度
            .to(0.1, {angle:0})  //一秒时间转到0度
            // .to(0.5, {active:false}) // 未生效
            .delay(0.5) // 等待0.5秒
            .call(() => {
                // this.node.active = false
                this.node.removeAllChildren()
            })
        .start()
    }
    
    initOrder(){
        
        // todo 添加根节点动画效果
        this.node.active = true

        // const order = cc.instantiate(this())

        // this.node.addChild(order) //添加到管理节点上

        // 初始化送出按钮
        const {TOUCH_START, TOUCH_END, TOUCH_CANCEL} = cc.Node.EventType
        // 交货动作初始化
        this.orderCheck.on(TOUCH_START, () => {
            Util.clickDownTween(this.orderCheck)
        }, this)

        this.orderCheck.on(TOUCH_END, () => {
            Util.clickUpTween(this.orderCheck, () => {
               // 添加提交失败抖动效果
            })
        }, this)

        this.orderCheck.on(TOUCH_CANCEL, () => {
            Util.clickUpTween(this.orderCheck)
        }, this)
    }
    

    setOrderDetails() {
        
        // 获取当前菜单解锁前 level 个
        let playerLevel = StaticInstance.playerLevel.level
        // 获取音频名称、数量随机
        let totalDrinkNum = OrderConfig.length
        let drinkNameIdx = Math.ceil(Math.random() * Math.min(playerLevel, totalDrinkNum))
        let drinkNum = Math.ceil(Math.random() * playerLevel)
        var theOrder = OrderConfig[drinkNameIdx]
        
        // todo 改成结构体
        this.currentOrder.desc = theOrder[0].toString()
        this.currentOrder.coffeeNum = Number(theOrder[1]) * drinkNum
        this.currentOrder.milkNum = Number(theOrder[2]) * drinkNum
        this.currentOrder.waterNum = Number(theOrder[3]) * drinkNum
        this.currentOrder.price = Number(theOrder[4]) * drinkNum

        this.orderName.string = `我想要${drinkNum}杯${this.currentOrder.desc}噢`
        this.orderState.string = `coffee 0/${this.currentOrder.coffeeNum}, milk 0/${this.currentOrder.milkNum}, water 0/${this.currentOrder.waterNum}`
        
        
        let totalAd = drinkAd.length
        let adIdx = Math.floor(Math.random() * totalAd)
        console.log('adIdx:', adIdx);
        this.orderDesc.string = drinkAd[adIdx].toString()

    }


    generateOrder() {
        cc.tween(this.node)
            .delay(0.5)
        .start()

        // 准备好订单内容
        this.setOrderDetails()
        // 订单ui滚入
        this.initOrder()
    }

    
    check(){

        // if (!this.checking){
        //     return // 不能重复check
        // }

        // 交货
        this.moneyIn.node.active = true
        this.moneyIn.string = `+${this.currentOrder.price}$`
        // 一秒内网上漂
        console.log('money in location', this.moneyIn.node.x, this.moneyIn.node.y);
        console.log('orderCheck location', this.orderCheck.x, this.orderCheck.y);

        cc.tween(this.moneyIn.node)
            .to(0.5, {y: this.moneyIn.node.y+150}) // 先往上
            .to(0.5, {opacity:10})  // 渐变效果
            .to(0.1, {y: this.moneyIn.node.y})  // 重回位置为了下次
            .call(() => {this.moneyIn.node.active = false})
        .start()
        
        console.log('old cash', StaticInstance.playerLevel.cashNum);
        StaticInstance.playerLevel.cashNum += this.currentOrder.price
        StaticInstance.playerLevel.refreshCash()
        console.log('new cash', StaticInstance.playerLevel.cashNum);

        this.currentOrder.price = 0 // 防止影响总经济

        this.checkTimeStamp = Date.now()
        console.log('checking time:', this.checkTimeStamp);

        this.clearOrder()
        this.checking = false

        // this.generateOrder()

        
    }

    updateOrderCheckActive(){
        const {TOUCH_END} = cc.Node.EventType
        // 交货按钮生效
        if (this.checkReadyFlag) {
            this.orderCheck.on(TOUCH_END, () => {
            Util.clickUpTween(this.orderCheck, () => {
                this.checking = true
                //　移除监听
                this.node.off(TOUCH_END)
            })
            }, this)
        } else {
            this.orderCheck.on(TOUCH_END, () => {
                Util.clickUpTween(this.orderCheck, () => {
                   // 添加提交失败抖动效果
                })
            }, this)
        }
        

    }

    start () {

    }
    
    updateHaved(dt: number){
        let coffeeHaved = Math.floor(StaticInstance.actionTable.coffeeHaved)
        let milkHaved = Math.floor(StaticInstance.actionTable.milkHaved)
        let waterHaved = Math.floor(StaticInstance.actionTable.waterHaved)

        this.orderState.string = `coffee ${coffeeHaved}/${this.currentOrder.coffeeNum}, milk ${milkHaved}/${this.currentOrder.milkNum}, water ${waterHaved}/${this.currentOrder.waterNum}`
    }

    updateOrderReady(dt: number){
        if (StaticInstance.actionTable.milkHaved >= this.currentOrder.milkNum - 0.001
            && StaticInstance.actionTable.waterHaved >= this.currentOrder.waterNum - 0.001
            && StaticInstance.actionTable.coffeeHaved >= this.currentOrder.coffeeNum - 0.001)  {
            console.log('checkReadyFlag = true');
            this.checkReadyFlag = true
        } else {
            this.checkReadyFlag = false
        }
    }

    update(dt: number) {
        this.updateHaved(dt)
        
        this.updateOrderReady(dt)

        this.updateOrderCheckActive()

        if (this.checking) {
            this.check()
        }
        
    }
}
