import { AnimationTriggerMetadata, trigger, state, style, animate, transition } from '@angular/animations';

export const dropAnimation: AnimationTriggerMetadata = trigger(
    'dropAnimation', [
        state('false', style({
            opacity: 0,
            height: 0,
            padding: 0,
            visibility: 'hidden',
            // borderTop: '1px solid transparent'
        })),
        state('true', style({
            opacity: 1,
            height: '*',
            padding: '*',
            // borderTop: '1px solid #dcdee2',
            visibility: 'inherit',
        })),
        transition('* => *', animate(`250ms ease-out`)),
    ]);
