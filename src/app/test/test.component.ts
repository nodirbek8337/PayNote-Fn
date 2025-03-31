import { Component, inject, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector:'app-test',
    imports:
    [
        // RouterOutlet,
         RouterLink
        ],
    template:`
    <div class="d-flex gap-5 sidebar">
        @for (_ of [].constructor(19); track $index) {
            @if($last){
                <a routerLink="/all" class="button cyan">All Publications</a>
            }@else {
                <a [routerLink]="'/publications/20' + (($index + 8) > 9 ? '' : '0')+ ($index + 8)" class="button cyan">20{{($index + 8) > 9 ? 
                '' : '0'}}{{$index + 8}}</a>
            }
        }
      </div>

    `
})

export class TestComponent implements OnInit{
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe((value:Params) => {
            console.log(value);
        })
    }
}