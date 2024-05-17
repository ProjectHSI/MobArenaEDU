/*
  * MobArena
  * By: [Project HSI]
  * Description: Mob Arena Game.
  Base Mob Arena Game
*/

// remove when finished
//throw "not running."

/* Global Configuration */
const projectName = "mob_arena"

/* JS Engine */
player.say("Loading HSI JS Engine...")

namespace js {
    export function error(message: string) {
        clogger.log(["js", "error"], clogger.levels.ERROR, "Error!")
        clogger.log(["js", "error"], clogger.levels.ERROR, `${message}`)
        throw error
    }

    export function assert(condition: boolean, message: string) {
        if (!condition) error(message);
    }

    export function assertX(condition: boolean, func: Function) {
        if (!condition) func();
    }

    export namespace array {
        export function append(array: any[], element: any): any[] {
            array[array.length] = element
            return array
        }

        export function prepend(array: any[], element: any): any[] {
            for (let i = array.length; i > 0; i--) {
                array[i] = array[i - 1]
            }
            array[0] = element
            return array
        }
    }

    function randomInteger(min: number, max: number) {
        // from MDN
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    export function random(min: number, max: number, decimals: number) {
        const decimalsMultiplier = Math.pow(10, decimals)
        return randomInteger(min * decimalsMultiplier, max * decimalsMultiplier)
    }
}

player.say("HSI JS Engine loaded!")

/* MC Engine */
player.say("Loading HSI MC Engine...")

namespace mc {
    export interface Effect {
        spell: string,
        amount: number,
        duration: number
    }

    export interface Enchantment {
        spell: string,
        level: number
    }

    export interface UniversalItem {
        item: string,
        amount: number,
        enchantments?: Enchantment[]
    }

    export interface UniversalMob {
        mob: string,
        amount: number
    }

    export const Colour = {
        Black: "§0",
        DarkBlue: "§1",
        DarkGreen: "§2",
        DarkAqua: "§3",
        DarkRed: "§4",
        DarkPurple: "§5",
        Gold: "§6",
        Grey: "§7",
        DarkGrey: "§8",
        Blue: "§9",
        Green: "§a",
        Aqua: "§b",
        Red: "§c",
        LightPurple: "§d",
        Yellow: "§e",
        White: "§f",
        MineCoinGoldYellow: "§g",
        MaterialQuartz: "§h",
        MaterialIron: "§i",
        MaterialNetherite: "§j",
        MaterialRedstone: "§m",
        MaterialCopper: "§n",
        MaterialGold: "§p",
        MaterialEmerald: "§q",
        MaterialDiamond: "§s",
        MaterialLapis: "§t",
        MaterialAmethyst: "§u"
    }

    export const Style = {
        Obfuscated: "§k",
        Bold: "§l",
        Italic: "§o",
        Reset: "§r"
    }

    export function registerCommand(command: string, handler: (arguments: string[]) => void) {
        // define some variables here
        // so we don't need to recompute them
        const registerCommand = `.hsi_mc.${projectName}.agent.${command}`
        const commandLength = `${registerCommand} `.length

        player.onChatCommand(registerCommand, [ChatArgument.string], (args: player.ChatCommandArguments) => {
            let message = args.string
            if (message == undefined) {
                return
            }
            message = message.substr(0, commandLength)
            let arguments = message.split(".")
            handler(arguments)
        })
    }

    export function giveItemTS(targetSelector: TargetSelector, item: mc.UniversalItem) {
        if (item.item == "shield") {
            player.execute(`/replaceitem entity ${targetSelector} slot.weapon.offhand 0 ${item.item}`)
        } else if (item.item.includes("helmet")) {
            player.execute(`/replaceitem entity ${targetSelector} slot.armor.head 0 ${item.item}`)
        } else if (item.item.includes("chestplate")) {
            player.execute(`/replaceitem entity ${targetSelector} slot.armor.chest 0 ${item.item}`)
        } else if (item.item.includes("leggings")) {
            player.execute(`/replaceitem entity ${targetSelector} slot.armor.legs 0 ${item.item}`)
        } else if (item.item.includes("boot")) {
            player.execute(`/replaceitem entity ${targetSelector} slot.armor.feet 0 ${item.item}`)
        } else {
            if (item.enchantments == undefined) {
                player.execute(`/give ${targetSelector} ${item.item} ${item.amount}`)
            } else {
                player.execute(`/replaceitem entity ${targetSelector} slot.weapon.mainhand 0 ${item.item}`)
                item.enchantments.forEach((value) => {
                    player.execute(`/enchant ${targetSelector} ${value.spell} ${value.level}`)
                })
            }
        }
    }

    export function giveItem(players: string[], item: mc.UniversalItem) {
        players.forEach((value) => {
            giveItemTS(mobs.playerByName(value), item)
        })
    }

    export function clearInvTS(targetSelector: TargetSelector) {
        player.execute(`clear ${targetSelector}`)
    }

    export function clearInv(players: string[]) {
        players.forEach((value) => {
            clearInvTS(mobs.playerByName(value))
        })
    }

    export function titleTS(targetSelector: TargetSelector, title: string, subtitle: string) {
        player.execute(`title ${targetSelector} title ${title}`)
        player.execute(`title ${targetSelector} subtitle ${subtitle}`)
    }

    export function title(players: string[], title: string, subtitle: string) {
        players.forEach((value) => {
            titleTS(mobs.playerByName(value), title, subtitle)
        })
    }

    export function actionBarTS(targetSelector: TargetSelector, text: string) {
        player.execute(`title ${targetSelector} actionbar ${text}`)
    }

    export function actionBar(players: string[], text: string) {
        players.forEach((value) => {
            actionBarTS(mobs.playerByName(value), text)
        })
    }

    export function setGameRule(gameRule: string, newValue: boolean | number) {
        player.execute(`gamerule ${gameRule} ${newValue}`)
    }

    export function tpTStoTS(sourceTargetSelector: TargetSelector, targetTargetSelector: TargetSelector) {
        // check if it's a single targetSelector for targetTargetSelector
        js.assert(mobs.queryTarget(targetTargetSelector).length == 1, "Invalid TargetSelector for targetTargetSelector.")
        player.execute(`tp ${sourceTargetSelector} ${targetTargetSelector}`)
    }

    export function tpTStoPos(sourceTargetSelector: TargetSelector, targetPosition: Position) {
        // check if it's a single targetSelector for targetTargetSelector
        player.execute(`tp ${sourceTargetSelector} ${targetPosition.getValue(Axis.X)} ${targetPosition.getValue(Axis.Y)} ${targetPosition.getValue(Axis.Z)}`)
    }

    export function tpPlayerToPlayer(sourcePlayer: string, targetPlayer: string) {
        tpTStoTS(mobs.playerByName(sourcePlayer), mobs.playerByName(targetPlayer))
    }

    export function tpPlayerToPos(sourcePlayer: string, targetPosition: Position) {
        tpTStoPos(mobs.playerByName(sourcePlayer), targetPosition)
    }

    export function applyEffectToTS(targetSelector: TargetSelector, effect: Effect, hideParticles: boolean) {
        player.execute(`effect ${targetSelector} ${effect.spell} ${effect.duration} ${effect.amount} ${hideParticles}`)
    }

    export function applyEffectToPlayer(player: string, effect: Effect, hideParticles: boolean) {
        applyEffectToTS(mobs.playerByName(player), effect, hideParticles)
    }

    export function summonMob(mob: string, position: Position) {
        player.execute(`summon ${mob} ${position.getValue(Axis.X)} ${position.getValue(Axis.Y)} ${position.getValue(Axis.Z)}`)
    }
}

player.say("HSI MC Engine loaded!")

/* Logging Engine */
player.say("Loading CLogger...")

namespace clogger {
    enum LoggingBehaviour {
        SAY,
        WHISPER,
        SLIENT
    }

    interface Level {
        lvlString: string,
        colour: string, // Treat as MC.Colour since string enums (in MakeCode) are weird.
        verbose: boolean
    }

    export const levels: { [index: string]: Level } = {
        INFO: {
            lvlString: "INFO",
            colour: mc.Colour.White,
            verbose: false
        },
        WARN: {
            lvlString: "WARN",
            colour: mc.Colour.MineCoinGoldYellow,
            verbose: false
        },
        ERROR: {
            lvlString: "ERROR",
            colour: mc.Colour.Red,
            verbose: false
        },
        VERBOSE: {
            lvlString: "VERB",
            colour: mc.Colour.LightPurple,
            verbose: true
        },
        DEBUG: {
            lvlString: "DEBUG",
            colour: mc.Colour.Green,
            verbose: true
        }
    }

    const loggingBehaviour: { [index: string]: LoggingBehaviour } = {
        nonVerbose: LoggingBehaviour.SAY,
        //verbose: LoggingBehaviour.WHISPER
        verbose: LoggingBehaviour.SLIENT
    }

    function callAgentChatFunctionForLoggingBehaviour(content: string, loggingBehaviour: LoggingBehaviour): void {
        if (loggingBehaviour == LoggingBehaviour.SAY) {
            player.say(content)
        } else if (loggingBehaviour == LoggingBehaviour.WHISPER) {
            player.tell(mobs.playerByName("BIRKBECK_MCKAY_O"), content)
        }
    }

    function getLoggingBehaviourFromLevel(level: Level): LoggingBehaviour {
        if (level.verbose) {
            return loggingBehaviour.verbose
        } else {
            return loggingBehaviour.nonVerbose
        }
    }

    export function log(source: string[], level: Level, content: string) {
        source = js.array.prepend(source, projectName)
        // we put the reset style here so that it doesn't do italics if loggingBehaviour is set to WHISPER
        let parsedContent = `${mc.Style.Reset}${mc.Colour.LightPurple}${source.join("::")} ${level.colour}(${level.lvlString}) : ${content}`
        callAgentChatFunctionForLoggingBehaviour(parsedContent, getLoggingBehaviourFromLevel(level))
    }
}

player.say("CLogger loaded! Handing over logging to CLogger.")
clogger.log(["init", "clogger"], clogger.levels.INFO, "Loaded CLogger!")

/* Config */

clogger.log(["init", "game", "config"], clogger.levels.VERBOSE, "Initalizing configuration...")

// Players
clogger.log(["init", "game", "config"], clogger.levels.VERBOSE, "Loading players...")
let players: string[] = [
    "BIRKBECK_MCKAY_O"
]

clogger.log(["init", "game", "config"], clogger.levels.VERBOSE, "Players loaded. Validating entries.")

/*
mc.registerCommand("registerPlayer", (arguments: string[]) => {
    let doCommandExecute = true;

    clogger.log(["concommand", "register_player"], clogger.levels.INFO, "Player: " + arguments[0])
    
    if (arguments[0] == undefined || arguments[0] == "") {
        clogger.log(["concommand", "register_player"], clogger.levels.ERROR, `The player name isn't specified.`)
        doCommandExecute = false
    } else if (mobs.queryTarget(mobs.playerByName(arguments[0]))[0] == undefined) {
        clogger.log(["concommand", "register_player"], clogger.levels.ERROR, `The player specified isn't valid.`)
    }

    clogger.log(["concommand", "register_player"], clogger.levels.INFO, "Registered")
})
*/

clogger.log(["init", "game", "config"], clogger.levels.VERBOSE, "Loading arena config...")
interface WorldConfig {
    time: number,
    weather: Weather
}

interface FillPos {
    fromPos: Position,
    toPos: Position
}

interface Arena {
    spawnPoints: {
        arena: FillPos,
        [index: string]: FillPos
    },
    safeZone: FillPos
    worldConfig: WorldConfig
}

const arenaConfig: Arena = {
    spawnPoints: {
        arena: {
            fromPos: world(496, 71, -522),
            toPos: world(492, 71, -501)
        },
        tower: {
            fromPos: world(490, 75, -507),
            toPos: world(486, -75, -510)
        }
    },
    safeZone: {
        fromPos: world(484, 69, -532),
        toPos: world(504, 79, -499)
    },
    worldConfig: {
        time: 282000,
        weather: Weather.Clear
    }
}

interface MobSpawnEntry {
    mob: string,
    amount: number
    round: number,
    seconds: number,
    spawnType: string
}

const mobsSpawnEntryList: MobSpawnEntry[] = [
    {
        mob: "zombie",
        amount: 2,
        round: 1,
        seconds: 0,
        spawnType: "arena"
    },
    {
        mob: "creeper",
        amount: 1,
        round: 5,
        seconds: 0,
        spawnType: "arena"
    },
    {
        mob: "skeleton",
        amount: 1,
        round: 8,
        seconds: 0,
        spawnType: "tower"
    },
    {
        mob: "skeleton",
        amount: 2,
        round: 15,
        seconds: 0,
        spawnType: "arena"
    },
    {
        mob: "blaze",
        amount: 2,
        round: 15,
        seconds: 0,
        spawnType: "arena"
    },
    {
        mob: "blaze",
        amount: 2,
        round: 15,
        seconds: 0,
        spawnType: "tower"
    }
]

type GameruleTable = { [index: string]: boolean | number }

const gamerules: GameruleTable = {
    doDaylightCycle: false,
    doMobSpawning: false,
    mobGriefing: false,
    doWeatherCycle: false,
    doMobLoot: false,
    pvp: false
}

const enum GameType {
    ROUND_BASED,
    ENDLESS
}

const items: mc.UniversalItem[] = [
    {
        item: "diamond_sword",
        amount: 1,
        enchantments: []
    },
    {
        item: "shield",
        amount: 1,
        enchantments: []
    },
    {
        item: "bow",
        amount: 1
    },
    {
        item: "arrow",
        amount: 64
    },
    {
        item: "iron_helmet",
        amount: 1
    },
    {
        item: "iron_chestplate",
        amount: 1
    }, {
        item: "iron_leggings",
        amount: 1
    },
    {
        item: "iron_boots",
        amount: 1
    }
]

const gameType: GameType = GameType.ROUND_BASED

clogger.log(["init", "game", "config"], clogger.levels.VERBOSE, "Done.")

// Game

clogger.log(["init", "game", "code"], clogger.levels.VERBOSE, "Loading code.")
let playersInTheGame: string[]
let mobsInCurrentArena = 0
let maxMobsInCurrentArena = 0

let previousMobCount: { [index: string]: number }

let currentSeconds = 0
let currentRound = 1
let continueGame = true

let registrationEnabled = false

function getInbetweenPosition(posFrom: Position, posTo: Position) {
    let minX = Math.min(posFrom.getValue(Axis.X), posTo.getValue(Axis.X))
    let maxX = Math.max(posFrom.getValue(Axis.X), posTo.getValue(Axis.X))
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Min X: ${minX}.`)
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Max X: ${maxX}.`)
    let minY = Math.min(posFrom.getValue(Axis.Y), posTo.getValue(Axis.Y))
    let maxY = Math.max(posFrom.getValue(Axis.Y), posTo.getValue(Axis.Y))
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Min Y: ${minY}.`)
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Max Y: ${maxY}.`)
    let minZ = Math.min(posFrom.getValue(Axis.Z), posTo.getValue(Axis.Z))
    let maxZ = Math.max(posFrom.getValue(Axis.Z), posTo.getValue(Axis.Z))
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Min Z: ${minZ}.`)
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Max Z: ${maxZ}.`)

    let randomX = js.random(minX, maxX, 0)
    let randomY = js.random(minY, maxY, 0)
    let randomZ = js.random(minZ, maxZ, 0)

    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Random X: ${randomX}.`)
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Random Y: ${randomY}.`)
    clogger.log(["get_inbetween_position"], clogger.levels.DEBUG, `Random Z: ${randomZ}.`)

    return world(randomX, randomY, randomZ)
}

function setupWorld() {
    //clogger.log(["game", "game_rules"], clogger.levels.WARN, "The following GameRules will be modified.")
    //Object.keys(gamerules).forEach((value) => {
    //    clogger.log(["game", "game_rules"], clogger.levels.WARN, `${value}: ${gamerules[value]}`)
    //    mc.setGameRule(value, gamerules[value])
    //})
    //clogger.log(["game", "game_rules"], clogger.levels.WARN, "It is not recommended to reverse these changes until the end of the game.")

    //player.execute(`time set ${arenaConfig.worldConfig.time}`)
    //gameplay.setWeather(arenaConfig.worldConfig.weather)
}

function clearMobs(mobsSpawnEntry: MobSpawnEntry[]) {
    clogger.log([`clear_mobs`], clogger.levels.DEBUG, `Clearing mobs!`)
    mobsSpawnEntry.forEach((value) => {
        clogger.log([`clear_mobs`], clogger.levels.DEBUG, `Clearing existing mobs of type ${value.mob}`)
        // clear up stuff for countMobs
        player.execute(`kill @e[type=${value.mob}]`)
    })
}

function spawnMobs(mobsSpawnEntry: MobSpawnEntry[]) {
    clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `Spawning mobs!`)
    clearMobs(mobsSpawnEntry)
    mobsSpawnEntry.forEach((value) => {
        //loops.runInBackground(() => {
            clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `Testing should spawn.`)

            let shouldSpawn: boolean

            if (gameType == GameType.ROUND_BASED) {
                shouldSpawn = value.round <= currentRound
            } else {
                shouldSpawn = value.seconds <= currentSeconds
            }

            clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `Tested should spawn.`)

            if (shouldSpawn) {
                clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `Should spawn!`)

                let fillPosFrom = arenaConfig.spawnPoints[value.spawnType].fromPos
                let fillPosTo = arenaConfig.spawnPoints[value.spawnType].toPos

                clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `fillPosFrom and fillPosTo filled out.`)

                let effectiveMultiplier: number

                if (gameType == GameType.ROUND_BASED) {
                    effectiveMultiplier = currentRound - value.round + 1
                } else {
                    effectiveMultiplier = currentSeconds - value.seconds + 1
                }

                clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `Got multiplier.`)

                for (let i = 0; i < value.amount * effectiveMultiplier; i++) {
                    clogger.log([`spawn_mobs`], clogger.levels.DEBUG, `Summoning.`)
                    mc.summonMob(value.mob, getInbetweenPosition(fillPosFrom, fillPosTo));
                }
            }
        //})
    })
}

function teleportPlayers(players: string[]) {
    players.forEach((value) => {
        let pos = getInbetweenPosition(arenaConfig.spawnPoints.arena.fromPos, arenaConfig.spawnPoints.arena.toPos)
        mc.tpPlayerToPos(value, pos)
    })
}

function countMobs(mobList: string[]) {
    let ret: number = 0

    mobList.forEach((value) => {
        let ts = mobs.parseSelector(`@e[type=${value}]`)
        ret += mobs.queryTarget(ts).length
    })

    return ret
}

function announceMobs(current: number, max: number) {
    mc.actionBar(players, `${mc.Colour.White}Round ${mc.Colour.MineCoinGoldYellow}${currentRound}\n${mc.Colour.Red}${current} ${mc.Colour.White}/ ${mc.Colour.MineCoinGoldYellow}${max}`)
}

function positionInFillPos(checkPosition: Position, fillPos: FillPos) {
    let posFrom = fillPos.fromPos
    let posTo = fillPos.toPos

    let minX = Math.min(posFrom.getValue(Axis.X), posTo.getValue(Axis.X))
    let maxX = Math.max(posFrom.getValue(Axis.X), posTo.getValue(Axis.X))
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Min X: ${minX}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Max X: ${maxX}.`)
    let minY = Math.min(posFrom.getValue(Axis.Y), posTo.getValue(Axis.Y))
    let maxY = Math.max(posFrom.getValue(Axis.Y), posTo.getValue(Axis.Y))
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Min Y: ${minY}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Max Y: ${maxY}.`)
    let minZ = Math.min(posFrom.getValue(Axis.Z), posTo.getValue(Axis.Z))
    let maxZ = Math.max(posFrom.getValue(Axis.Z), posTo.getValue(Axis.Z))
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Min Z: ${minZ}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Max Z: ${maxZ}.`)

    let x = Math.floor(checkPosition.getValue(Axis.X))
    let y = Math.floor(checkPosition.getValue(Axis.Y))
    let z = Math.floor(checkPosition.getValue(Axis.Z))

    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `X: ${x}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Y: ${y}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Z: ${z}.`)


    let xSubcondition1 = x >= minX
    let xSubcondition2 = x <= maxX
    let xCondition = (xSubcondition1 && xSubcondition2)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `X S1: ${xSubcondition1}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `X S2: ${xSubcondition2}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `X C: ${xCondition}.`)

    let ySubcondition1 = y >= minY
    let ySubcondition2 = y <= maxY
    let yCondition = (ySubcondition1 && ySubcondition2)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Y S1: ${ySubcondition1}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Y S2: ${ySubcondition2}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Y C: ${yCondition}.`)

    let zSubcondition1 = z >= minZ
    let zSubcondition2 = z <= maxZ
    let zCondition = (zSubcondition1 && zSubcondition2)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Z S1: ${zSubcondition1}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Z S2: ${zSubcondition2}.`)
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `Z C: ${zCondition}.`)

    let superCondition = xCondition && yCondition && zCondition
    clogger.log(["position_in_fill_pos"], clogger.levels.DEBUG, `S C: ${superCondition}.`)

    return superCondition
}

function roundManager() {
    mc.title(players, `${mc.Colour.White}Round ${mc.Colour.MineCoinGoldYellow}${currentRound}`, "")

    playersInTheGame.forEach((currentPlayer) => {
        player.execute(`clear ${currentPlayer}`)
    })

    items.forEach((value) => {
        mc.giveItem(playersInTheGame, value)
    })

    playersInTheGame.forEach((currentPlayer) => {
        if (true) {
            mc.applyEffectToPlayer(currentPlayer, {
                spell: "strength",
                amount: 255,
                duration: 30
            }, false)
            mc.applyEffectToPlayer(currentPlayer, {
                spell: "regeneration",
                amount: 255,
                duration: 30
            }, false)
            mc.applyEffectToPlayer(currentPlayer, {
                spell: "regeneration",
                amount: 255,
                duration: 30
            }, false)
            mc.applyEffectToPlayer(currentPlayer, {
                spell: "speed",
                amount: 5,
                duration: 30
            }, false)
            mc.applyEffectToPlayer(currentPlayer, {
                spell: "resistance",
                amount: 255,
                duration: 30
            }, false)
            mc.applyEffectToPlayer(currentPlayer, {
                spell: "health_boost",
                amount: 10,
                duration: 30
            }, false)
        }
        mc.applyEffectToPlayer(currentPlayer, {
            spell: "instant_health",
            amount: 255,
            duration: 5
        }, true)
        mc.applyEffectToPlayer(currentPlayer, {
            spell: "saturation",
            amount: 255,
            duration: 5
        }, true)

        player.execute(`gamemode survival ${currentPlayer}`)
    })

    let mobsToBeCounted: string[] = []

    mobsSpawnEntryList.forEach((value) => {
        js.array.append(mobsToBeCounted, value.mob)
    })

    clogger.log([`round_manager`, `mobs`], clogger.levels.DEBUG, `Spawning mobs.`)

    spawnMobs(mobsSpawnEntryList)

    clogger.log([`round_manager`, `mobs`], clogger.levels.DEBUG, `Done.`)

    maxMobsInCurrentArena = countMobs(mobsToBeCounted)
    mobsInCurrentArena = countMobs(mobsToBeCounted)

    clogger.log([`round_manager`, `mobs`], clogger.levels.DEBUG, `Mobs: ${mobsInCurrentArena}`)
    clogger.log([`round_manager`, `mobs`], clogger.levels.DEBUG, `Max Mobs: ${maxMobsInCurrentArena}`)

    while (mobsInCurrentArena != 0 && continueGame) {
        announceMobs(countMobs(mobsToBeCounted), maxMobsInCurrentArena)

        playersInTheGame.forEach((currentPlayer) => {
            if (currentPlayer == undefined) {
                clogger.log([`round_manager`, `player_checks`], clogger.levels.WARN, `Crash averted!`)
                return
            }
            clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `Running on ${currentPlayer}`)
            let ts = mobs.playerByName(currentPlayer)
            let query = mobs.queryTarget(ts)[0]
            let position = world(query.x, query.y, query.z)

            clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `Got basic information.`)

            if (!positionInFillPos(position, arenaConfig.safeZone)) {
                clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `Oops, the player's dead!`)
                clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `Removing player.`)
                playersInTheGame.removeElement(currentPlayer)
                clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `Player's removed. Announcing.`)
                clogger.log(["game"], clogger.levels.INFO, `${currentPlayer} died!`)

                clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `Checking whether to continue the game.`)
                if (playersInTheGame.length == 1 || playersInTheGame.length == 0) {
                    clogger.log([`round_manager`, `player_checks`, `${currentPlayer}`], clogger.levels.DEBUG, `GAME OVER`)
                    continueGame = false
                }
            }
        })

        mobsInCurrentArena = countMobs(mobsToBeCounted)
    }
}

function startGame(arguments: string[]) {
    clogger.log(["game"], clogger.levels.VERBOSE, "Initalizing game, please wait.")

    let continueWithInitalization = true

    if (players.length == 0) {
        clogger.log(["game", "config_validator"], clogger.levels.WARN, "No players have been registered, perhaps register some players?")
        continueWithInitalization = false
    }

    players.forEach(function (v, _) {
        clogger.log(["game", "config_validator", v], clogger.levels.VERBOSE, `Player: ${v}.`)
        if (mobs.queryTarget(mobs.playerByName(v))[0] == undefined) {
            clogger.log(["game", "config_validator", v], clogger.levels.WARN, `Player ${v} isn't valid!`)
            continueWithInitalization = false
        } else {
            clogger.log(["game", "config_validator", v], clogger.levels.VERBOSE, `Player ${v} is valid!`)
        }
    })

    if (!continueWithInitalization) {
        clogger.log(["game", "config_validator"], clogger.levels.ERROR, `Something happened and the game couldn't start.`)
        clogger.log(["game", "config_validator"], clogger.levels.ERROR, `Please check the messages above and try again.`)
        return
    }

    playersInTheGame = players

    teleportPlayers(playersInTheGame)

    currentSeconds = 0;
    currentRound = 1;
    continueGame = true;

    setupWorld()

    clogger.log(["game"], clogger.levels.INFO, "Starting game.")

    while (continueGame) {
        roundManager()
        currentRound++
    }

    clogger.log(["game"], clogger.levels.INFO, "Game finished!")
    clogger.log(["game"], clogger.levels.INFO, `Round: ${currentRound - 1}`)
    clogger.log(["game"], clogger.levels.INFO, `Mobs: ${mobsInCurrentArena} / ${maxMobsInCurrentArena}`)
    if (playersInTheGame.length == 1) {
        clogger.log(["game"], clogger.levels.INFO, ``)
        clogger.log(["game"], clogger.levels.INFO, `Winning player: ${playersInTheGame[0]}`)
    }
}

function toggleRegistration(arguments: string[]) {
    if (arguments[0] != "true" && arguments[0] != "false") {
        clogger.log(["concommand", "toggle_registration"], clogger.levels.ERROR, "Argument 1 must be a boolean (true/false).")
        return
    }

    if (arguments[0] == "true") {
        registrationEnabled = true
        clogger.log(["concommand", "toggle_registration"], clogger.levels.INFO, "Registration enabled!")
    } else if (arguments[0] == "false") {
        registrationEnabled = false
        clogger.log(["concommand", "toggle_registration"], clogger.levels.INFO, "Registration disabled.")
    }
}

function registerPlayer(arguments: string[]) {
    if (!registrationEnabled) {
        clogger.log(["concommand", "register_player"], clogger.levels.ERROR, "Registration has been disabled.")
        return
    }

    if (arguments[0] != "reg" && arguments[0] != "dereg") {
        clogger.log(["concommand", "register_player"], clogger.levels.ERROR, "Argument 1 must be either 'reg' or 'dereg'.")
        return
    }

    if (arguments[1] == undefined) {
        clogger.log(["concommand", "register_player"], clogger.levels.ERROR, "Argument 2 can not be empty.")
        return
    }

    if (mobs.queryTarget(mobs.playerByName(arguments[1]))[0] == undefined) {
        clogger.log(["concommand", "register_player"], clogger.levels.ERROR, "Argument 2 must be a valid player.")
        return
    }

    if (arguments[0] == "reg") {
        if (players.indexOf(arguments[1]) != -1) {
            clogger.log(["concommand", "register_player"], clogger.levels.ERROR, "Player " + arguments[1] + " is already registered. Maybe you wanted to unregister a player?")
            return
        }
        clogger.log(["concommand", "register_player"], clogger.levels.INFO, "Registered player " + arguments[1] + ".")
        clogger.log(["concommand", "register_player"], clogger.levels.INFO, "Please put your items in a chest before we start the game.")
        players = js.array.append(players, arguments[1])
    } else if (arguments[0] == "dereg") {
        if (players.indexOf(arguments[1]) == -1) {
            clogger.log(["concommand", "register_player"], clogger.levels.ERROR, "Player " + arguments[1] + " is already unregistered. Maybe you wanted to register a player?")
            return
        }
        clogger.log(["concommand", "register_player"], clogger.levels.INFO, "Unregistered player " + arguments[1] + ".")
        players.removeElement(arguments[1])
    }
}

//mc.actionBar(players, `${mc.Colour.MineCoinGoldYellow}This is some cool text!${mc.Colour.Red} Or maybe not...`)

clogger.log(["init", "game", "code"], clogger.levels.VERBOSE, "Done.")

mc.registerCommand(`start`, startGame)
mc.registerCommand(`toggle_reg`, toggleRegistration)
mc.registerCommand(`reg_player`, registerPlayer)

clogger.log(["init", "game", "code"], clogger.levels.INFO, projectName + " is ready!")
clogger.log(["init", "game", "code"], clogger.levels.INFO, `Run commands by saying this in chat: ".hsi_mc.${projectName}.agent.{command}".`)