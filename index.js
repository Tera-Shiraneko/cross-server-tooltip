module.exports = function Crossservertooltip(mod) {
    let paperdoll;
    
    mod.hook('S_USER_PAPERDOLL_INFO', 5, (event) => {
        paperdoll = event;
    });
    
    mod.hook('C_SHOW_ITEM_TOOLTIP_EX', 3, (event) => {
        // cross-server players only
        if (event.serverId != 0 && paperdoll != undefined) {
            let item;
            
            // retrieve item from paperdoll
            for(let i = 0; i < paperdoll.items.length; i++) {
                if (paperdoll.items[i].id == event.id) {
                    item = paperdoll.items[i];
                    break;
                }
            }
            if (item == undefined) return; //abort if not found
            
            // construct crystals object
            // note the datatypes associated with crystals in S_USER_PAPERDOLL_INFO.5 are wrong
            let crystals = [];
            if ([1,3].includes(item.unk1)) { // weapon and chest
                crystals = [{dbid: item.crystal3}, {dbid: item.crystal4}, {dbid: item.crystal5}, {dbid: item.unk2}];
            } 
            else if ([6,7,8,9].includes(item.unk1)) { // earrings and rings
                if (item.crystal3 != 0) crystals = [{dbid: item.crystal3}];
            }
            
            // show tooltip
            mod.send('S_SHOW_ITEM_TOOLTIP', 9, {
                type: 24,
                id: item.id,
                dbid: item.dbid,
                id2: item.id,
                ownerId: item.playerId,
                slot: item.unk1,              // S_USER_PAPERDOLL_INFO.5.items.unk1 is slot
                // int32  unk1
                // int32  amountTotal
                amount: item.amount,
                enchant: 0,//item.enchant,    //(bug?) item.enchant always equals 1 for cross-server players
                // int32  unk2
                soulbound: item.soulbound,
                // int32  unk3
                // passivitySet: 0,
                // extraPassivitySets: 0,
                compareStats: false,
                // int32  etching1
                // int32  etching2
                // int32  etching3
                // int32  etching4
                // int32  etching5 # etchings 5-8 are red in standard tooltips (new etching tooltip displays them as green)
                // int32  etching6
                // int32  etching7
                // int32  etching8
                // int32  etchingSecRemaining
                // int32  unk6
                // int32  unk7
                // int32  unk8
                // int32  unk9
                // int32  unk10
                // int32  unk11
                // int32  unk12
                // int32  unk13
                // int32  unk14
                // int32  unk15
                // int32  unk16
                // int32  unk17
                // int32  unk18
                // int32  unk19
                // int32  unk20
                // int32  enigma
                // bool   masterwork
                // int32  unk21
                // int32  remodel
                // uint32 dye
                // int32  dyeSecRemaining
                // int32  unk22
                // int32  unk23
                // int32  unk24
                // int32  unk25
                // int32  unk26
                // int64  acquisitionDate
                // secRemaining: 1,                  //# -1 = display acquisition date instead, -2 = Infinity
                unk27: -1,                           //# -1 = hide remaining time, 0 = show remaining time
                // int32  setId
                // int32  unk28                      # -1
                // int32  enchantAdvantage           # hidden
                // int32  enchantAdvantageBonus      # hidden
                // int32  enchantAdvantageBonusUntil # hidden
                // int64  averageBrokerPrice
                // int32  feedstock                  # hidden
                // int64  dismantlePrice             # hidden
                // int64  xp
                // bool   awakened
                // int32  liberationStatus           # See S_INVEN
                // uint32 unk29
                // byte   unk30                
                crystals: crystals,
                passivitySets: item.passivitySets,
                // array  statComparison
                soulboundName: paperdoll.name
            });
        }
    });
}