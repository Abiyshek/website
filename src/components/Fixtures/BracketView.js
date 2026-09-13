import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

/** One side of a match: a drawn player, a bye, or a slot still to be filled. */
function Slot({ player, isBye, feedFrom, accent }) {
    const { theme } = useContext(ThemeContext);

    if (!player) {
        return (
            <div className={'fx-slot ' + (isBye ? 'bye' : 'pending')}>
                <span className='fx-slot-seed' style={{ background: '#c7ccd8' }}>-</span>
                <span className='fx-slot-name'>
                    {isBye ? 'BYE' : 'Winner of ' + feedFrom}
                </span>
            </div>
        );
    }

    const badge = player.label || (player.ranked && player.seed ? '#' + player.seed : '-');

    return (
        <div className='fx-slot'>
            <span
                className='fx-slot-seed'
                style={{ background: player.ranked || player.label ? accent || theme.primary : '#aab2c0' }}
            >
                {badge}
            </span>
            <span className='fx-slot-name'>{player.name}</span>
            {player.club && <span className='fx-slot-club'>{player.club}</span>}
        </div>
    );
}

/** The full bracket, one column per round, byes already advanced. */
export default function BracketView({ draw, accent }) {
    const { theme } = useContext(ThemeContext);
    if (!draw) return null;

    return (
        <div className='fx-bracket'>
            {draw.rounds.map((round) => (
                <div className='fx-round' key={round.round}>
                    <div className='fx-round-name'>{round.name}</div>
                    {round.matches.map((match) => (
                        <div className='fx-match' key={match.id}>
                            <div className='fx-match-no'>
                                {match.id}
                                {match.isBye && ' - bye'}
                            </div>
                            <Slot
                                player={match.a}
                                isBye={match.isBye && !match.a}
                                feedFrom={match.feedA}
                                accent={accent || theme.primary}
                            />
                            <Slot
                                player={match.b}
                                isBye={match.isBye && !match.b}
                                feedFrom={match.feedB}
                                accent={accent || theme.primary}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
