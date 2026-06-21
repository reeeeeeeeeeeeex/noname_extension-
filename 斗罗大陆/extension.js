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
                dl_huoyuhao: {
                    sex: "male",
                    group: "shen",
                    hp: 4,
                    maxHp: 4,
                    skills: ["dl_lingmou","dl_bingxie"],
                    img: "extension/斗罗大陆/dl_huoyuhao.jpg",
                    hujia: 0,
                },
            },
            characterTitle: {
                dl_huoyuhao: "灵冰斗罗",
            },
            translate: {
                dl_huoyuhao: "霍雨浩",
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
                dl_lingmou: {
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
                dl_lingmou_start: {
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
                dl_lingmou_clear: {
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
                dl_lingmou_grant: {
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
                dl_bingxie: {
                    audio: "ext:斗罗大陆:2",
                    group: ["dl_bingxie_fire","dl_bingxie_han"],
                    "skill_id": "dl_bingxie",
                    "_priority": 0,
                },
                dl_bingxie_fire: {
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
                dl_bingxie_han: {
                    trigger: {
                        source: "damageEnd",
                    },
                    direct: true,
                    filter: function(event, player) {
                        return event.player && event.player.isIn() && event.player != player;
                    },
                    content: function() {
                        'step 0'
                        player.chooseBool(get.prompt("dl_bingxie", trigger.player), "令其获得一枚“寒”标记？").set("ai", function() {
                            return get.attitude(player, trigger.player) < 0;
                        });
                        'step 1'
                        if (result.bool) {
                            player.logSkill("dl_bingxie", trigger.player);
                            trigger.player.addSkill("dl_han");
                            if (!trigger.player.countMark("dl_han")) trigger.player.addMark("dl_han", 1);
                        }
                    },
                    "skill_id": "dl_bingxie_han",
                    "_priority": 0,
                },
                dl_han: {
                    charlotte: true,
                    mark: true,
                    marktext: "寒",
                    intro: {
                        content: "跳过判定阶段和摸牌阶段；出牌阶段使用牌或发动技能后，所有技能失效并结束出牌阶段；弃牌阶段开始时，弃置所有手牌和装备区里的牌，然后失去“寒”。",
                    },
                    group: ["dl_han_skip","dl_han_usecard","dl_han_useskill","dl_han_discard"],
                    onremove: function(player) {
                        player.removeSkill("dl_han_blocker");
                        delete player.storage.dl_han_triggered;
                    },
                    "skill_id": "dl_han",
                    "_priority": 0,
                },
                dl_han_skip: {
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
                    },
                    "skill_id": "dl_han_skip",
                    "_priority": 0,
                },
                dl_han_usecard: {
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
                dl_han_useskill: {
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
                dl_han_blocker: {
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
                dl_han_discard: {
                    trigger: {
                        player: "phaseDiscardBegin",
                    },
                    forced: true,
                    filter: function(event, player) {
                        return player.countMark("dl_han") > 0;
                    },
                    content: function() {
                        'step 0'
                        var cards = player.getCards("he");
                        if (cards.length) {
                            player.modedDiscard(cards);
                        }
                        'step 1'
                        player.clearMark("dl_han");
                        player.removeSkill("dl_han");
                    },
                    "skill_id": "dl_han_discard",
                    "_priority": 0,
                },
            },
            translate: {
                dl_lingmou: "灵眸",
                "dl_lingmou_info": "锁定技，其他角色的手牌对你可见，且你可以随时观看牌堆顶的五张牌。游戏开始时，你观看其他角色的身份牌和暗置的武将牌。出牌阶段限一次，你可以选择一名其他角色，其获得上述可见效果直到你的下个出牌阶段开始。",
                dl_lingmou_start: "灵眸",
                dl_lingmou_clear: "灵眸",
                dl_lingmou_grant: "灵眸",
                "dl_lingmou_grant_info": "其他角色的手牌对你可见，且你可以随时观看牌堆顶的五张牌。",
                dl_bingxie: "冰蝎",
                "dl_bingxie_info": "你防止即将受到的火焰伤害。当你对其他角色造成伤害后，你可以令其获得一枚“寒”标记。有“寒”的角色跳过判定阶段和摸牌阶段；其出牌阶段使用牌或发动技能后，其所有技能失效，包括锁定技，然后结束出牌阶段；弃牌阶段开始时，其弃置所有手牌和装备区里的牌，然后失去“寒”。",
                dl_han: "寒",
                "dl_han_info": "跳过判定阶段和摸牌阶段；出牌阶段使用牌或发动技能后，所有技能失效并结束出牌阶段；弃牌阶段开始时，弃置所有手牌和装备区里的牌，然后失去“寒”。",
            },
        },
        intro: "",
        author: "nihility",
        diskURL: "",
        forumURL: "",
        version: "1.0",
    },files:{"character":["dl_huoyuhao.jpg"],"card":[],"skill":[],"audio":[]}}
};
