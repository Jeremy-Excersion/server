import { objectAction } from '@server/world/actor/player/action/object-action';
import { World } from '@server/world/world';
import { world } from '@server/game-server';
import { Position } from '@server/world/position';
import { LandscapeObject } from '@runejs/cache-parser';
import { ActionType, RunePlugin } from '@server/plugins/plugin';


export const action: objectAction = (details) => {
    details.player.busy = true;
    details.player.playAnimation(3571);
    details.player.playSound(2400, 5);
    const newHopper = {
        objectId: 2722,
        x: details.object.x,
        y: details.object.y,
        level: details.object.level,
        type: details.object.type,
        rotation: details.object.rotation
    };

    world.replaceObject(2722, details.object, 1);

    setTimeout(() => {
        if (details.player.metadata['grain'] && details.player.metadata['grain'] >= 1) {
            details.player.sendMessage(`You operate the hopper. The grain slide down the chute.`);
            if (!details.player.metadata['flour']) {
                details.player.metadata['flour'] = 0;
            }
            details.player.metadata['flour'] += details.player.metadata['grain'];
            details.player.metadata['grain'] = 0;
            const flourBinPos = new Position(3166, 3306);
            const fullFlourBin: LandscapeObject = {objectId: 1782, x: 3166, y: 3306, rotation: 0, level: 0, type: 10};
            world.addLandscapeObject(fullFlourBin, flourBinPos);
        } else {
            details.player.sendMessage(`You operate the hopper. Nothing interesting happens.`);
        }
        details.player.busy = false;
    }, World.TICK_LENGTH);

};

export default new RunePlugin({
    type: ActionType.OBJECT_ACTION,
    objectIds: [2718],
    options: ['operate'],
    walkTo: true,
    action
});
