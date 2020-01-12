import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Team } from '../model/team';
import { OverviewService } from '../views/overview/overview.service';
import { Player } from '../model/player';

@Component({
    selector: 'app-team-select',
    templateUrl: 'team-select.component.html',
    styleUrls: ['team-select.component.scss']
})
export class TeamSelectComponent implements OnInit {

    @Input() player: Player | null;
    @Output() onSelect: EventEmitter<any>;

    selectedTeam: Team;
    teams: Array<Team>;
    visible: boolean;

    constructor(
        private overviewService: OverviewService
    ) { 
        this.player = null;
        this.onSelect = new EventEmitter<any>();
        this.visible = false;
    }

    ngOnInit() { 
        this.teams = this.overviewService.getTeams().filter(team => team.id !== this.player.team.id);
        this.selectedTeam = this.player.team;
    }

    onTeamSelect(team: Team) {
        this.selectedTeam = team;
        this.player.team = team;
        this.onSelect.emit();
    }
}