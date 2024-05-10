import { StaticInstance } from "./StaticInstance";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerLevel extends cc.Component {

    @property(cc.Label) cash: cc.Label = undefined

    level: number = 2
    cashNum: number = 0

    coffeeTapSpeed: number = 1//0.2
    waterTapSpeed: number = 1//0.1
    milkTapSpeed: number = 1//0.05

    protected onLoad(): void {
        StaticInstance.setPlayerLevel(this)
    }
    
    refreshCash(){
        this.cash.string = `${this.cashNum.toFixed(1)}$`
    }
}