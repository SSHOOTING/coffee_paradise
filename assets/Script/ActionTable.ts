import { StaticInstance } from "./StaticInstance"
import { Util } from "./utils/Uitls"

const { ccclass, property } = cc._decorator

@ccclass
export default class ActionTable extends cc.Component {
    @property(cc.Node) coffeeButton: cc.Node = undefined
    @property(cc.Node) waterButton: cc.Node = undefined
    @property(cc.Node) milkButton: cc.Node = undefined

    @property(cc.Label) coffeeState: cc.Label = undefined
    @property(cc.Label) waterState: cc.Label = undefined
    @property(cc.Label) milkState: cc.Label = undefined

    coffeeHaved: number = 0.0
    waterHaved: number = 0.0
    milkHaved: number = 0.0


    protected onLoad(): void {
        this.init() 
        StaticInstance.setActionTable(this)       
    }


    init(){
        
        const {TOUCH_START, TOUCH_END,TOUCH_CANCEL} = cc.Node.EventType
        // coffee
        this.coffeeButton.on(TOUCH_START, () => {
            Util.clickDownTween(this.coffeeButton)
        }, this)

        this.coffeeButton.on(TOUCH_END, () => {
            Util.clickUpTween(this.coffeeButton, () => {
                this.coffeeHaved = this.coffeeHaved + StaticInstance.playerLevel.coffeeTapSpeed
                this.setCoffeeLabel(this.coffeeHaved)
            })
        }, this)

        this.coffeeButton.on(TOUCH_CANCEL, () => {
            Util.clickUpTween(this.coffeeButton)
        }, this)

        // water
        this.waterButton.on(TOUCH_START, () => {
            Util.clickDownTween(this.waterButton)
        }, this)

        this.waterButton.on(TOUCH_END, () => {
            Util.clickUpTween(this.waterButton, () => {
                this.waterHaved = this.waterHaved + StaticInstance.playerLevel.waterTapSpeed
                this.setWaterLabel(this.waterHaved)
            })
        }, this)

        this.waterButton.on(TOUCH_CANCEL, () => {
            Util.clickUpTween(this.waterButton)
        }, this)


        // milk
        this.milkButton.on(TOUCH_START, () => {
            Util.clickDownTween(this.milkButton)
        }, this)

        this.milkButton.on(TOUCH_END, () => {
            Util.clickUpTween(this.milkButton, () => {
                this.milkHaved = this.milkHaved + StaticInstance.playerLevel.milkTapSpeed
                this.setMilkLabel(this.milkHaved)
            })
        }, this)

        this.milkButton.on(TOUCH_CANCEL, () => {
            Util.clickUpTween(this.milkButton)
        }, this)


    }

    setCoffeeLabel(level: number) {
        this.coffeeState.string = `coffee ${level.toFixed(1)}`
    }

    setMilkLabel(level: number) {
        this.milkState.string = `milk ${level.toFixed(1)}`
    }

    setWaterLabel(level: number) {
        this.waterState.string = `water ${level.toFixed(1)}`
    }


   



}