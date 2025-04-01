import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-software',
  standalone: true,
  templateUrl: './software.component.html',
  styleUrl: './software.component.scss',
  imports: [NgFor, RouterModule]
})
export class SoftwareComponent implements OnInit {

  ngOnInit(): void {
      // console.log('software');
      
  }

}
