import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(){
	return {name:"斗罗大陆",editable:true,connect:false,arenaReady:function(){

    },content:function(config,pack){

    },prepare:function(){

    },precontent:function(){

    },help:{},config:{},package:{
    character: {
        character: {
            "dl_huoyuhao": {
                sex: "male",
                group: "shen",
                hp: 4,
                maxHp: 4,
                skills: ["dl_lingmou","dl_xiuluo","dl_bingxie","dl_bingdi"],
                img: "extension/斗罗大陆/dl_huoyuhao.jpg",
                hujia: 0,
            },
        },
        characterTitle: {
            "dl_huoyuhao": "灵冰斗罗",
        },
        translate: {
            "dl_huoyuhao": "霍雨浩",
            "斗罗大陆": "斗罗大陆",
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
            "dl_lingmou": {
                audio: "ext:斗罗大陆:2",
                locked: true,
                enable: "phaseUse",
                usable: 1,
                filterTarget: function(card, player, target) {
                    return target != player;
                },
                content: function() {
                    game.countPlayer(function(current) {
                        if (current.storage.dl_lingmou_grant_source == player) {
                            current.removeSkill("dl_lingmou_grant");
                            delete current.storage.dl_lingmou_grant_source;
                        }
                    });
                    target.storage.dl_lingmou_grant_source = player;
                    target.addSkill("dl_lingmou_grant");
                    player.line(target, "thunder");
                },
                group: ["dl_lingmou_start","dl_lingmou_clear"],
                clickableFilter: function(player) {
                    return player.hasSkill("dl_lingmou");
                },
                clickable: function(player) {
                    if (player.isUnderControl(true)) {
                        var createDialogWithControl = function(result) {
                            var dialog = ui.create.dialog("灵眸：牌堆顶五张牌", "peaceDialog");
                            result.length > 0 ? dialog.add(result, true) : dialog.addText("牌堆顶无牌");
                            var control = ui.create.control("确定", function() { dialog.close(); });
                            dialog._close = dialog.close;
                            dialog.hide = dialog.close = function() {
                                control.close();
                                return dialog._close.apply(this, arguments);
                            };
                            if (_status.dl_lingmou_clickable) {
                                _status.dl_lingmou_clickable.close();
                            }
                            _status.dl_lingmou_clickable = dialog;
                            dialog.open();
                        };
                        var cards = lib.skill.dl_lingmou.getCards(player);
                        if (cards instanceof Promise) {
                            cards.then(function(result) { createDialogWithControl(result[1]); });
                        } else {
                            createDialogWithControl(cards);
                        }
                    }
                },
                getCards: function(player) {
                    if (game.online) {
                        return game.requestSkillData("dl_lingmou", "getTopCards", 1e4);
                    }
                    if (ui.cardPile.hasChildNodes !== false) {
                        return Array.from(ui.cardPile.childNodes).slice(0, 5);
                    }
                    return [];
                },
                sync: {
                    getTopCards: function() {
                        if (ui.cardPile.hasChildNodes !== false) {
                            return Array.from(ui.cardPile.childNodes).slice(0, 5);
                        }
                        return [];
                    },
                },
                mark: true,
                marktext: "眸",
                intro: {
                    mark: function(dialog, content, player, event, skill) {
                        var intronode = ui.create.div(".menubutton.pointerdiv", "点击查看牌堆顶五张牌", function() {
                            if (!this.classList.contains("disabled")) {
                                this.classList.add("disabled");
                                this.style.opacity = 0.5;
                                lib.skill[skill].clickable(player);
                            }
                        });
                        if (!_status.gameStarted || !player.isUnderControl(true) || !lib.skill[skill].clickableFilter(player)) {
                            intronode.classList.add("disabled");
                            intronode.style.opacity = 0.5;
                        }
                        dialog.add(intronode);
                    },
                },
                ai: {
                    viewHandcard: true,
                    skillTagFilter: function(player, tag, arg) {
                        if (player == arg) return false;
                    },
                    order: 7,
                    result: {
                        target: function(player, target) {
                            return get.attitude(player, target);
                        },
                    },
                },
                "skill_id": "dl_lingmou",
                "_priority": 0,
            },
            "dl_lingmou_start": {
                trigger: {
                    global: "gameStart",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return game.hasPlayer(function(current) { return current != player; });
                },
                content: function() {
                    var text = "";
                    game.filterPlayer(function(current) {
                        return current != player;
                    }).sortBySeat().forEach(function(current) {
                        var identity = current.identity ? get.translation(current.identity) : "未知";
                        var hidden = [];
                        if (current.isUnseen && current.isUnseen(0) && current.name1) hidden.push(get.translation(current.name1));
                        if (current.isUnseen && current.isUnseen(1) && current.name2) hidden.push(get.translation(current.name2));
                        text += get.translation(current) + "：身份牌为" + identity;
                        if (hidden.length) text += "；暗置武将牌为" + hidden.join("、");
                        text += "<br>";
                    });
                    player.chooseControl("ok").set("dialog", ["灵眸：观看身份牌和暗置武将牌", "<div class=\"text left\">" + text + "</div>"]);
                },
                "skill_id": "dl_lingmou_start",
                "_priority": 0,
            },
            "dl_lingmou_clear": {
                trigger: {
                    player: "phaseUseBegin",
                },
                forced: true,
                popup: false,
                content: function() {
                    game.countPlayer(function(current) {
                        if (current.storage.dl_lingmou_grant_source == player) {
                            current.removeSkill("dl_lingmou_grant");
                            delete current.storage.dl_lingmou_grant_source;
                        }
                    });
                },
                "skill_id": "dl_lingmou_clear",
                "_priority": 0,
            },
            "dl_lingmou_grant": {
                charlotte: true,
                mark: true,
                marktext: "眸",
                onremove: function(player) {
                    delete player.storage.dl_lingmou_grant_source;
                },
                clickableFilter: function(player) {
                    return player.hasSkill("dl_lingmou_grant");
                },
                clickable: function(player) {
                    if (player.isUnderControl(true)) {
                        var createDialogWithControl = function(result) {
                            var dialog = ui.create.dialog("灵眸：牌堆顶五张牌", "peaceDialog");
                            result.length > 0 ? dialog.add(result, true) : dialog.addText("牌堆顶无牌");
                            var control = ui.create.control("确定", function() { dialog.close(); });
                            dialog._close = dialog.close;
                            dialog.hide = dialog.close = function() {
                                control.close();
                                return dialog._close.apply(this, arguments);
                            };
                            if (_status.dl_lingmou_grant_clickable) {
                                _status.dl_lingmou_grant_clickable.close();
                            }
                            _status.dl_lingmou_grant_clickable = dialog;
                            dialog.open();
                        };
                        var cards = lib.skill.dl_lingmou_grant.getCards(player);
                        if (cards instanceof Promise) {
                            cards.then(function(result) { createDialogWithControl(result[1]); });
                        } else {
                            createDialogWithControl(cards);
                        }
                    }
                },
                getCards: function(player) {
                    if (game.online) {
                        return game.requestSkillData("dl_lingmou_grant", "getTopCards", 1e4);
                    }
                    if (ui.cardPile.hasChildNodes !== false) {
                        return Array.from(ui.cardPile.childNodes).slice(0, 5);
                    }
                    return [];
                },
                sync: {
                    getTopCards: function() {
                        if (ui.cardPile.hasChildNodes !== false) {
                            return Array.from(ui.cardPile.childNodes).slice(0, 5);
                        }
                        return [];
                    },
                },
                intro: {
                    mark: function(dialog, content, player, event, skill) {
                        var intronode = ui.create.div(".menubutton.pointerdiv", "点击查看牌堆顶五张牌", function() {
                            if (!this.classList.contains("disabled")) {
                                this.classList.add("disabled");
                                this.style.opacity = 0.5;
                                lib.skill[skill].clickable(player);
                            }
                        });
                        if (!_status.gameStarted || !player.isUnderControl(true) || !lib.skill[skill].clickableFilter(player)) {
                            intronode.classList.add("disabled");
                            intronode.style.opacity = 0.5;
                        }
                        dialog.add(intronode);
                    },
                },
                ai: {
                    viewHandcard: true,
                    skillTagFilter: function(player, tag, arg) {
                        if (player == arg) return false;
                    },
                },
                "skill_id": "dl_lingmou_grant",
                "_priority": 0,
            },
            "dl_bingxie": {
                audio: "ext:斗罗大陆:2",
                group: ["dl_bingxie_fire","dl_bingxie_han"],
                "skill_id": "dl_bingxie",
                "_priority": 0,
            },
            "dl_bingxie_fire": {
                trigger: {
                    player: "damageBegin4",
                },
                forced: true,
                filter: function(event, player) {
                    return event.hasNature && event.hasNature("fire");
                },
                content: function() {
                    trigger.cancel();
                },
                ai: {
                    nofire: true,
                    effect: {
                        target: function(card, player, target) {
                            if (get.tag(card, "fireDamage")) return "zeroplayertarget";
                        },
                    },
                },
                "skill_id": "dl_bingxie_fire",
                "_priority": 0,
            },
            "dl_bingxie_han": {
                trigger: {
                    source: "damageEnd",
                },
                prompt: function(event, player) {
                    return "是否发动「冰邪」，令" + get.translation(event.player) + "获得一枚「寒」标记？";
                },
                check: function(event, player) {
                    return get.attitude(player, event.player) < 0;
                },
                filter: function(event, player) {
                    return event.player && event.player.isIn() && event.player != player;
                },
                async content(event, trigger, player) {
                    player.logSkill("dl_bingxie", trigger.player);
                    trigger.player.addSkill("dl_han");
                    trigger.player.addMark("dl_han", 1);
                },
                "skill_id": "dl_bingxie_han",
                "_priority": 0,
            },
            "dl_han": {
                charlotte: true,
                mark: true,
                marktext: "寒",
                intro: {
                    content: "跳过判定和摸牌阶段；出牌阶段使用牌或技能后，所有技能失效并结束出牌阶段；弃牌阶段，弃置所有牌并移除一枚「寒」标记，标记归零时失去「寒」（可叠加）。",
                },
                group: ["dl_han_skip","dl_han_usecard","dl_han_useskill","dl_han_discard"],
                onremove: function(player) {
                    player.removeSkill("dl_han_blocker");
                    delete player.storage.dl_han_triggered;
                },
                "skill_id": "dl_han",
                "_priority": 0,
            },
            "dl_han_skip": {
                trigger: {
                    player: "phaseBegin",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return player.countMark("dl_han") > 0;
                },
                content: function() {
                    player.skip("phaseJudge");
                    player.skip("phaseDraw");
                    // 回合开始重置：移除上一回合的封技 blocker、清触发标记，使本回合可再次触发寒效果
                    player.removeSkill("dl_han_blocker");
                    delete player.storage.dl_han_triggered;
                },
                "skill_id": "dl_han_skip",
                "_priority": 0,
            },
            "dl_han_usecard": {
                trigger: {
                    player: "useCardAfter",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return player.countMark("dl_han") > 0 && !player.storage.dl_han_triggered && _status.currentPhase == player && player.isPhaseUsing();
                },
                content: function() {
                    player.storage.dl_han_triggered = true;
                    player.addSkill("dl_han_blocker");
                    var evt = _status.event.getParent("phaseUse");
                    if (evt && evt.name == "phaseUse") evt.skipped = true;
                },
                "skill_id": "dl_han_usecard",
                "_priority": 0,
            },
            "dl_han_useskill": {
                trigger: {
                    player: "useSkillAfter",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    if (player.countMark("dl_han") <= 0 || player.storage.dl_han_triggered || _status.currentPhase != player || !player.isPhaseUsing()) return false;
                    if (event.skill && event.skill.indexOf("dl_han") == 0) return false;
                    return true;
                },
                content: function() {
                    player.storage.dl_han_triggered = true;
                    player.addSkill("dl_han_blocker");
                    var evt = _status.event.getParent("phaseUse");
                    if (evt && evt.name == "phaseUse") evt.skipped = true;
                },
                "skill_id": "dl_han_useskill",
                "_priority": 0,
            },
            "dl_han_blocker": {
                charlotte: true,
                init: function(player, skill) {
                    player.addSkillBlocker(skill);
                },
                onremove: function(player, skill) {
                    player.removeSkillBlocker(skill);
                },
                skillBlocker: function(skill, player) {
                    var info = get.info(skill);
                    if (!info) return false;
                    if (skill == "dl_han" || skill == "dl_han_blocker" || skill.indexOf("dl_han_") == 0) return false;
                    if (info.charlotte || info.persevereSkill) return false;
                    return true;
                },
                "skill_id": "dl_han_blocker",
                "_priority": 0,
            },
            "dl_han_discard": {
                trigger: {
                    player: "phaseDiscardBegin",
                },
                forced: true,
                filter: function(event, player) {
                    return player.countMark("dl_han") > 0;
                },
                async content(event, trigger, player) {
                    var cards = player.getCards("he");
                    if (cards.length) {
                        await player.modedDiscard(cards);
                    }
                    // 弃牌阶段只移除一枚「寒」标记；归零才彻底失去寒，否则下回合继续生效
                    player.removeMark("dl_han", 1);
                    if (player.countMark("dl_han") <= 0) {
                        player.removeSkill("dl_han");
                    }
                },
                "skill_id": "dl_han_discard",
                "_priority": 0,
            },
            "dl_xiuluo": {
                audio: "ext:斗罗大陆:2",
                enable: "phaseUse",
                marktext: "瞳",
                intro: {
                    name: "修罗之瞳剩余次数",
                    content: "mark",
                },
                init: function(player) {
                    player.addMark("dl_xiuluo", 1);
                },
                filter: function(event, player) {
                    return player.countMark("dl_xiuluo") > 0;
                },
                content: function() {
                    'step 0'
                    player.chooseTarget([1, Infinity], "修罗之瞳：选择任意名其他角色", function(card, player, target) {
                        return target != player;
                    }, true).set("ai", function(target) {
                        return -get.attitude(_status.event.player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        event.targets = result.targets;
                        event.targets.sortBySeat();
                        event._index = 0;
                        player.removeMark("dl_xiuluo", 1);
                        player.logSkill("dl_xiuluo", event.targets);
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (event._index >= event.targets.length) {
                        player.addTempSkill("dl_xiuluo_buff", { player: "phaseBegin" });
                        event.finish();
                    } else {
                        event._target = event.targets[event._index];
                        if (event._target.isIn()) {
                            if (event._target.hp > 1) event._target.loseHp(event._target.hp - 1);
                            event._target.addSkill("dl_xiuluo_mark");
                        }
                    }
                    'step 3'
                    event._index++;
                    event.goto(2);
                },
                ai: {
                    order: 10,
                    result: {
                        player: function(player) {
                            return 1;
                        },
                    },
                },
                "skill_id": "dl_xiuluo",
                "_priority": 0,
            },
            "dl_xiuluo_mark": {
                charlotte: true,
                init: function(player, skill) {
                    player.addSkillBlocker(skill);
                },
                onremove: function(player, skill) {
                    player.removeSkillBlocker(skill);
                },
                skillBlocker: function(skill, player) {
                    var info = get.info(skill);
                    if (!info) return false;
                    if (info.charlotte || info.persevereSkill) return false;
                    if (skill.indexOf("dl_xiuluo") == 0 || skill.indexOf("dl_han") == 0) return false;
                    return !get.is.locked(skill, player);
                },
                trigger: {
                    player: "useCard2",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    if (!event.targets || !event.targets.length) return false;
                    return game.hasPlayer(function(c) {
                        return c != player && lib.filter.targetEnabled2(event.card, player, c);
                    });
                },
                content: function() {
                    var cands = game.filterPlayer(function(c) {
                        return c != player && lib.filter.targetEnabled2(trigger.card, player, c);
                    });
                    if (cands.length) {
                        var rand = cands[Math.floor(Math.random() * cands.length)];
                        trigger.targets.length = 0;
                        trigger.targets.add(rand);
                    }
                },
                "skill_id": "dl_xiuluo_mark",
                "_priority": 0,
            },
            "dl_xiuluo_buff": {
                charlotte: true,
                onremove: function(player) {
                    game.filterPlayer(function(c) {
                        if (c.hasSkill("dl_xiuluo_mark")) c.removeSkill("dl_xiuluo_mark");
                    });
                },
                "skill_id": "dl_xiuluo_buff",
                "_priority": 0,
            },
            "dl_bingdi": {
                audio: "ext:斗罗大陆:2",
                enable: "phaseUse",
                marktext: "冰",
                intro: {
                    name: "冰帝降临剩余次数",
                    content: "mark",
                },
                init: function(player) {
                    player.addMark("dl_bingdi", 1);
                },
                filter: function(event, player) {
                    return player.countMark("dl_bingdi") > 0;
                },
                content: function() {
                    'step 0'
                    player.chooseTarget([0, Infinity], "冰帝降临：选择任意名角色获得「寒」标记（可不选）", false).set("ai", function(target) {
                        return -get.attitude(_status.event.player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        event.targets = result.targets || [];
                        event.targets.sortBySeat();
                        event._index = 0;
                        player.removeMark("dl_bingdi", 1);
                        player.logSkill("dl_bingdi");
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (event._index >= event.targets.length) {
                        player.changeHujia(5);
                        player.addTempSkill("dl_bingdi_dmg", { player: "phaseBegin" });
                        event.finish();
                    } else {
                        event._target = event.targets[event._index];
                        if (event._target.isIn()) {
                            event._target.addSkill("dl_han");
                            if (!event._target.countMark("dl_han")) event._target.addMark("dl_han", 1);
                        }
                    }
                    'step 3'
                    event._index++;
                    event.goto(2);
                },
                ai: {
                    order: 9,
                    result: {
                        player: function(player) {
                            return 1;
                        },
                    },
                },
                "skill_id": "dl_bingdi",
                "_priority": 0,
            },
            "dl_bingdi_dmg": {
                charlotte: true,
                forced: true,
                trigger: {
                    source: "damageBegin1",
                },
                filter: function(event, player) {
                    return event.player != player;
                },
                content: function() {
                    trigger.num++;
                },
                ai: {
                    damageBonus: true,
                },
                "skill_id": "dl_bingdi_dmg",
                "_priority": 0,
            },
        },
        translate: {
            "dl_lingmou": "灵眸",
            "dl_lingmou_info": "武魂技，①其他角色的手牌和牌堆顶的五张牌始终对你可见；②游戏开始时，你观看其他角色的身份牌和暗置的武将牌（若有）；③出牌阶段限一次，你可以选择一名其他角色，其获得【灵眸】①的效果直到你的下个出牌阶段开始。",
            "dl_lingmou_start": "灵眸",
            "dl_lingmou_clear": "灵眸",
            "dl_lingmou_grant": "灵眸",
            "dl_lingmou_grant_info": "其他角色的手牌对你可见，且你可以随时观看牌堆顶的五张牌。",
            "dl_bingxie": "冰蝎",
            "dl_bingxie_info": "武魂技，你免疫火焰伤害；当你对一名角色造成伤害后，你可以令其获得一枚「寒」标记（可叠加）。有「寒」的角色跳过判定和摸牌阶段；其出牌阶段使用任意牌或发动任意技能后，其所有技能失效（包括锁定技），随后立即结束出牌阶段；弃牌阶段，其弃置所有牌并移除一枚「寒」标记，标记归零时失去「寒」。",
            "dl_han": "寒",
            "dl_han_info": "跳过判定和摸牌阶段；出牌阶段使用牌或技能后，所有技能失效并结束出牌阶段；弃牌阶段，弃置所有牌并移除一枚「寒」标记，标记归零时失去「寒」（可叠加）。",
            "dl_xiuluo": "修罗之瞳",
            "dl_xiuluo_info": "武魂真身，每局游戏限一次，出牌阶段，你可以选择任意名其他角色，令其所有非锁定技失效、体力值失去至1点，且其使用牌时随机指定目标，直到你的下回合开始。",
            "dl_xiuluo_mark": "修罗",
            "dl_xiuluo_mark_info": "非锁定技失效，且使用牌时随机指定目标。",
            "dl_xiuluo_buff": "修罗",
            "dl_xiuluo_buff_info": "",
            "dl_bingdi": "冰帝降临",
            "dl_bingdi_info": "武魂真身，每局游戏限一次，出牌阶段，你可以选择任意名角色令其获得「寒」标记，随后你获得5点护甲，且你造成的伤害+1，直到你的下回合开始。",
            "dl_bingdi_dmg": "冰帝",
            "dl_bingdi_dmg_info": "你造成的伤害+1。",
        },
    },
    intro: "",
    author: "nihility",
    diskURL: "",
    forumURL: "",
    version: "1.2",
},files:{"character":["dl_huoyuhao.jpg"],"card":[],"skill":[],"audio":[]}} 
};