const SettingsUI = require('tera-mod-ui').Settings;

module.exports = function Crossservertooltip(mod) {

    if (mod.proxyAuthor !== 'caali' || !global.TeraProxy) {
        mod.warn('You are trying to use this module on an unsupported legacy version of tera-proxy.');
        mod.warn('The module may not work as expected, and even if it works for now, it may break at any point in the future!');
        mod.warn('It is highly recommended that you download the latest official version from the #proxy channel in http://tiny.cc/caalis-tera-proxy');
    }

    let item, paperdoll,
        crystals = [];

    mod.command.add('crosstool', () => {
        if (ui) {
            ui.show();
        } else {
            mod.settings.enabled = !mod.settings.enabled;
            mod.command.message(`Cross server tooltip is now ${mod.settings.enabled ? "enabled" : "disabled"}.`);
        }
    });

    mod.hook('S_USER_PAPERDOLL_INFO', 7, (event) => {
        paperdoll = event;
    });

    mod.hook('C_SHOW_ITEM_TOOLTIP_EX', 3, (event) => {
        if (!mod.settings.enabled) return;
        if (event.serverId != 0 && paperdoll != undefined) {
            for (let i = 0; i < paperdoll.items.length; i++) {
                if (paperdoll.items[i].dbid === event.id) {
                    item = paperdoll.items[i];
                    break;
                }
            }
            if (item == undefined) return;
            if ([1, 3].includes(item.slot)) {
                crystals = [{
                    dbid: item.crystal1
                }, {
                    dbid: item.crystal2
                }, {
                    dbid: item.crystal3
                }, {
                    dbid: item.crystal4
                }];
            }
            else if ([6, 7, 8, 9].includes(item.slot)) {
                if (item.crystal1 != 0) crystals = [{
                    dbid: item.crystal1
                }];
            }
            for (var passive_1 in item.passivitySets) 
                for (var passive_2 in item.passivitySets[passive_1].passivities) 
                    item.passivitySets[passive_1].passivities[passive_2].dbid = item.passivitySets[passive_1].passivities[passive_2].id;
			
            mod.send('S_SHOW_ITEM_TOOLTIP', 9, {
                type: 24,
                unk27: -1,
                enchant: 0,
                dbid: item.id,
                id: item.dbid,
                id2: item.dbid,
                slot: item.slot,
                crystals: crystals,
                amount: item.amount,
                compareStats: false,
                ownerId: item.ownerId,
                soulbound: item.soulbound,
                soulboundName: paperdoll.name,
                passivitySets: item.passivitySets
            });
        }
    });

    let ui = null;
    if (global.TeraProxy.GUIMode) {
        ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 123 }, { alwaysOnTop: true });
        ui.on('update', settings => { mod.settings = settings; });

        this.destructor = () => {
            if (ui) {
                ui.close();
                ui = null;
            }
        };
    }
};