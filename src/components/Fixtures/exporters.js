/** Getting a finished draw out of the browser: text, clipboard, JSON file. */

const sideLabel = (player, isBye, feedFrom) => {
    if (!player) return isBye ? 'BYE' : 'Winner of ' + feedFrom;
    const seed = player.label || (player.ranked && player.seed ? '#' + player.seed : null);
    return (seed ? '[' + seed + '] ' : '') + player.name + (player.club ? ' (' + player.club + ')' : '');
};

/** A knockout draw as plain text - the form that gets pasted into WhatsApp. */
export function drawToText(draw, title = 'KNOCKOUT DRAW') {
    if (!draw) return '';
    const lines = [title, '='.repeat(title.length), ''];
    lines.push(draw.totalPlayers + ' players - ' + draw.bracketSize + '-player bracket'
        + (draw.byes ? ' - ' + draw.byes + ' bye' + (draw.byes > 1 ? 's' : '') : ''));
    lines.push('Draw seed: ' + draw.drawSeed + ' (re-enter it to reproduce this exact draw)');
    lines.push('');

    draw.rounds.forEach((round) => {
        lines.push(round.name.toUpperCase());
        lines.push('-'.repeat(round.name.length));
        round.matches.forEach((match, index) => {
            lines.push((index + 1) + '. '
                + sideLabel(match.a, match.isBye, match.feedA)
                + '  vs  '
                + sideLabel(match.b, match.isBye, match.feedB));
        });
        lines.push('');
    });

    if (draw.warnings.length) {
        lines.push('NOTES');
        lines.push('-----');
        draw.warnings.forEach((warning) => lines.push('- ' + warning));
    }

    return lines.join('\n');
}

/** Groups, fixtures and standings as plain text. */
export function leagueToText(groups, fixturesByGroup, standingsByGroup) {
    const lines = ['LEAGUE STAGE', '============', ''];

    groups.forEach((group) => {
        lines.push(group.name.toUpperCase() + ' (' + group.players.length + ' players)');
        lines.push('-'.repeat(group.name.length + 14));
        group.players.forEach((player) => {
            lines.push('  ' + (player.ranked ? '[#' + player.rank + '] ' : '      ')
                + player.name + (player.club ? ' (' + player.club + ')' : ''));
        });
        lines.push('');
        lines.push('  Fixtures');
        (fixturesByGroup[group.id] || []).forEach((round) => {
            lines.push('   Round ' + round.round + (round.leg === 2 ? ' (return leg)' : ''));
            round.matches.forEach((match) => {
                lines.push('     ' + match.a.name + '  vs  ' + match.b.name);
            });
        });
        lines.push('');

        const table = standingsByGroup && standingsByGroup[group.id];
        if (table && table.some((row) => row.played > 0)) {
            lines.push('  Standings');
            lines.push('   #  Player                     P  W  D  L   F   A  Diff  Pts');
            table.forEach((row) => {
                lines.push('   ' + String(row.position).padEnd(3)
                    + row.player.name.slice(0, 26).padEnd(27)
                    + String(row.played).padEnd(3)
                    + String(row.won).padEnd(3)
                    + String(row.drawn).padEnd(3)
                    + String(row.lost).padEnd(4)
                    + String(row.for).padEnd(4)
                    + String(row.against).padEnd(5)
                    + String(row.diff).padEnd(6)
                    + row.points);
            });
            lines.push('');
        }
    });

    return lines.join('\n');
}

export function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    return Promise.resolve();
}

export function downloadFile(filename, contents, type = 'application/json') {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
