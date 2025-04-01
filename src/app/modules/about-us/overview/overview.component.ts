import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewService } from './overview.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  imports:[RouterModule]
})
export class OverviewComponent implements OnInit {

  _overviewService = inject(OverviewService);

  overviews:any = [];
  
  ngOnInit(): void {
    // this._overviewService.getAll().subscribe({
    //   next: (res) => {
    //     console.log(res);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // })
  }
}
