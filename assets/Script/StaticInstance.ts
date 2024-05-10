// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActionTable from "./ActionTable";
import OrderManager from "./OrderManager";
import PlayerLevel from "./PlayerLevel";

export class StaticInstance{
    static actionTable: ActionTable | undefined = undefined
    static orderManager: OrderManager | undefined = undefined
    static playerLevel: PlayerLevel | undefined = undefined


    static setActionTable(context: ActionTable){
        StaticInstance.actionTable = context
    }

    static setOrderaManager(context: OrderManager){
        StaticInstance.orderManager = context
    }

    static setPlayerLevel(context: PlayerLevel){
        StaticInstance.playerLevel = context
    }

}
