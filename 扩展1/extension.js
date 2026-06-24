import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(){
	return {name:"扩展1",editable:true,connect:false,arenaReady:function(){
    
},content:function(config,pack){
    
},prepare:function(){
},precontent:function(){
    if (lib.namePrefix) lib.namePrefix.set("将灵", { color: "#c3f9ff", nature: "thundermm" });
},help:{},config:{},package:{
    character: {
        character: {
            "界笮融": {
                sex: "male",
                group: "devil",
                hp: 4,
                maxHp: 4,
                hujia: 0,
                skills: ["ext1_mocansi","ext1_mofozong"],
                img: "extension/扩展1/mozarong.jpg",
                dieAudios: ["ext:扩展1/audio/die/界笮融.mp3"],
            },
            "jl_caochun": {
                sex: "male",
                group: "wei",
                hp: 4,
                maxHp: 4,
                skills: ["jl_shanjia","jl_xiaorui"],
                img: "extension/扩展1/caochun.jpg",
                dieAudios: ["ext:扩展1/audio/die/jl_caochun.mp3"],
            },
            "re_caoxian": {
                sex: "female",
                group: "wei",
                hp: 4,
                maxHp: 4,
                skills: ["re_dclingxi","re_dczhifou"],
                img: "extension/扩展1/re_caoxian.jpg",
                hujia: 0,
                dieAudios: ["ext:扩展1/audio/die/re_caoxian.mp3"],
            },
            "jl_zhangqiying": {
                sex: "female",
                group: "qun",
                hp: 4,
                maxHp: 4,
                skills: ["jl_falu","jl_dianhua","jl_zhenyi"],
                img: "extension/扩展1/jl_zhangqiying.jpg",
                hujia: 0,
            },
        },
        translate: {
            "界笮融": "魔笮融",
            "界笮融_prefix": "魔",
            "jl_caochun": "将灵曹纯",
            "jl_caochun_prefix": "将灵",
            "re_caoxian": "界曹宪",
            "re_caoxian_prefix": "界",
            "jl_zhangqiying": "将灵张琪瑛",
            "jl_zhangqiying_prefix": "将灵",
            "扩展1": "扩展1",
        },
    },
    card: {
        card: {
        },
        translate: {
        },
        list: [],
    },
    skill: {
        skill: {
            "ext1_mocansi": {
                audio: "ext:扩展1:2",
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                check: function(event, player){ 
                    return game.hasPlayer(target => target != player); 
                },
                prompt: "魔残肆：你可以回复1点体力",
                async content(event, trigger, player) {
                    player.recover();
                    if (!game.hasPlayer(current => current != player)) return;
                    var result = await player.chooseBool("是否继续发动【魔残肆】，令一名其他角色回复1点体力并视为对其使用三张虚拟牌？").set("ai", function() {
                        return game.hasPlayer(function(target) {
                            return target != player && get.attitude(player, target) < 0;
                        });
                    }).forResult();
                    if (!result.bool) return;
                    var result2 = await player.chooseTarget("魔残肆：选择一名其他角色", true, lib.filter.notMe).set("ai", target => {
                        var player = _status.event.player;
                        var list = ["recover", "sha", "juedou", "huogong"];
                        return list.reduce((p, c) => p + get.effect(target, { name: c }, player, player), 0);
                    }).forResult();
                    if (!result2.bool) return;
                    var target = result2.targets[0];
                    event.target = target;
                    var count = 0;
                    player.line(target, "fire");
                    target.recover();
                    player.addTempSkill("ext1_mocansi_draw");
                    try {
                        while (count < 3 && target.isIn()) {
                            var result3 = await player.chooseControl("杀", "决斗", "火攻").set("prompt", "魔残肆：选择第" + (count + 1) + "张虚拟牌").set("choiceList", [
                                "视为对其使用一张【杀】",
                                "视为对其使用一张【决斗】",
                                "视为对其使用一张【火攻】"
                            ]).set("ai", function() {
                                var player = _status.event.player;
                                var target = _status.event.getParent().target;
                                var map = { "杀": "sha", "决斗": "juedou", "火攻": "huogong" };
                                var controls = _status.event.controls;
                                var choice = controls[0];
                                var max = -Infinity;
                                for (var i = 0; i < controls.length; i++) {
                                    var name = map[controls[i]];
                                    var eff = get.effect(target, { name: name, isCard: true }, player, player);
                                    if (eff > max) {
                                        max = eff;
                                        choice = controls[i];
                                    }
                                }
                                return choice;
                            }).forResult();
                            var map = { "杀": "sha", "决斗": "juedou", "火攻": "huogong" };
                            var card = { name: map[result3.control], isCard: true };
                            if (target.isIn() && player.canUse(card, target, false)) {
                                player.useCard(card, target, false);
                            }
                            count++;
                        }
                    } finally {
                        player.removeSkill("ext1_mocansi_draw");
                    }
                },
                subSkill: {
                    draw: {
                        audio: "dccansi",
                        trigger: {
                            global: "damageEnd",
                        },
                        forced: true,
                        charlotte: true,
                        onremove: true,
                        filter(event, player) {
                            return event.source == player && event.num > 0;
                        },
                        async content(event, trigger, player) {
                            await player.draw(trigger.num * 2);
                        },
                        sub: true,
                        sourceSkill: "ext1_mocansi",
                        "_priority": 0,
                        "skill_id": "ext1_mocansi_draw",
                    },
                },
                ai: {
                    threaten: 5,
                    expose: 0.3,
                    result: {
                        player: function(player){ 
                            if (!game.hasPlayer(target => target != player)) {return 0;} 
                            var eff = 0; 
                            for (var target of game.players) { 
                                if (target == player) {continue;} 
                                var base = target.hp < 3 ? 1 : 0.5; 
                                eff = Math.max(eff, base * 3); // 粗略估计 
                            } 
                            return eff > 1 ? 1 : 0; 
                        },
                    },
                },
                "skill_id": "ext1_mocansi",
                "_priority": 0,
            },
            "ext1_mofozong": {
                audio: "ext:扩展1:2",
                trigger: {
                    global: ["gainAfter","loseAsyncAfter"],
                },
                forced: true,
                direct: true,
                getIndex: function(event, player) {
                    return game.filterPlayer(function(current) {
                        var cards;
                        if (current == player || !current.isIn()) return false;
                        if (event.name == "gain") {
                            if (event.player != current) return false;
                            cards = event.cards;
                        } else {
                            cards = event.getg && event.getg(current);
                        }
                        return cards && cards.length && current.countCards("h") > 7;
                    }).sortBySeat();
                },
                filter: function(event, player, name, target) {
                    return target && target.isIn() && target != player && target.countCards("h") > 7;
                },
                intro: {
                    markcount: "expansion",
                    content: "expansion",
                },
                content: function() {
                    'step 0'
                    event.target = event.targets && event.targets.length ? event.targets[0] : trigger.player;
                    if (!event.target || !event.target.isIn() || event.target == player || event.target.countCards("h") <= 7) {
                        event.finish();
                        return;
                    }
                    event.num = event.target.countCards("h") - 7;
                    event.target.chooseCard("魔佛宗：将" + get.cnNumber(event.num) + "张手牌置于武将牌上", true, event.num).set("ai", function(card) {
                        return -get.value(card);
                    });
                    'step 1'
                    if (result.bool && result.cards && result.cards.length) {
                        player.logSkill("ext1_mofozong", event.target);
                        player.line(event.target);
                        event.placed = true;
                        event.target.addToExpansion(result.cards, event.target, "give").gaintag.add("ext1_mofozong");
                    } else {
                        event.finish();
                    }
                    'step 2'
                    var target = event.target;
                    var cards = target.getExpansions("ext1_mofozong");
                    if (!event.placed || !target.isIn() || cards.length < 7) {
                        event.finish();
                    } else {
                        player.chooseControl("获得所有牌并令其回复1点体力", "令其失去1点体力").set("prompt", "魔佛宗：选择一项").set("choiceList", [
                            "获得" + get.translation(target) + "武将牌上的所有“魔佛宗”牌并令其回复1点体力",
                            "令" + get.translation(target) + "失去1点体力"
                        ]).set("ai", function() {
                            var player = _status.event.player;
                            var target = _status.event.getParent().target;
                            if (get.attitude(player, target) > 0) return "获得所有牌并令其回复1点体力";
                            return "令其失去1点体力";
                        });
                    }
                    'step 3'
                    var target = event.target;
                    var cards = target.getExpansions("ext1_mofozong");
                    if (result.control == "获得所有牌并令其回复1点体力") {
                        if (cards.length) {
                            player.gain(cards, target, "give");
                        }
                        if (target.isIn()) {
                            target.recover(player);
                        }
                    } else if (target.isIn()) {
                        target.loseHp();
                    }
                },
                ai: {
                    threaten: 3,
                },
                "skill_id": "ext1_mofozong",
                "_priority": 0,
            },
            "jl_shanjia": {
                audio: "ext:扩展1:2",
                shaRelated: true,
                trigger: {
                    global: "phaseBegin",
                },
                frequent: true,
                content: function() {
                    'step 0'
                    player.chooseBool(get.prompt("jl_shanjia")).set('ai', function() { return true; });
                    'step 1'
                    if (result.bool) {
                        player.chooseControl('2张', '3张', '4张').set('prompt', '请选择摸牌数量').set('ai', function() { return 2; });
                    } else {
                        event.finish();
                    }
                    'step 2'
                    player.draw(result.index + 2);
                    player.logSkill('jl_shanjia');
                    if (trigger.player == player) {
                        player.chooseBool('是否视为使用一张无视距离、不可响应且伤害自选的【杀】？').set('ai', function() { return true; });
                    } else {
                        event.finish();
                    }
                    'step 3'
                    if (result.bool) {
                        player.chooseControl('+1', '+2').set('prompt', '请选择伤害增加量').set('ai', function() { return 1; });
                    } else {
                        event.finish();
                    }
                    'step 4'
                    player.storage.jl_shanjia_dmg = result.index + 1;
                    player.addTempSkill('jl_shanjia_effect', 'phaseAfter');
                    player.chooseUseTarget({name:'sha'}, false, 'nodistance');
                },
                ai: {
                    threaten: 1.5,
                },
                "skill_id": "jl_shanjia",
                "_priority": 0,
            },
            "jl_shanjia_effect": {
                trigger: {
                    player: "useCardToPlayered",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.card && event.card.name == 'sha';
                },
                content: function() {
                    trigger.getParent().directHit.add(trigger.target);
                },
                ai: {
                    "directHit_ai": true,
                },
                group: "jl_shanjia_effect_damage",
                "skill_id": "jl_shanjia_effect",
                "_priority": 0,
            },
            "jl_shanjia_effect_damage": {
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.card && event.card.name == 'sha';
                },
                content: function() {
                    trigger.num += (player.storage.jl_shanjia_dmg || 1);
                    player.removeSkill('jl_shanjia_effect');
                    delete player.storage.jl_shanjia_dmg;
                },
                ai: {
                    damageBonus: true,
                },
                "skill_id": "jl_shanjia_effect_damage",
                "_priority": 0,
            },
            "jl_xiaorui": {
                audio: "ext:扩展1:2",
                trigger: {
                    source: "damageBegin",
                },
                usable: 4,
                check: function(event, player) {
                    return true;
                },
                content: function() {
                    'step 0'
                    player.chooseControl('2张', '3张', '4张').set('prompt', '请选择获得牌的数量').set('ai', function() { return 2; });
                    'step 1'
                    var cardCount = result.index + 2;
                    event._cardCount = cardCount;
                    player.chooseControl('2', '3', '4').set('prompt', '请选择伤害增加量').set('ai', function() { return 2; });
                    'step 2'
                    var dmgAdd = result.index + 2;
                    var target = trigger.player;
                    // 先随机获得目标手牌装备
                    var cards = target.getCards('he').slice();
                    for (var i = cards.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var temp = cards[i];
                        cards[i] = cards[j];
                        cards[j] = temp;
                    }
                    var num = Math.min(event._cardCount, cards.length);
                    if (num > 0) {
                        player.gain(cards.slice(0, num), target, 'giveAuto');
                    }
                    // 再增加伤害
                    trigger.num += dmgAdd;
                    player.logSkill('jl_xiaorui');
                },
                ai: {
                    threaten: 2,
                },
                "skill_id": "jl_xiaorui",
                "_priority": 0,
            },
            "jl_falu": {
                audio: "ext:扩展1:2",
                trigger: {
                    player: "phaseJieshuBegin",
                },
                check: function(event, player) {
                    return true;
                },
                async content(event, trigger, player) {
                    var suits = ["spade", "heart", "club", "diamond"];
                    var gained = [];
                    for (var s = 0; s < suits.length; s++) {
                        var suit = suits[s];
                        var card = get.cardPile(function(card2) {
                            return get.suit(card2, false) == suit && !gained.includes(card2);
                        }, "cardPile", "random");
                        if (card) gained.push(card);
                    }
                    if (!gained.length) return;
                    player.logSkill("jl_falu");
                    await player.gain(gained, "draw");
                    var sameNum = false;
                    var nums = {};
                    for (var i = 0; i < gained.length; i++) {
                        var num = get.number(gained[i], false);
                        if (num !== undefined && num !== null) {
                            if (nums[num]) { sameNum = true; break; }
                            nums[num] = true;
                        }
                    }
                    if (!sameNum) return;
                    player.recover();
                    if (!game.hasPlayer(function(current) { return current != player; })) return;
                    var result = await player.chooseTarget("法箓：选择至多两名其他角色各造成1点伤害", [1, 2], lib.filter.notMe)
                        .set("ai", function(target) {
                            return get.attitude(_status.event.player, target) < 0 ? 1 : 0;
                        }).forResult();
                    if (result.bool) {
                        for (var i = 0; i < result.targets.length; i++) {
                            player.line(result.targets[i], "fire");
                            result.targets[i].damage(1, player);
                        }
                    }
                },
                ai: {
                    threaten: 1.5,
                },
                "skill_id": "jl_falu",
                "_priority": 0,
            },
            "jl_dianhua": {
                audio: "ext:扩展1:2",
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                frequent: true,
                async content(event, trigger, player) {
                    var cards = get.cards(4);
                    var next = player.chooseToMove(true);
                    next.set("list", [["牌堆顶（上→下）", cards]]);
                    next.set("prompt", "点化：将卡牌按任意顺序置于牌堆顶（越靠左越在顶部）");
                    next.processAI = function(list) {
                        var cs = list[0][1].slice();
                        cs.sort(function(a, b) {
                            return get.value(b) - get.value(a);
                        });
                        return [cs];
                    };
                    var result = await next.forResult();
                    var top = (result && result.moved && result.moved[0]) ? result.moved[0] : cards;
                    top.reverse();
                    await game.cardsGotoPile(top, ["top_cards", top], function(event2, card) {
                        if (event2.top_cards.includes(card)) return ui.cardPile.firstChild;
                        return null;
                    });
                    player.logSkill("jl_dianhua");
                },
                ai: {
                    threaten: 1.2,
                },
                "skill_id": "jl_dianhua",
                "_priority": 0,
            },
            "jl_zhenyi": {
                audio: "ext:扩展1:2",
                group: ["jl_zhenyi_damage","jl_zhenyi_defend"],
                "skill_id": "jl_zhenyi",
                "_priority": 0,
            },
            "jl_zhenyi_damage": {
                audio: "ext:扩展1:2",
                trigger: {
                    source: "damageBegin",
                },
                usable: 2,
                filter: function(event, player) {
                    return event.player && event.player != player;
                },
                prompt: function(event, player) {
                    return "是否发动「真仪」，令对" + get.translation(event.player) + "造成的伤害+1并随机获得其一张牌？";
                },
                check: function(event, player) {
                    return true;
                },
                async content(event, trigger, player) {
                    trigger.num++;
                    var target = trigger.player;
                    var cards = target.getCards("he");
                    if (cards.length) {
                        var card = cards[Math.floor(Math.random() * cards.length)];
                        await player.gain(card, target, "giveAuto");
                    }
                    player.logSkill("jl_zhenyi", target);
                },
                ai: {
                    damageBonus: true,
                },
                sub: true,
                sourceSkill: "jl_zhenyi",
                "skill_id": "jl_zhenyi_damage",
                "_priority": 0,
            },
            "jl_zhenyi_defend": {
                audio: "ext:扩展1:2",
                trigger: {
                    player: "damageBegin",
                },
                usable: 2,
                filter: function(event, player) {
                    return event.source && event.source != player;
                },
                prompt: function(event, player) {
                    return "是否发动「真仪」，防止此伤害并随机弃置" + get.translation(event.source) + "两张牌？";
                },
                check: function(event, player) {
                    return true;
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                    var source = trigger.source;
                    if (source && source.countCards("he")) {
                        var cards = source.getCards("he").slice();
                        for (var i = cards.length - 1; i > 0; i--) {
                            var j = Math.floor(Math.random() * (i + 1));
                            var temp = cards[i];
                            cards[i] = cards[j];
                            cards[j] = temp;
                        }
                        var num = Math.min(2, cards.length);
                        source.discard(cards.slice(0, num));
                    }
                    player.logSkill("jl_zhenyi", source);
                },
                ai: {
                    threaten: 1.5,
                },
                sub: true,
                sourceSkill: "jl_zhenyi",
                "skill_id": "jl_zhenyi_defend",
                "_priority": 0,
            },
            "re_dclingxi": {
                trigger: {
                    player: ["phaseUseBegin","phaseUseEnd"],
                    global: "roundStart",
                },
                direct: true,
                filter: function(event, player) {
                    return player.countCards("he") && player.maxHp > 0;
                },
                async content(event, trigger, player) {
                    var num = player.maxHp;
                    var result = await player
                        .chooseCard("he", [1, num], get.prompt("re_dclingxi"), "将至多" + get.cnNumber(num) + "张牌称为「翼」置于武将牌上")
                        .set("complexCard", true)
                        .set("ai", card => 8 - get.useful(card))
                        .forResult();
                    if (result.bool) {
                        player.logSkill("re_dclingxi");
                        player.addToExpansion(result.cards, player, "give").gaintag.add("re_dclingxi");
                    }
                },
                group: "re_dclingxi_effect",
                marktext: "翼",
                intro: {
                    content: "expansion",
                    markcount: "expansion",
                },
                onremove: function(player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                "skill_id": "re_dclingxi",
                "_priority": 0,
            },
            "re_dclingxi_effect": {
                trigger: {
                    player: "loseAfter",
                    global: ["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter"],
                },
                forced: true,
                filter: function(event, player) {
                    var num = 2 * player.getExpansions("re_dclingxi").reduce(function(list, card) {
                        return list.add(get.suit(card, false));
                    }, []).length;
                    num -= player.countCards("h");
                    if (!num) return false;
                    if (event.name == "lose" && event.getlx !== false) {
                        for (var i in event.gaintag_map) {
                            if (event.gaintag_map[i].includes("re_dclingxi")) return true;
                        }
                        return false;
                    }
                    return game.getGlobalHistory("cardMove", function(evt) {
                        if (evt.name != "lose" || event != evt.getParent()) return false;
                        for (var i in evt.gaintag_map) {
                            if (evt.gaintag_map[i].includes("re_dclingxi") && evt.player == player) return true;
                        }
                        return false;
                    }).length;
                },
                async content(event, trigger, player) {
                    var num = 2 * player.getExpansions("re_dclingxi").reduce(function(list, card) {
                        return list.add(get.suit(card, false));
                    }, []).length;
                    num -= player.countCards("h");
                    if (num > 0) {
                        await player.draw(num);
                    } else {
                        await player.chooseToDiscard("h", -num, true, "allowChooseAll");
                    }
                },
                "skill_id": "re_dclingxi_effect",
                "_priority": 0,
            },
            "re_dczhifou": {
                trigger: {
                    player: "loseAfter",
                },
                direct: true,
                filter: function(event, player) {
                    if (player._re_dczhifou_ing) return false;
                    // 排除「灵犀」主动放翼（以及知否选项①把牌置为翼）造成的失去牌：
                    // addToExpansion 产生的 lose 事件 type 恒为 "loseToExpansion"、getlx===false
                    // （content.js:10770 源码实证）。放翼失去的是手牌，gaintag_map 不含
                    // re_dclingxi，故不能用 gaintag 判断，改用 type 精确匹配。
                    // 装备(type:equip)/判定(type:addJudge) 不会误伤。
                    if (event.name == "lose" && event.type == "loseToExpansion") return false;
                    var num = player.getHistory("useSkill", function(evt) {
                        return evt.skill == "re_dczhifou";
                    }).length + 1;
                    return player.getExpansions("re_dclingxi").length >= num;
                },
                async content(event, trigger, player) {
                    player._re_dczhifou_ing = true;
                    try {
                        var num = player.getHistory("useSkill", function(evt) {
                            return evt.skill == "re_dczhifou";
                        }).length + 1;
                        var expansions = player.getExpansions("re_dclingxi");
                        var result = await player
                            .chooseButton(
                                ["###" + get.prompt("re_dczhifou") + "###移去至少" + get.cnNumber(num) + "张武将牌上的「翼」", expansions],
                                [num, expansions.length],
                                "allowChooseAll"
                            )
                            .set("ai", button => 1)
                            .forResult();
                        if (!result.bool) return;
                        player.logSkill("re_dczhifou");
                        player.loseToDiscardpile(result.links);

                        var result2 = await player
                            .chooseTarget("知否：选择一名角色", true)
                            .set("ai", target => (get.attitude(player, target) < 0 ? 1 : 0))
                            .forResult();
                        if (!result2.bool) return;
                        var target = result2.targets[0];
                        player.line(target, "thunder");

                        var available = [];
                        if (target.countCards("he")) available.push("翼");
                        if (target == player ? target.countDiscardableCards(target, "he") : target.countCards("he")) available.push("弃");
                        available.push("体力");
                        var maxChoice = Math.min(num, available.length);
                        if (maxChoice <= 0) return;

                        var optDesc = {
                            "翼": "将其一张牌称为「翼」置于你的武将牌上",
                            "弃": "弃置其至多两张牌",
                            "体力": "令其失去1点体力",
                        };
                        var chosen = [];
                        while (chosen.length < maxChoice) {
                            var remaining = available.filter(o => !chosen.includes(o));
                            if (!remaining.length) break;
                            var ctrls = remaining.concat(["结束"]);
                            var r = await player
                                .chooseControl(ctrls)
                                .set("prompt", "知否：已选" + chosen.length + "/" + get.cnNumber(num) + "项，选择下一项或结束")
                                .set("choiceList", ctrls.map(c => c == "结束" ? "结束选择，立即结算" : optDesc[c]))
                                .set("ai", () => "结束")
                                .forResult();
                            if (r.control == "结束" || !r.control) break;
                            chosen.push(r.control);
                        }
                        if (!chosen.length) return;

                        for (var i = 0; i < chosen.length; i++) {
                            var opt = chosen[i];
                            if (opt == "翼" && target.countCards("he")) {
                                player.line(target, "green");
                                var r3 = await player
                                    .choosePlayerCard(target, "he", true, [1, 1], "将" + get.translation(target) + "的一张牌称为「翼」置于你的武将牌上")
                                    .forResult();
                                if (r3.bool && r3.cards && r3.cards.length) {
                                    player.addToExpansion(r3.cards, target, "give").gaintag.add("re_dclingxi");
                                }
                            } else if (opt == "弃" && (target == player ? target.countDiscardableCards(target, "he") : target.countCards("he"))) {
                                player.line(target, "fire");
                                var max2 = Math.min(2, target.countCards("he"));
                                if (max2 > 0) {
                                    var r4 = await player
                                        .choosePlayerCard(target, "he", true, [1, max2], "弃置" + get.translation(target) + "的至多两张牌")
                                        .forResult();
                                    if (r4.bool && r4.cards && r4.cards.length) {
                                        target.discard(r4.cards);
                                    }
                                }
                            } else if (opt == "体力") {
                                player.line(target, "thunder");
                                await target.loseHp();
                            }
                        }
                    } finally {
                        player._re_dczhifou_ing = false;
                    }
                },
                "skill_id": "re_dczhifou",
                "_priority": 0,
            },
        },
        translate: {
            "ext1_mocansi": "魔残肆",
            "ext1_mocansi_info": "准备阶段，你可以回复1点体力，然后你可以令一名其他角色回复1点体力并视为对其使用三张【杀】/【决斗】/【火攻】（每次均可自由选择）。在此期间，你每造成1点伤害便摸两张牌。",
            "ext1_mofozong": "魔佛宗",
            "ext1_mofozong_info": "锁定技，其他角色获得手牌后，若其手牌数大于7，其将X张手牌置于其武将牌上（X为其手牌数-7）。然后若其武将牌上的“魔佛宗”牌数不小于7，你选择一项：⒈获得这些牌并令其回复1点体力；⒉令其失去1点体力。",
            "jl_shanjia": "缮甲",
            "jl_shanjia_info": "每名角色的回合开始时，你可以摸2-4张牌（自选）；若此时是你的回合，你可以视为使用一张无视距离、不可响应且伤害增加1-2点（自选）的【杀】。",
            "jl_xiaorui": "骁锐",
            "jl_xiaorui_info": "每回合限四次，当你造成伤害时，你可以先随机获得受伤目标2-4张牌（自选张数），然后令此伤害增加2-4点（自选点数）。",
            "jl_falu": "法箓",
            "jl_falu_info": "结束阶段，你可以随机获得牌堆中四种花色的牌各一张。若你因此获得了点数相同的牌，你回复1点体力并对至多两名其他角色各造成1点伤害。",
            "jl_dianhua": "点化",
            "jl_dianhua_info": "准备阶段，你可以观看牌堆顶的四张牌，然后以任意顺序放回牌堆顶。",
            "jl_zhenyi": "真仪",
            "jl_zhenyi_info": "当你对其他角色造成伤害时，你可以令此伤害+1，然后随机获得其一张牌；当你受到其他角色造成的伤害时，你可以防止此伤害，然后你随机弃置伤害来源两张牌。（每个效果每回合各限触发2次）",
            "re_dclingxi": "灵犀",
            "re_dclingxi_info": "每轮开始时、出牌阶段开始和结束时，你可以将至多X张牌称为「翼」置于你的武将牌上（X为你的体力上限）。当你失去武将牌上的「翼」时，你将手牌数调整至Y张（Y为你武将牌上的「翼」所含有的花色数的两倍）。",
            "re_dczhifou": "知否",
            "re_dczhifou_info": "当你失去牌后，你可以移去至少X张武将牌上的「翼」（X为本回合此前发动此技能的次数+1），然后选择一名角色，并选择至多X项令其执行：①将一张牌称为「翼」置于你的武将牌上；②弃置其两张牌；③令其失去1点体力。",
        },
    },
    intro: "",
    author: "nihility",
    diskURL: "",
    forumURL: "",
    version: "1.4.10",
},files:{"character":["mozarong.jpg","caochun.jpg","re_caoxian.jpg","jl_zhangqiying.jpg"],"card":[],"skill":[],"audio":[]}} 
};