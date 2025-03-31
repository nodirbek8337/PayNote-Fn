import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterLink, RouterOutlet } from "@angular/router";
@Component({
    selector:'app-publications',
    standalone:true,
    imports:[],
    templateUrl:"./publications.component.html"
})

export class PublicationsComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        console.log(true, "FROM PUBLIC");
        this.activatedRoute.queryParamMap.subscribe((value:Params) => {
            console.log(value, "FROM PUBLICAITON");
        })
    }
}