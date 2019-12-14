import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Team } from '../model/team';
import { OverviewService } from '../views/overview/overview.service';

@Component({
    selector: 'app-team-select',
    templateUrl: 'team-select.component.html',
    styleUrls: ['team-select.component.scss']
})
export class TeamSelectComponent implements OnInit {

    @Input() teamId: number;
    @Output() onSelect: EventEmitter<Team>;

    selectedTeam: Team;
    teams: Array<Team>;
    visible: boolean;

    constructor(
        private overviewService: OverviewService
    ) { 
        this.onSelect = new EventEmitter<any>();
        this.visible = false;
    }

    ngOnInit() { 
        this.teams = this.overviewService.getTeams().filter(team => team.id !== this.teamId);
        this.selectedTeam = this.overviewService.getTeam(this.teamId);
    }

    onTeamSelect(team: Team) {
        this.selectedTeam = team;
        this.onSelect.emit(team);
    }
}