import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(){
	return {name:"原神拓展",editable:true,connect:false,arenaReady:function(){

},content:function(config,pack){

},prepare:function(){
		game.addGroup("liyue", "璃月", "璃月势力", { color: "#FFB443" });
		game.addGroup("lvren", "旅者", "旅者势力", { color: "#F5E6C8" });
	},precontent:function(){

},help:{},config:{},package:{
    character: {
        character: {
            "shen_xiao": {
                sex: "male",
                group: "liyue",
                hp: 3,
                maxHp: 4,
                skills: ["xianti","chumo","nuowu","shenyou","yezhang"],
                img: "extension/原神拓展/shen_xiao.jpg",
                hujia: 0,
                dieAudios: ["ext:原神拓展/audio/die/shen_xiao.mp3"],
            },
            hutao: {
                sex: "female",
                group: "liyue",
                hp: 5,
                maxHp: 5,
                skills: ["dieyin","xuehuo","anmi","sangzang"],
                img: "extension/原神拓展/hutao.jpg",
                hujia: 0,
                dieAudios: ["ext:原神拓展/audio/die/hutao.mp3"],
            },
            zhongli: {
                sex: "male",
                group: "liyue",
                hp: 5,
                maxHp: 5,
                skills: ["yanzhang","zhongli_tianxing","bingxu"],
                img: "extension/原神拓展/zhongli.jpg",
                hujia: 0,
                dieAudios: ["ext:原神拓展/audio/die/zhongli.mp3"],
            },
            "ying_gs": {
                sex: "female",
                group: "lvren",
                hp: 4,
                maxHp: 4,
                skills: ["ying_yuansu","ying_renjieli","ying_shenyuan"],
                img: "extension/原神拓展/ying_gs.jpg",
                hujia: 0,
                dieAudios: ["ext:原神拓展/audio/die/ying_gs.mp3"],
            },
            qiuqiuren: {
                sex: "none",
                group: "qun",
                hp: 4,
                maxHp: 4,
                skills: [],
                img: "extension/原神拓展/qiuqiuren.jpg",
                hujia: 0,
            },
        },
        characterTitle: {
            "shen_xiao": "护法夜叉",
            hutao: "雪霁梅香",
            zhongli: "尘世闲游",
            "ying_gs": "人之子",
        },
        translate: {
            "shen_xiao": "魈",
            hutao: "胡桃",
            zhongli: "钟离",
            "ying_gs": "荧",
            qiuqiuren: "丘丘人",
            xianti: "仙体",
            dieyin: "蝶引",
            xuehuo: "血火",
            anmi: "安神秘法",
            sangzang: "丧葬",
            chumo: "除魔",
            nuowu: "傩舞",
            shenyou: "神佑",
            dongqing: "动情",
            yezhang: "业障",
            yanzhang: "岩障",
            "zhongli_tianxing": "天星",
            bingxu: "并蓄",
            shihua: "石化",
            "group_liyue": "璃月",
            "group_liyue_bg": "璃",
            liyueColor: "#FFB443",
            liyue: "璃月",
            "group_lvren": "旅者",
            "group_lvren_bg": "旅",
            lvrenColor: "#F5E6C8",
            lvren: "旅者",
            "原神拓展": "原神拓展",
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
            chumo: {
                audio: "ext:原神拓展:2",
                trigger: {
                    source: "damageBegin",
                },
                filter: function(event, player) {
                    return event.player != player;
                },
                direct: true,
                init: function(player) {
                    player.addSkill('chumo_trick');
                },
                onremove: function(player) {
                    player.removeSkill('chumo_trick');
                },
                content: function() {
                    'step 0'
                    player.chooseBool('是否发动【除魔】令伤害+1？').set('ai', function() { return true; });
                    'step 1'
                    if (result.bool) {
                        trigger.num++;
                        player.logSkill('chumo');
                    }
                },
                ai: {
                    threaten: 1.5,
                },
                "skill_id": "chumo",
                "_priority": 0,
            },
            "chumo_trick": {
                trigger: {
                    player: "useCardAfter",
                },
                direct: true,
                filter: function(event, player) {
                    if (player.storage.chumo_locked) return false;
                    if (event.card.name == 'wuxie') return false;
                    return get.type(event.card) == 'trick';
                },
                content: function() {
                    'step 0'
                    player.chooseBool('是否发动【除魔】令' + get.translation(trigger.card.name) + '额外结算一次？').set('ai', function() { return true; });
                    'step 1'
                    if (result.bool) {
                        player.storage.chumo_locked = true;
                        player.logSkill('chumo');
                        player.chooseUseTarget({name: trigger.card.name, isCard: true}, false, 'nodistance');
                    }
                    'step 2'
                    delete player.storage.chumo_locked;
                },
                "skill_id": "chumo_trick",
                "_priority": 0,
            },
            nuowu: {
                audio: "ext:原神拓展:2",
                enable: "phaseUse",
                usable: 1,
                filter: function(event, player) {
                    return player.hp > 0;
                },
                content: function() {
                    'step 0'
                    player.loseHp(1);
                    'step 1'
                    player.draw(5);
                    player.gainMaxHp(1);
                    player.addTempSkill('nuowu_buff', {player: 'phaseBegin'});
                    player.logSkill('nuowu');
                },
                ai: {
                    order: 10,
                    result: {
                        player: 1,
                    },
                },
                "skill_id": "nuowu",
                "_priority": 0,
            },
            "nuowu_buff": {
                group: ["nuowu_buff_damage","nuowu_buff_hit","nuowu_buff_range","nuowu_buff_end"],
                mod: {
                    targetInRange: function(card, player, target) {
                        return true;
                    },
                },
                ai: {
                    threaten: 2,
                },
                "skill_id": "nuowu_buff",
                "_priority": 0,
            },
            "nuowu_buff_damage": {
                trigger: {
                    player: "damageBegin",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.num > 0;
                },
                content: function() {
                    trigger.num--;
                },
                ai: {
                    damageBonus: false,
                },
                "skill_id": "nuowu_buff_damage",
                "_priority": 0,
            },
            "nuowu_buff_hit": {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                popup: false,
                content: function() {
                    trigger.directHit.addArray(
                        game.filterPlayer(function(current) {
                            return current != player;
                        })
                    );
                },
                ai: {
                    "directHit_ai": true,
                },
                "skill_id": "nuowu_buff_hit",
                "_priority": 0,
            },
            "nuowu_buff_range": {
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.card.name == 'sha';
                },
                content: function() {
                    var stat = player.getStat();
                    if (stat && stat.card && stat.card.sha >= 0) {
                        stat.card.sha--;
                    }
                },
                "skill_id": "nuowu_buff_range",
                "_priority": 0,
            },
            "nuowu_buff_end": {
                trigger: {
                    global: "phaseJieshuBegin",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return player.hp > 1;
                },
                content: function() {
                    player.loseHp(1);
                    player.gainMaxHp(1);
                },
                "skill_id": "nuowu_buff_end",
                "_priority": 0,
            },
            shenyou: {
                audio: "ext:原神拓展:2",
                limited: true,
                mark: true,
                trigger: {
                    player: "dyingBegin",
                },
                content: function() {
                    'step 0'
                    player.recover(player.maxHp - player.hp);
                    player.chooseTarget('请选择【动情】的目标', true).set('ai', function(target) {
                        return get.attitude(player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        player.storage.dongqing_target = result.targets[0];
                        player.removeSkill('yezhang');
                        player.addSkill('dongqing');
                    }
                    player.awakenSkill('shenyou');
                    player.logSkill('shenyou');
                },
                ai: {
                    order: 0.1,
                    result: {
                        player: 1,
                    },
                },
                intro: {
                    content: "limited",
                },
                skillAnimation: true,
                init: function(player, skill) { player.storage[skill] = false; },
                "skill_id": "shenyou",
                "_priority": 0,
            },
            dongqing: {
                forced: true,
                popup: false,
                group: ["dongqing_gain","dongqing_die","dongqing_gain_reset"],
                init: function(player) {
                    player.addSkill('dongqing_damage');
                    player.addSkill('dongqing_lose');
                },
                onremove: function(player) {
                    player.removeSkill('dongqing_damage');
                    player.removeSkill('dongqing_lose');
                    delete player.storage.dongqing_target;
                    delete player.storage.dongqing_g1;
                    delete player.storage.dongqing_g2;
                    delete player.storage.dongqing_lose_used;
                },
                "skill_id": "dongqing",
                "_priority": 0,
            },
            "dongqing_gain": {
                trigger: {
                    global: "gainAfter",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    var t = player.storage.dongqing_target;
                    if (!t) return false;
                    if (event.player == t && !player.storage.dongqing_g1) return true;
                    if (event.player == player && !player.storage.dongqing_g2) return true;
                    return false;
                },
                content: function() {
                    var count = trigger.cards.length;
                    if (trigger.player == player.storage.dongqing_target) {
                        player.storage.dongqing_g1 = true;
                        player.directgain(get.cards(count));
                    } else {
                        player.storage.dongqing_g2 = true;
                        player.storage.dongqing_target.directgain(get.cards(count));
                    }
                    player.logSkill('dongqing');
                },
                "skill_id": "dongqing_gain",
                "_priority": 0,
            },
            "dongqing_gain_reset": {
                trigger: {
                    global: "phaseJieshuBegin",
                },
                forced: true,
                popup: false,
                content: function() {
                    delete player.storage.dongqing_g1;
                    delete player.storage.dongqing_g2;
                },
                "skill_id": "dongqing_gain_reset",
                "_priority": 0,
            },
            "dongqing_damage": {
                trigger: {
                    global: "damageBegin",
                },
                filter: function(event, player) {
                    var t = player.storage.dongqing_target;
                    return t && event.player == t && event.num > 0 && player.isAlive();
                },
                content: function() {
                    'step 0'
                    player.chooseBool('是否发动【动情】代替' + get.translation(trigger.player) + '承受伤害？').set('ai', function() { return true; });
                    'step 1'
                    if (result.bool) {
                        var _dmg = trigger.num;
                        var _src = trigger.source;
                        trigger.cancel();
                        player.logSkill('dongqing');
                        player.damage(_dmg);
                        if (_src && _src.isIn() && _src != player) {
                            _src.damage(_dmg);
                        }
                    }
                },
                "skill_id": "dongqing_damage",
                "_priority": 0,
            },
            "dongqing_lose": {
                trigger: {
                    global: "loseAfter",
                },
                filter: function(event, player) {
                    if (player.storage.dongqing_lose_used == game.roundNumber) return false;
                    var t = player.storage.dongqing_target;
                    return t && event.player == t && event.hs && event.hs.length > 0;
                },
                content: function() {
                    'step 0'
                    event._loseCount = trigger.hs.length;
                    player.chooseBool('是否发动【动情】令' + get.translation(trigger.player) + '摸' + event._loseCount + '张牌？').set('ai', function() { return true; });
                    'step 1'
                    if (result.bool) {
                        player.storage.dongqing_lose_used = game.roundNumber;
                        trigger.player.draw(event._loseCount);
                        player.logSkill('dongqing');
                    }
                },
                "skill_id": "dongqing_lose",
                "_priority": 0,
            },
            "dongqing_die": {
                trigger: {
                    global: "dieAfter",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    var t = player.storage.dongqing_target;
                    return t && event.player == t;
                },
                content: function() {
                    player.lose(player.getCards('he'), true);
                    player.removeSkill('dongqing');
                },
                "skill_id": "dongqing_die",
                "_priority": 0,
            },
            yezhang: {
                audio: "ext:原神拓展:2",
                forced: true,
                trigger: {
                    global: "dieAfter",
                },
                intro: {
                    content: "mark",
                },
                filter: function(event, player) {
                    return event.source == player;
                },
                content: function() {
                    'step 0'
                    player.loseMaxHp(1);
                    'step 1'
                    player.addMark("yezhang", 1);
                    if (player.countMark("yezhang") >= 2) {
                        event._hasMusic = game.hasPlayer(function(current) {
                            if (!current.isAlive()) return false;
                            var text = get.translation(current.name);
                            var skills = current.getSkills();
                            for (var i = 0; i < skills.length; i++) {
                                text += get.translation(skills[i]);
                            }
                            var keys = '琴笙歌音笛箫律筝弦';
                            for (var j = 0; j < keys.length; j++) {
                                if (text.indexOf(keys[j]) !== -1) return true;
                            }
                            return false;
                        });
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (event._hasMusic) {
                        player.recover(player.maxHp - player.hp);
                        player.removeMark("yezhang", player.countMark("yezhang"));
                    } else {
                        player.loseHp(player.hp);
                    }
                },
                "skill_id": "yezhang",
                "_priority": 0,
            },
            dieyin: {
                audio: "ext:原神拓展:2",
                enable: "phaseUse",
                filter: function(event, player) {
                    return Math.floor(player.hp / 2) > 0;
                },
                content: function() {
                    'step 0'
                    player.loseHp(Math.floor(player.hp / 2));
                    'step 1'
                    player.addTempSkill('dieyin_effect', {player: 'phaseAfter'});
                    if (!player.storage.dieyin_count) player.storage.dieyin_count = 0;
                    player.storage.dieyin_count++;
                    player.logSkill('dieyin');
                },
                ai: {
                    order: 5,
                    result: {
                        player: function(player) {
                            return player.hp >= 4 ? 1 : 0;
                        },
                    },
                },
                "skill_id": "dieyin",
                "_priority": 0,
            },
            sangzang: {
                audio: "ext:原神拓展:2",
                trigger: {
                    global: "dyingBegin",
                },
                frequent: true,
                filter: function(event, player) {
                    return event.player.isAlive();
                },
                content: function() {
                    'step 0'
                    player.chooseBool('是否发动【丧葬】火化' + get.translation(trigger.player) + '？').set('ai', function() {
                        return get.attitude(player, trigger.player) < 0 ? 1 : 0;
                    });
                    'step 1'
                    if (result.bool) {
                        trigger.player.die();
                        player.logSkill('sangzang');
                    } else {
                        player.addMark("anmi", 1);
                        player.logSkill('sangzang');
                    }
                },
                "skill_id": "sangzang",
                "_priority": 0,
            },
            anmi: {
                audio: "ext:原神拓展:2",
                trigger: {
                    player: "phaseJieshuBegin",
                },
                marktext: "秘",
                intro: {
                    name: "安神秘法剩余次数",
                    content: "mark",
                },
                init: function(player) {
                    player.addMark("anmi", 1);
                },
                filter: function(event, player) {
                    return player.countMark("anmi") > 0;
                },
                content: function() {
                    'step 0'
                    player.chooseTarget([1, 5], '安神秘法：对至多5名角色各造成1点火焰伤害', true).set('ai', function(target) {
                        return get.damageEffect(target, player, player, 'fire');
                    });
                    'step 1'
                    if (result.bool) {
                        event._targets = result.targets;
                        event._targets.sortBySeat();
                        for (var i = 0; i < event._targets.length; i++) {
                            event._targets[i].damage(1, 'fire');
                        }
                        player.recover(event._targets.length);
                    }
                    player.removeMark("anmi", 1);
                    player.logSkill('anmi');
                },
                ai: {
                    order: 1,
                    result: {
                        player: function(player) {
                            return game.hasPlayer(function(target) {
                                return get.damageEffect(target, player, player, 'fire') > 0;
                            }) ? 1 : 0;
                        },
                    },
                },
                "skill_id": "anmi",
                "_priority": 0,
            },
            xuehuo: {
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return player.hp <= Math.ceil(player.maxHp / 2);
                },
                content: function() {
                    player.logSkill('xuehuo');
                    trigger.num++;
                },
                ai: {
                    damageBonus: true,
                },
                "skill_id": "xuehuo",
                "_priority": 0,
            },
            "dieyin_effect": {
                mod: {
                    cardnature: function(card, player) {
                        if (card.name == 'sha') return 'fire';
                    },
                },
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                popup: false,
                content: function() {
                    trigger.num += player.storage.dieyin_count;
                },
                onremove: function(player) {
                    delete player.storage.dieyin_count;
                },
                ai: {
                    damageBonus: true,
                },
                "skill_id": "dieyin_effect",
                "_priority": 0,
            },
            xianti: {
                audio: "ext:原神拓展:2",
                forced: true,
                trigger: {
                    player: "phaseDrawBegin2",
                },
                filter: function(event, player) {
                    return !event.numFixed;
                },
                content: function() {
                    trigger.num += 3;
                },
                mod: {
                    maxHandcard: function(player, num) {
                        return player.maxHp + 2;
                    },
                },
                ai: {
                    threaten: 1.2,
                },
                "skill_id": "xianti",
                "_priority": 0,
            },
            yanzhang: {
                audio: "ext:原神拓展:2",
                enable: "phaseUse",
                usable: 1,
                onuse: function(result, player) {
                    player.storage.bingxu_count = 0;
                },
                selectTarget: [1,Infinity],
                filterTarget: function(card, player, target) {
                    return get.distance(player, target) == 1;
                },
                multiline: true,
                content: function() {
                    'step 0'
                    if (!event.targets || !event.targets.length) {
                        event.finish();
                    } else {
                        event.targets.sortBySeat();
                        event._index = 0;
                        player.changeHujia(3);
                    }
                    'step 1'
                    if (event._index >= event.targets.length) {
                        event.finish();
                    } else {
                        event.targets[event._index].damage(1);
                    }
                    'step 2'
                    event._index++;
                    event.goto(1);
                },
                ai: {
                    order: 8,
                    result: {
                        target: function(player, target) {
                            return get.damageEffect(target, player, player);
                        },
                        player: 1,
                    },
                },
                "skill_id": "yanzhang",
                "_priority": 0,
            },
            "zhongli_tianxing": {
                audio: "ext:原神拓展:2",
                enable: "phaseUse",
                limited: true,
                mark: true,
                skillAnimation: true,
                init: function(player, skill) {
                    player.storage[skill] = false;
                },
                filter: function(event, player) {
                    return !player.storage.zhongli_tianxing;
                },
                content: function() {
                    'step 0'
                    player.chooseTarget([1, Infinity], '天星：请选择任意名角色', true).set('ai', function(target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 1'
                    if (result.bool) {
                        event.targets = result.targets;
                        event.targets.sortBySeat();
                        event._index = 0;
                        player.awakenSkill('zhongli_tianxing');
                        player.logSkill('zhongli_tianxing', event.targets);
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (event._index >= event.targets.length) {
                        event.finish();
                    } else {
                        event._target = event.targets[event._index];
                        if (event._target.isIn()) {
                            event._target.addSkill('shihua');
                        }
                        event._target.damage(3);
                    }
                    'step 3'
                    event._index++;
                    event.goto(2);
                },
                ai: {
                    order: 10,
                    result: {
                        player: function(player) {
                            return game.hasPlayer(function(target) {
                                return get.damageEffect(target, player, player) > 0;
                            }) ? 1 : 0;
                        },
                    },
                },
                intro: {
                    content: "limited",
                },
                "skill_id": "zhongli_tianxing",
                "_priority": 0,
            },
            bingxu: {
                audio: "ext:原神拓展:2",
                trigger: {
                    player: "phaseJieshuBegin",
                },
                direct: true,
                init: function(player) {
                    player.storage.bingxu_count = 0;
                },
                filter: function(event, player) {
                    return player.storage.bingxu_count >= 2 && player.awakenedSkills && player.awakenedSkills.includes("zhongli_tianxing");
                },
                content: function() {
                    'step 0'
                    player.chooseBool(get.prompt("bingxu"), "重置你的限定技【天星】").set("ai", function() {
                        return true;
                    });
                    'step 1'
                    if (result.bool) {
                        player.storage.bingxu_count = 0;
                        player.logSkill("bingxu");
                        player.restoreSkill("zhongli_tianxing");
                    }
                },
                group: "bingxu_count",
                "skill_id": "bingxu",
                "_priority": 0,
            },
            "bingxu_count": {
                trigger: {
                    player: "phaseJieshuBegin",
                },
                forced: true,
                popup: false,
                firstDo: true,
                filter: function(event, player) {
                    return player.getHistory("useSkill", function(evt) {
                        return evt.skill == "yanzhang";
                    }).length == 0;
                },
                content: function() {
                    player.storage.bingxu_count = Math.min(2, (player.storage.bingxu_count || 0) + 1);
                },
                "skill_id": "bingxu_count",
                "_priority": 1,
            },
            shihua: {
                charlotte: true,
                mark: true,
                marktext: "石",
                trigger: {
                    player: "phaseBefore",
                },
                forced: true,
                popup: false,
                init: function(player, skill) {
                    player.addSkillBlocker(skill);
                    player.addTip(skill, "石化：非锁定技失效；回合开始前跳过整个回合");
                },
                onremove: function(player, skill) {
                    player.removeSkillBlocker(skill);
                    player.removeTip(skill);
                },
                skillBlocker: function(skill, player) {
                    var info = get.info(skill);
                    return info && !info.persevereSkill && !info.charlotte && !get.is.locked(skill, player);
                },
                intro: {
                    content: function(storage, player, skill) {
                        var list = player.getSkills(null, false, false).filter(function(i) {
                            return lib.skill.shihua.skillBlocker(i, player);
                        });
                        if (list.length) {
                            return "失效技能：" + get.translation(list) + "；回合开始前跳过整个回合，然后解除。";
                        }
                        return "非锁定技失效；回合开始前跳过整个回合，然后解除。";
                    },
                },
                content: function() {
                    trigger.cancel();
                    player.removeSkill('shihua');
                },
                "skill_id": "shihua",
                "_priority": 0,
            },
            "ying_yuansu": {
                audio: "ext:原神拓展:2",
                trigger: {
                    source: "damageBegin",
                },
                direct: true,
                filter: function(event, player) {
                    if (player._ying_yuansu_ing) return false;
                    return event.player && event.player.isIn() && event.num > 0;
                },
                content: function() {
                    'step 0'
                    player.chooseControl("水", "火", "风", "雷", "草", "冰", "岩").set("prompt", "元素：选择一种元素").set("ai", function() {
                        return 0;
                    });
                    'step 1'
                    var choice = result.control;
                    event.choice = choice;
                    if (choice == "水") {
                        trigger.cancel();
                        trigger.player.recover(trigger.num);
                        player.logSkill("ying_yuansu", trigger.player);
                    } else if (choice == "火") {
                        trigger.nature = "fire";
                        trigger.player.addMark("ying_huoyin", 1);
                        player.logSkill("ying_yuansu", trigger.player);
                    } else if (choice == "风") {
                        player.chooseTarget("风：选择一名角色，将" + get.translation(trigger.player) + "插入到该角色之后", true).set("ai", function(target) {
                            return 0;
                        });
                    } else if (choice == "雷") {
                        player._ying_yuansu_ing = true;
                        trigger.cancel();
                        trigger.player.damage(trigger.num * 2, "thunder");
                        player.logSkill("ying_yuansu", trigger.player);
                    } else if (choice == "草") {
                        trigger.player.addMark("ying_baozi", 1);
                        player.logSkill("ying_yuansu", trigger.player);
                    } else if (choice == "冰") {
                        trigger.player.addSkill("ying_han");
                        if (!trigger.player.countMark("ying_han")) trigger.player.addMark("ying_han", 1);
                        player.logSkill("ying_yuansu", trigger.player);
                    } else if (choice == "岩") {
                        if (trigger.player.hujia > 0) trigger.player.changeHujia(-trigger.player.hujia);
                        var eq = trigger.player.getCards("e");
                        if (eq.length) trigger.player.discard(eq);
                        player.logSkill("ying_yuansu", trigger.player);
                    }
                    'step 2'
                    if (event.choice == "风") {
                        if (result.bool && result.targets && result.targets.length) {
                            var insertAfter = result.targets[0];
                            game.swapSeat(trigger.player, insertAfter.next, false, true);
                        }
                    }
                    player._ying_yuansu_ing = false;
                },
                group: ["ying_yuansu_huoyin","ying_yuansu_baozi","ying_yuansu_baozi_clear"],
                "skill_id": "ying_yuansu",
                "_priority": 0,
            },
            "ying_yuansu_huoyin": {
                trigger: {
                    global: "phaseBefore",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.player.hasMark("ying_huoyin") && event.player.isIn();
                },
                content: function() {
                    var count = trigger.player.countMark("ying_huoyin");
                    if (count > 0) {
                        trigger.player.damage({ num: count, nature: "fire" });
                        trigger.player.removeMark("ying_huoyin", count);
                    }
                },
                "skill_id": "ying_yuansu_huoyin",
                "_priority": 0,
            },
            "ying_yuansu_baozi": {
                trigger: {
                    global: "roundEnd",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return game.hasPlayer(function(current) {
                        return current.hasMark("ying_baozi");
                    });
                },
                content: function() {
                    game.filterPlayer(function(current) {
                        return current.hasMark("ying_baozi") && current.isIn();
                    }).forEach(function(target) {
                        target.loseMaxHp(1);
                    });
                },
                "skill_id": "ying_yuansu_baozi",
                "_priority": 0,
            },
            "ying_yuansu_baozi_clear": {
                trigger: {
                    global: "damageEnd",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    if (!event.hasNature("fire")) return false;
                    if (!event.player.hasMark("ying_baozi")) return false;
                    return event.getParent().name != "ying_yuansu_huoyin";
                },
                content: function() {
                    trigger.player.removeMark("ying_baozi", trigger.player.countMark("ying_baozi"));
                },
                "skill_id": "ying_yuansu_baozi_clear",
                "_priority": 0,
            },
            "ying_huoyin": {
                mark: true,
                marktext: "火",
                intro: {
                    name: "火标记",
                    content: "mark",
                },
                "skill_id": "ying_huoyin",
                "_priority": 0,
            },
            "ying_baozi": {
                mark: true,
                marktext: "孢",
                intro: {
                    content: "每轮结束时减1点体力上限；受到火焰伤害后清除",
                },
                "skill_id": "ying_baozi",
                "_priority": 0,
            },
            "ying_han": {
                charlotte: true,
                mark: true,
                marktext: "寒",
                intro: {
                    content: "跳过判定阶段和摸牌阶段；出牌阶段使用牌或发动技能后，所有技能失效并结束出牌阶段；弃牌阶段开始时，弃置所有手牌和装备区里的牌，然后失去“寒”。",
                },
                group: ["ying_han_skip","ying_han_usecard","ying_han_useskill","ying_han_discard"],
                onremove: function(player) {
                    player.removeSkill("ying_han_blocker");
                    delete player.storage.ying_han_triggered;
                },
                "skill_id": "ying_han",
                "_priority": 0,
            },
            "ying_han_skip": {
                trigger: {
                    player: "phaseBegin",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return player.countMark("ying_han") > 0;
                },
                content: function() {
                    player.skip("phaseJudge");
                    player.skip("phaseDraw");
                },
                "skill_id": "ying_han_skip",
                "_priority": 0,
            },
            "ying_han_usecard": {
                trigger: {
                    player: "useCardAfter",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return player.countMark("ying_han") > 0 && !player.storage.ying_han_triggered && _status.currentPhase == player && player.isPhaseUsing();
                },
                content: function() {
                    player.storage.ying_han_triggered = true;
                    player.addSkill("ying_han_blocker");
                    var evt = _status.event.getParent("phaseUse");
                    if (evt && evt.name == "phaseUse") evt.skipped = true;
                },
                "skill_id": "ying_han_usecard",
                "_priority": 0,
            },
            "ying_han_useskill": {
                trigger: {
                    player: "useSkillAfter",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    if (player.countMark("ying_han") <= 0 || player.storage.ying_han_triggered || _status.currentPhase != player || !player.isPhaseUsing()) return false;
                    if (event.skill && event.skill.indexOf("ying_han") == 0) return false;
                    return true;
                },
                content: function() {
                    player.storage.ying_han_triggered = true;
                    player.addSkill("ying_han_blocker");
                    var evt = _status.event.getParent("phaseUse");
                    if (evt && evt.name == "phaseUse") evt.skipped = true;
                },
                "skill_id": "ying_han_useskill",
                "_priority": 0,
            },
            "ying_han_blocker": {
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
                    if (skill == "ying_han" || skill == "ying_han_blocker" || skill.indexOf("ying_han_") == 0) return false;
                    if (info.charlotte || info.persevereSkill) return false;
                    return true;
                },
                "skill_id": "ying_han_blocker",
                "_priority": 0,
            },
            "ying_han_discard": {
                trigger: {
                    player: "phaseDiscardBegin",
                },
                forced: true,
                filter: function(event, player) {
                    return player.countMark("ying_han") > 0;
                },
                content: function() {
                    "step 0"
                    var cards = player.getCards("he");
                    if (cards.length) {
                        player.modedDiscard(cards);
                    }
                    "step 1"
                    player.clearMark("ying_han");
                    player.removeSkill("ying_han");
                },
                "skill_id": "ying_han_discard",
                "_priority": 0,
            },
            "ying_renjieli": {
                audio: "ext:原神拓展:2",
                trigger: {
                    player: "phaseBefore",
                },
                direct: true,
                content: function() {
                    "step 0"
                    var dialog = ui.create.characterDialog("heightset", function(name) {
                        if (!lib.character[name] || !lib.character[name].skills || !lib.character[name].skills.length) return true;
                        if (name == "ying_gs" || name == "qiuqiuren") return true;
                        return false;
                    });
                    player.chooseButton(dialog, true).set("prompt", "人界力：请选择一名武将").set("ai", function(button) {
                        return 1;
                    });
                    "step 1"
                    if (!result.bool || !result.links || !result.links.length) {
                        event.finish();
                        return;
                    }
                    var charName = result.links[0];
                    var skills = lib.character[charName].skills || [];
                    if (!skills.length) {
                        event.finish();
                        return;
                    }
                    var skillNames = skills.map(function(s) { return get.translation(s) || s; });
                    player.chooseControl(skillNames).set("prompt", "人界力：选择获得【" + get.translation(charName) + "】的一个技能").set("choiceList", skills.map(function(s) {
                        return (get.translation(s) || s) + "：" + (lib.translate[s + "_info"] || "无描述");
                    })).set("ai", function() {
                        return 0;
                    });
                    event._skills = skills;
                    "step 2"
                    if (result.control) {
                        var idx = result.index;
                        var skill = event._skills[idx];
                        player.addSkill(skill);
                        player.popup(skill);
                        game.log(player, "获得了技能", "#g【" + get.translation(skill) + "】");
                    }
                },
                ai: {
                    order: 5,
                    result: {
                        player: 1,
                    },
                },
                "skill_id": "ying_renjieli",
                "_priority": 0,
            },
            "ying_shenyuan": {
                audio: "ext:原神拓展:2",
                enable: "phaseUse",
                limited: true,
                mark: true,
                skillAnimation: true,
                trigger: {
                    player: "dyingBegin",
                },
                filter: function(event, player) {
                    return !player.storage.ying_shenyuan;
                },
                init: function(player, skill) {
                    player.storage[skill] = false;
                },
                content: function() {
                    "step 0"
                    var isDying = _status.event.getParent().name == "dying";
                    if (isDying) {
                        player.chooseBool("是否发动【深渊】？").set("ai", function() { return true; });
                    } else {
                        event._isPhaseUse = true;
                    }
                    "step 1"
                    if (!event._isPhaseUse && !result.bool) {
                        event.finish();
                        return;
                    }
                    player.awakenSkill("ying_shenyuan");
                    player.logSkill("ying_shenyuan");
                    var others = game.filterPlayer(function(current) {
                        return current != player && current.isIn();
                    });
                    player.gainMaxHp(others.length);
                    for (var i = 0; i < others.length; i++) {
                        others[i].loseMaxHp(1);
                    }
                    for (var i = 0; i < others.length; i++) {
                        var ocards = others[i].getCards("hej");
                        if (ocards.length) {
                            others[i].discard(ocards);
                        }
                    }
                    "step 2"
                    player.recover(player.maxHp - player.hp);
                    "step 3"
                    player.removeSkill("ying_yuansu");
                    player.addSkill("ying_shenyuanliliang");
                },
                ai: {
                    order: 10,
                    result: {
                        player: 1,
                    },
                },
                intro: {
                    content: "limited",
                },
                "skill_id": "ying_shenyuan",
                "_priority": 0,
            },
            "ying_shenyuanliliang": {
                audio: "ext:原神拓展:2",
                trigger: {
                    player: "useCard",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.card && event.card.name;
                },
                content: function() {
                    trigger.directHit.addArray(game.filterPlayer(function(current) {
                        return current != player;
                    }));
                },
                mod: {
                    selectTarget: function(card, player, range) {
                        var type = get.type(card);
                        if ((type == 'basic' || type == 'trick') && range[1] > 0) {
                            range[0] = 1;
                            range[1] = Infinity;
                        }
                    },
                    targetInRange: function(card, player, target) {
                        var type = get.type(card);
                        if (type == 'basic' || type == 'trick') return true;
                    },
                },
                group: ["ying_shenyuanliliang_extra","ying_shenyuanliliang_change"],
                "skill_id": "ying_shenyuanliliang",
                "_priority": 0,
            },
            "ying_shenyuanliliang_extra": {
                trigger: {
                    source: "damageEnd",
                },
                direct: true,
                filter: function(event, player) {
                    if (player._ying_extraing) return false;
                    return event.player && event.player.isIn() && event.num > 0;
                },
                content: function() {
                    "step 0"
                    player.chooseTarget([1, Infinity], "深渊力量：对任意名目标造成" + trigger.num + "点伤害").set("ai", function(target) {
                        return get.damageEffect(target, player, player);
                    });
                    "step 1"
                    if (result.bool && result.targets && result.targets.length) {
                        player._ying_extraing = true;
                        player.logSkill("ying_shenyuanliliang_extra");
                        for (var i = 0; i < result.targets.length; i++) {
                            if (result.targets[i].isIn()) {
                                result.targets[i].damage(trigger.num, player);
                            }
                        }
                    }
                    game.delayx();
                    "step 2"
                    player._ying_extraing = false;
                },
                "skill_id": "ying_shenyuanliliang_extra",
                "_priority": 0,
            },
            "ying_shenyuanliliang_change": {
                trigger: {
                    source: "damageBegin",
                },
                forced: true,
                popup: false,
                filter: function(event, player) {
                    return event.player && event.player.isIn() && event.player.name != "qiuqiuren";
                },
                content: function() {
                    trigger.player.reinit(trigger.player.name, "qiuqiuren");
                },
                "skill_id": "ying_shenyuanliliang_change",
                "_priority": 0,
            },
        },
        translate: {
            xianti: "仙体",
            "xianti_info": "锁定技，摸牌阶段你多摸三张牌；你的手牌上限始终等于你的体力上限+2。",
            chumo: "除魔",
            "chumo_info": "你可以令你造成的伤害+1；当你使用锦囊牌结算后，你可以令此牌额外结算一次。",
            nuowu: "傩舞",
            "nuowu_info": "出牌阶段限一次，你可以失去1点体力并摸5张牌、体力上限+1，此后直到你的下一回合开始：你受到的伤害-1、你的牌无法被响应且无视距离与次数限制；每回合结束时，若你体力值大于1，你失去1点体力并体力上限+1。",
            shenyou: "神佑",
            "shenyou_info": "限定技，当你进入濒死状态时，你可以将体力回满，失去技能「业障」，获得技能「动情」。",
            yezhang: "业障",
            "yezhang_info": "锁定技，每当你击杀一名角色后，你失去1点体力上限并获得一枚「业」标记。当你拥有两枚及以上「业」标记时：若场上存在名称或技能名中含「琴笙歌音笛箫律筝弦」的存活角色，你将体力回满并清除所有「业」标记；否则你失去所有体力进入濒死状态。",
            dongqing: "动情",
            "dongqing_info": "锁定技，获得此技能时，你立即指定一名角色为目标，1.目标角色获得手牌时，你摸等量的牌（每回合限一次，不能触发效果2.)，2.你获得手牌时，目标角色摸等量的手牌（每回合限一次，不能触发效果1.）；3.目标角色受到伤害时，你可以代替目标角色受到伤害，并对伤害来源造成等量伤害；4.目标角色失去手牌时，你可以令其摸等量的牌【每轮限一次】；5.目标角色死亡时，你弃置所有牌并失去此技能。",
            dieyin: "蝶引",
            "dieyin_info": "出牌阶段，你可以失去当前一半的体力（向下取整，体力值为1时不能使用），令你的杀视为火杀，且你造成的伤害+1，直到本回合结束。",
            xuehuo: "血火",
            "xuehuo_info": "当你的体力值小于等于体力上限的一半时（向上取整），你造成的伤害+1。",
            anmi: "安神秘法",
            "anmi_info": "每局游戏限一次，结束阶段，你可以对至多5名角色各造成1点火焰伤害，随后你回复等量体力（每局游戏限一次）。",
            sangzang: "丧葬",
            "sangzang_info": "有角色进入濒死状态时（求桃之前），你可以「火化」之，其立刻死亡；若你没有选择「火化」，你的安神秘法使用次数+1。",
            yanzhang: "岩障",
            "yanzhang_info": "出牌阶段限一次，你可以对任意名计算与你距离为1的角色各造成1点伤害，然后你获得3点护甲。",
            "zhongli_tianxing": "天星",
            "zhongli_tianxing_info": "限定技，出牌阶段，你可以令任意名角色获得「石化」（石化：非锁定技失效；回合开始前跳过整个回合，然后解除此效果。此效果不等于翻面），然后这些角色各受到3点伤害。",
            bingxu: "并蓄",
            "bingxu_info": "结束阶段，若你已连续两个回合没有使用过【岩障】，你可以重置你的【天星】。使用【岩障】后重新计数。",
            shihua: "石化",
            "shihua_info": "非锁定技失效；回合开始前跳过整个回合，然后解除此效果。此效果不等于翻面。",
            "ying_yuansu": "元素",
            "ying_yuansu_info": "旅行者掌握多种元素力，当你造成伤害时，你可以选择以下任意一种元素：1.水，将此次伤害结算改为回复等量体力；2.火，将此伤害改为火焰伤害，并为目标添加一枚火标记，其在回合开始时受到等同于火标记数的火焰伤害，并移除火标记；3.风，可以将目标的座位移动至任意位置；4.雷，将此伤害改为两倍的无来源雷电伤害；5.草，为目标添加【孢子】，每轮结束时，目标减一点体力上限，【孢子】不会消失，除非目标受到火焰伤害；6.冰，令其获得一枚「寒」标记；有「寒」的角色，跳过判定与摸牌阶段，出牌阶段其使用任意技能或任意牌后其所有技能失效（包括锁定技），随后立刻结束出牌阶段，弃牌阶段，其弃置所有牌，然后失去「寒」标记；7.岩，立刻破除目标的所有护甲，弃置其所有装备牌。",
            "ying_huoyin": "火标记",
            "ying_huoyin_info": "回合开始时，受到等同于火标记数的火焰伤害，然后移除火标记。",
            "ying_baozi": "孢子",
            "ying_baozi_info": "每轮结束时减1点体力上限；受到火焰伤害后清除。",
            "ying_han": "寒",
            "ying_han_info": "跳过判定阶段和摸牌阶段；出牌阶段使用牌或发动技能后，所有技能失效并结束出牌阶段；弃牌阶段开始时，弃置所有手牌和装备区里的牌，然后失去“寒”。",
            "ying_renjieli": "人界力",
            "ying_renjieli_info": "你的回合开始前，你可以从武将列表中选择一名武将，并获得其一个技能。",
            "ying_shenyuan": "深渊",
            "ying_shenyuan_info": "限定技，出牌阶段或当你进入濒死状态时，你可以增加等同于场上其他人数点体力上限，并令其他所有人体力上限减一，弃置场上所有牌，随后回满体力值，化身【公主】，失去【元素】，获得【深渊力量】。",
            "ying_shenyuanliliang": "深渊力量",
            "ying_shenyuanliliang_info": "你使用牌不可被响应，基本牌和锦囊牌对所有人都是合法目标且无距离限制，且可以增减任意个目标数量（最少为1）；你造成伤害时，可以额外对任意目标造成等量伤害；你造成伤害时，目标将武将牌换成【丘丘人】。",
        },
    },
    intro: "",
    author: "nihility",
    diskURL: "",
    forumURL: "",
    version: "1.0",
},files:{"character":["hutao.jpg","ying_gs.jpg","shen_xiao.jpg","zhongli.jpg","qiuqiuren.jpg"],"card":[],"skill":[],"audio":[]}} 
};